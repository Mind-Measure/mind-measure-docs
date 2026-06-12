import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'mm_session';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

// Trust domain for cross-surface SSO handoff. The admin superuser panel and
// Ops mint a short-lived (60s), aud-scoped JWT signed with this secret; this
// middleware verifies the signature here in the Edge runtime. Kept separate
// from SUPERUSER_JWT_SECRET so the handoff trust domain rotates independently.
const HANDOFF_SECRET = process.env.PLATFORM_HANDOFF_SECRET || '';
// Secret the platform login flow (core /api/auth/verify-access-code) signs
// durable session tokens with. Used to validate a session cookie that came
// from this site's own /login page.
const SUPERUSER_SECRET = process.env.SUPERUSER_JWT_SECRET || process.env.JWT_SECRET || '';

// This site's audience tag + required permission for the SSO handoff.
const AUD = 'docs';
const REQUIRED_PERMISSION = 'docs_platform_access';

function base64UrlToBytes(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

interface TokenPayload {
  sub?: string;
  email?: string;
  permissions?: string[];
  aud?: string | string[];
  exp?: number;
}

/**
 * Verify an HS256 JWT signature + expiry with the Edge Web Crypto API.
 * Returns the decoded payload only when the signature matches `secret` and
 * the token has not expired. A forged or tampered token returns null.
 */
async function verifyHs256(token: string, secret: string): Promise<TokenPayload | null> {
  if (!secret) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret) as BufferSource,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlToBytes(sigB64) as BufferSource,
      new TextEncoder().encode(`${headerB64}.${payloadB64}`) as BufferSource
    );
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payloadB64))) as TokenPayload;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Sign an HS256 JWT with the Edge Web Crypto API. */
async function signHs256(payload: Record<string, unknown>, secret: string): Promise<string> {
  const encodeSegment = (obj: Record<string, unknown>) =>
    bytesToBase64Url(new TextEncoder().encode(JSON.stringify(obj)));
  const data = `${encodeSegment({ alg: 'HS256', typ: 'JWT' })}.${encodeSegment(payload)}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret) as BufferSource,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data) as BufferSource)
  );
  return `${data}.${bytesToBase64Url(sig)}`;
}

function hasAccess(permissions: string[] | undefined): boolean {
  if (!Array.isArray(permissions)) return false;
  return permissions.includes('super_admin') || permissions.includes(REQUIRED_PERMISSION);
}

function audMatches(aud: string | string[] | undefined): boolean {
  return aud === AUD || (Array.isArray(aud) && aud.includes(AUD));
}

/** Validate a durable session cookie, signed with either trust secret. */
async function verifySession(token: string): Promise<TokenPayload | null> {
  return (await verifyHs256(token, HANDOFF_SECRET)) || (await verifyHs256(token, SUPERUSER_SECRET));
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // 1. Short-lived signed SSO handoff (?mm_sso=) from the superuser panel / Ops.
  const sso = url.searchParams.get('mm_sso');
  if (sso) {
    const payload = await verifyHs256(sso, HANDOFF_SECRET);
    if (payload && audMatches(payload.aud) && hasAccess(payload.permissions)) {
      url.searchParams.delete('mm_sso');
      const res = NextResponse.redirect(url);
      const now = Math.floor(Date.now() / 1000);
      const session = await signHs256(
        {
          sub: payload.sub,
          email: payload.email,
          permissions: payload.permissions,
          iss: 'mindmeasure-platform',
          exp: now + COOKIE_MAX_AGE,
        },
        HANDOFF_SECRET
      );
      res.cookies.set(SESSION_COOKIE, session, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
      });
      return res;
    }
    // Invalid/expired handoff: strip the param and fall through to normal auth.
    url.searchParams.delete('mm_sso');
    return NextResponse.redirect(url);
  }

  // 2. Durable session cookie — signature verified (no longer decode-only).
  const sessionCookie = req.cookies.get(SESSION_COOKIE);
  if (sessionCookie) {
    const payload = await verifySession(sessionCookie.value);
    if (payload && hasAccess(payload.permissions)) {
      return NextResponse.next();
    }
  }

  // 3. Not authenticated — redirect to login.
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.searchParams.set('from', req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!login|api/auth|_next/static|_next/image|favicon.ico|images|downloads).*)'],
};
