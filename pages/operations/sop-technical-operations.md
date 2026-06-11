# Technical Operations SOP

**Version:** 1.0  
**Date:** June 2026  
**Owner:** Engineering / Technical Operations  
**Applies to:** Mind Measure platform (University and Pro products)

---

## Purpose

This SOP documents the day-to-day technical operation of the Mind Measure platform. It is written for a developer or technical operations hire who needs to run, maintain, monitor, and deploy the platform. It is not a developer setup guide or an architecture reference — it is an operations reference.

---

## 1. Platform inventory

### 1.1 Production applications

| Application | URL | Repo | Purpose |
|---|---|---|---|
| University Admin Dashboard | admin.mindmeasure.co.uk | mind-measure-core | University analytics, content, reporting; all `/api/*` |
| Pro Admin Dashboard | admin.mindmeasurepro.com | mind-measure-pro-core | Corporate analytics, reporting; `/api/companies/*` |
| Student Mobile App | mobile.mindmeasure.app | mind-measure-mobile-final | Student check-ins, Jodie, scores |
| Employee Mobile App | mobile.mindmeasurepro.app | mind-measure-pro-mobile | Employee check-ins, Jodie, scores |
| University Content Hub | hub.mindmeasure.co.uk | mind-measure-university-hub | University content delivery |
| Corporate Content Hub | hub.mindmeasurepro.com | mind-measure-pro-hub | Corporate content delivery |
| University Insight Hub | insight.mindmeasure.co.uk | mind-measure-university-insight-hub | Conversational Insight (thin UI proxy onto core) |
| Corporate Insight Hub | insight.mindmeasurepro.com | mind-measure-pro-insight-hub | Conversational Insight (thin UI proxy onto pro-core) |
| Marketing CMS | marketing.mindmeasure.co.uk | mind-measure-marketing-cms | Next.js + Prisma content management, S3 uploads |

All web applications are hosted on Vercel. Mobile apps (Student and Employee) are React + Capacitor native apps distributed via the App Store and Google Play; end users never use a web browser. The web bundle is hosted on Vercel for OTA updates and CI previews only.

### 1.2 AWS services (all eu-west-2, London)

| Service | Role |
|---|---|
| Aurora Serverless v2 (PostgreSQL) | Primary database for both products |
| Cognito | User authentication, JWT issuance |
| S3 | File storage (brand assets, reports, exports) |
| Bedrock (Claude 3.7 Sonnet) | Check-in text analysis (70% of the fusion score) |
| Bedrock (Claude Haiku 4.5) | Weekly Reflection + back-office generation (AI Insights, cohort insight, report narratives) |
| Rekognition | Facial expression analysis during check-ins |
| Lambda (6 functions) | Session processing pipeline, async workers |
| SQS | Async queue between check-in completion and Lambda workers |
| SES | Transactional email (Weekly Reflection, invites, alerts) |
| KMS | Encryption key management |
| Secrets Manager | Lambda database credentials (5-minute caching) |
| CloudWatch | Infrastructure logs and alerting |

### 1.3 Shared packages

Four private NPM packages are shared across repositories:

| Package | Contents |
|---|---|
| @mindmeasure/api-lib | API utilities, middleware, auth helpers |
| @mindmeasure/shared-services | Service layer shared across core and pro |
| @mindmeasure/shared-types | TypeScript type definitions |
| @mindmeasure/shared-ui | Shared React components |

When a shared package is updated, it must be published and the dependent repos updated before deployment.

### 1.4 External services

| Service | Purpose |
|---|---|
| ElevenLabs Conversational AI | Jodie voice agent for check-ins |
| Vercel Pro | Application hosting and serverless functions |
| GitHub | Source control and CI/CD |
| Sentry | Error tracking across all applications |

---

## 2. Routine operations

### 2.1 Daily

**Check the health dashboard.** The ecosystem health audit runs automatically every 4 hours via Vercel Cron on both platforms. Log in to the University Admin or Pro Admin superuser dashboard and review the most recent audit result. Look for:

- Database connection health and latency
- API endpoint availability (critical and important)
- Failed login activity
- Environment variable configuration gaps

The audit fires an urgent email via SES automatically if it detects a critical issue or a score drop of more than 15 points from the previous run. If you receive an alert email, treat it as an incident (see section 6).

**Check Sentry.** Review any new error events. Errors requiring immediate action are those affecting authentication, check-in submission, or data retrieval for active institutions.

**Check the SQS queue.** If the check-in volume is normal, the SQS queue should be near-empty outside of active check-in periods. A growing queue that is not draining indicates a Lambda processing problem.

```bash
aws sqs get-queue-attributes \
  --queue-url <QUEUE_URL> \
  --attribute-names ApproximateNumberOfMessages \
  --region eu-west-2
```

### 2.2 Weekly (every Sunday)

**Weekly Reflection send.** The Sunday 08:00 UTC Vercel Cron fires automatically for the university product and Pro product. After 09:00 UTC on Sunday:

1. Check the Vercel function logs for `/api/reflections/weekly` on mind-measure-core
2. Confirm the completion log: `[WeeklyReflection] Complete: X sent, X skipped, X failed`
3. If the send count is zero or `failed` count is high, follow the failed send investigation procedure in section 7

**Access review reminder.** Weekly is a good cadence to check whether any admin users at active institutions have not logged in for more than 30 days. This is not automated yet — query the database if needed (see section 5.3).

### 2.3 Monthly

**Key rotation check.** KMS keys rotate annually by default. Confirm no keys are approaching rotation failure state in the AWS KMS console.

**Dependency audit.** Run `npm audit` across all active repositories and address any HIGH or CRITICAL vulnerabilities within the timeframes in section 8.2.

**Coverage check.** Confirm CI coverage thresholds are still being met across all four active repositories. The current thresholds are statements ≥5%, branches ≥3%, functions ≥3%, lines ≥5%. Business logic, API middleware, and security services individually target 70–100%.

**Shared package versions.** Confirm all repositories are running the latest published versions of the four shared packages. Version drift creates integration risk.

---

## 3. Deployment

### 3.1 Deployment pipeline

All deployments follow the same path: push to `main` → GitHub Actions CI → Vercel auto-deploy.

GitHub Actions runs on every push and pull request to `main`:

1. TypeScript strict typecheck
2. ESLint (flat config, zero tolerance on unused imports and explicit `any`)
3. Prettier format check
4. Vitest unit tests with coverage threshold enforcement
5. Build verification
6. Vercel auto-deploy (triggered on passing CI)
7. Post-deploy smoke tests (domain reachability, API health, database connectivity)

For mobile repositories, the CI job also runs:
- `test:multimodal` — validates multimodal endpoint integration
- `test:rekognition` — validates Rekognition endpoint

A pull request that fails any step does not deploy. Never push directly to `main` without a passing CI run, except in a production incident where a hotfix is required.

### 3.2 Pre-deployment checklist

Before merging any significant change to `main`:

- [ ] All unit tests pass locally (`npm run test`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No lint errors (`npm run lint`)
- [ ] Playwright E2E tests pass on the affected application (`npm run test:e2e`)
- [ ] If a shared package was updated: confirm all dependent repos reference the new version
- [ ] If a database migration was included: confirm the migration is backwards-compatible with the current deployed application version
- [ ] If environment variables were added: confirm they are set in Vercel for the relevant project

### 3.3 Database migrations

Migrations run against Aurora Serverless v2. Naming convention: `###_description.sql` (e.g. `031_add_safeguarding_contact_fields.sql`).

Before running a migration on production:

1. Test on a development database first
2. Confirm the migration is backwards-compatible (the previous version of the application must continue to function while the migration runs)
3. Run the migration during a low-traffic window (avoid Sunday 07:30–09:00 UTC during Weekly Reflection send)
4. Confirm row counts before and after for any tables with significant data movement

### 3.4 Rollback

Vercel supports instant rollback to any previous deployment from the Vercel dashboard:

Vercel dashboard → Project → Deployments → find the last known-good deployment → Promote to Production.

This rolls back the application code. It does not roll back database migrations. If a migration needs to be rolled back:

1. Write and test a reverse migration
2. Restore from Aurora point-in-time recovery if data loss occurred (see section 9.2)

---

## 4. Access management

### 4.1 User roles

| Role | Access |
|---|---|
| Student / Employee | Own data only via mobile app |
| University Admin / Company Admin | Institution-scoped dashboard, aggregated data |
| Superuser | All admin functions, system configuration, ecosystem audit |

### 4.2 Granting institution admin access

Institution admins are managed through the authorised-user tables, not a single `memberships` table: `university_authorized_users` (university product) and `company_authorized_users` (Pro product). The supported way to add one is the invite flow in the superuser panel, which writes the authorised-user row and sends the Cognito invite (`api/users/invite-university-user.ts` and the Pro equivalent). Use the panel rather than raw SQL so the invite and audit trail are created.

To inspect existing university admins directly:

```sql
SELECT email, role, created_at
FROM university_authorized_users
WHERE university_id = '<institution_uuid>'
ORDER BY role, email;
```

The Pro equivalent is `company_authorized_users` keyed on `company_id`. Verify the user's identity before granting access, and confirm the change with an email to the user.

### 4.3 Granting superuser access

Superuser access is restricted to Mind Measure staff only. To grant it:

```sql
SELECT make_superuser_by_email('staff@mindmeasure.co.uk');
```

Superuser access must be authorised by the Founder before it is granted. Document every superuser grant and the reason.

### 4.4 Revoking access

To remove a user's institutional admin access, delete their authorised-user row (university product shown; Pro uses `company_authorized_users` keyed on `company_id`):

```sql
DELETE FROM university_authorized_users
WHERE email = '<email>'
  AND university_id = '<institution_uuid>';
```

To delete a user account entirely (exercising the right to erasure):
The account deletion endpoint (`api/user/delete-account.ts`) clears all 12 user tables, anonymises audit logs, and deletes the Cognito account. Use the endpoint rather than manual SQL to ensure the deletion cascade is complete.

### 4.5 Email domain management

When a client's IT team adds a new email domain (e.g. after a rebrand or acquisition):

1. Add the new domain to `companies.settings.allowed_email_domains[]` via the CMS Settings tab
2. If testing is needed immediately before CMS update, also add to `DOMAIN_OVERRIDES` in `mind-measure-pro-mobile/src/services/CompanyResolver.ts`
3. Redeploy the mobile app if the code-level override was used

### 4.6 Quarterly access review

Every quarter, list all institution admins per product and review the output with the Founder (university product shown; repeat against `company_authorized_users` on the `mindmeasurepro` database for Pro):

```sql
SELECT u.email, u.role, uni.name AS institution, u.created_at
FROM university_authorized_users u
JOIN universities uni ON u.university_id = uni.id
ORDER BY uni.name, u.role;
```

Cross-reference superuser holders with `core_users` (the Mind Measure staff table). Remove access for any superuser or admin who has left the organisation or no longer needs access.

---

## 5. Database operations

The platform runs two separate Aurora databases: `mindmeasure` (university product) and `mindmeasurepro` (Pro product). The development database is `mindmeasure_dev`. Run any query against the correct database for the product you are investigating.

### 5.1 Connecting to Aurora

Aurora Serverless v2 credentials are in AWS Secrets Manager. Never store credentials in code or environment variables outside of Secrets Manager and Vercel's encrypted environment.

```bash
aws secretsmanager get-secret-value \
  --secret-id aurora-credentials \
  --region eu-west-2
```

Lambda functions retrieve credentials at runtime with 5-minute caching. Vercel functions use `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` environment variables set in the Vercel dashboard.

### 5.2 Health check

```sql
SELECT
  pg_database_size('mindmeasure') AS db_size,
  (SELECT COUNT(*) FROM pg_stat_activity) AS active_connections,
  (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active') AS active_queries;
```

Normal active connections at low traffic: 5–15. If active queries is above 50, investigate for slow queries.

### 5.3 Useful operational queries

**Check recent check-in activity:**
```sql
SELECT DATE(created_at) AS day, COUNT(*) AS checkins
FROM fusion_outputs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY day DESC;
```

**List institution admins for an access review** (university product; Pro uses `company_authorized_users`):
```sql
SELECT u.email, u.role, uni.name AS institution, u.created_at
FROM university_authorized_users u
JOIN universities uni ON u.university_id = uni.id
ORDER BY uni.name, u.role;
```

**Check audit log for a specific user:**
```sql
SELECT action_type, resource_type, ip_address, created_at, risk_level
FROM audit_logs
WHERE user_id = '<uuid>'
ORDER BY created_at DESC
LIMIT 50;
```

**Check open security incidents:**
```sql
SELECT * FROM v_open_incidents ORDER BY severity, created_at DESC;
```

### 5.4 Key rotation

To rotate the Aurora master password:

```bash
aws rds modify-db-cluster \
  --db-cluster-identifier mindmeasure-aurora \
  --master-user-password "<new-password>" \
  --apply-immediately \
  --region eu-west-2

aws secretsmanager update-secret \
  --secret-id aurora-credentials \
  --secret-string '{"username":"mindmeasure_admin","password":"<new-password>"}' \
  --region eu-west-2
```

After rotating, update the `DB_PASSWORD` environment variable in Vercel for all affected projects and redeploy. Lambda functions pick up the new credentials from Secrets Manager on their next cold start (within 5 minutes due to caching).

---

## 6. Incident response

### 6.1 Severity levels

| Level | Definition | Response time |
|---|---|---|
| P1 — Critical | Platform down or data breach | Immediate, within 15 minutes |
| P2 — High | Core feature broken for active users (check-in, auth, dashboard) | Within 1 hour |
| P3 — Medium | Degraded performance or non-critical feature broken | Within 4 hours during business hours |
| P4 — Low | Minor issue, cosmetic bug, non-blocking | Next planned deployment |

### 6.2 P1/P2 response procedure

1. **Assess.** Identify the affected application and service. Check Sentry for the error stack trace. Check the Vercel function logs for the affected project. Check CloudWatch for AWS service errors.

2. **Contain.** If a deployment caused the issue, roll back immediately (see section 3.4) rather than attempting a hotfix under pressure.

3. **Communicate.** Notify the Founder within 15 minutes of a P1 incident. If the incident affects data belonging to an active client, notify the Client Success contact for that client.

4. **Resolve.** Fix the root cause. If a hotfix is needed urgently, push directly to main with a brief explanation in the commit message.

5. **Document.** After resolution, record in the `security_incidents` table:
   - Incident type
   - Severity
   - Affected services
   - Timeline (detected, contained, resolved)
   - Root cause
   - Corrective actions

6. **Review.** Within 48 hours of a P1 incident, hold a post-mortem. Document what broke, why, and what changes prevent recurrence.

### 6.3 Suspected data breach

If you suspect unauthorised access to personal data:

1. Isolate the affected service immediately if possible
2. Notify the Founder immediately
3. Do not delete or modify any logs — they are evidence
4. Under UK GDPR Article 33, a personal data breach must be reported to the Information Commissioner's Office within 72 hours if it is likely to result in risk to individuals
5. The DPA requires notifying the affected Controller(s) within 48 hours (see the DPA template, clause 6)

---

## 7. Weekly Reflection pipeline

### 7.1 Normal operation

The cron runs automatically every Sunday at 08:00 UTC. Configured in `vercel.json`:

```json
{ "path": "/api/reflections/weekly", "schedule": "0 8 * * 0" }
```

After the run, confirm the completion log in Vercel function logs:
```
[WeeklyReflection] Complete: X sent, X skipped, X failed
```

Where `X sent` should be close to the number of active students or employees who checked in at least once in the preceding week.

### 7.2 Manual trigger (test send)

Safe — uses demo data, does not send to real users:

```bash
curl -X POST "https://admin.mindmeasure.co.uk/api/reflections/weekly?secret=<WEEKLY_REFLECTION_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{"testMode": true, "testEmail": "you@example.com"}'
```

### 7.3 Manual production trigger

Use only if the Sunday cron failed. The `ON CONFLICT DO NOTHING` guard prevents duplicate sends.

```bash
curl -X GET "https://admin.mindmeasure.co.uk/api/reflections/weekly" \
  -H "Authorization: Bearer <CRON_SECRET>"
```

### 7.4 Investigating a failed send

**Step 1 — Check Vercel logs:** mind-measure-core → Functions → `/api/reflections/weekly` → logs for the relevant Sunday. Look for:
- `[WeeklyReflection] Failed for <user_id>: <error>`
- `[WeeklyReflection] HELD (held_safety/held_bedrock) for <user_id>: <detail>`

**Step 2 — Query the database:**
```sql
SELECT user_id, send_type, safety_check_passed, safety_check_detail,
       bedrock_safety_flag, sent_at, status
FROM weekly_reflection_sends
WHERE week_start = '<YYYY-MM-DD>'
ORDER BY sent_at DESC;
```

**Step 3 — Reviewing a hold.** When `safety_check_passed = FALSE`, the reflection was held for a safeguarding reason. Do not manually override without review. If after review you determine it was a false positive:

```sql
UPDATE weekly_reflection_sends
SET send_type = 'held_review', status = 'reviewed'
WHERE user_id = '<uuid>' AND week_start = '<date>';
```

Log your reasoning. Never manually send a held reflection — re-run the pipeline for the affected user if a resend is needed.

**Step 4 — Reprocessing a single failed send.** If a send failed due to a transient error (network timeout, Bedrock timeout):

```sql
-- Confirm no existing row, or delete the failed one
DELETE FROM weekly_reflection_sends
WHERE user_id = '<uuid>' AND week_start = '<date>'
  AND status = 'failed';
```

Then trigger the production endpoint — the user will be picked up as eligible.

### 7.5 Key metrics

```sql
-- Send type breakdown for a given week
SELECT send_type, COUNT(*) AS count
FROM weekly_reflection_sends
WHERE week_start = '<YYYY-MM-DD>'
GROUP BY send_type;
```

Normal distribution: majority `standard`, some `welfare`, very few `held_safety` or `held_bedrock`. A sudden increase in holds or welfare sends may indicate a cohort wellbeing event and should be noted.

---

## 8. Security operations

### 8.1 Audit log review

Audit logs are immutable (protected by database triggers). They cannot be modified or deleted. Retention is 7 years.

To review recent PHI access:
```sql
SELECT * FROM v_recent_phi_access ORDER BY created_at DESC;
```

To review failed authentication attempts:
```sql
SELECT action_type, ip_address, created_at
FROM audit_logs
WHERE action_type = 'LOGIN_FAILURE'
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

If you see a pattern of failed logins from a single IP against a single institution, treat it as a P2 incident.

### 8.2 Vulnerability management

| Severity | Patch within |
|---|---|
| CRITICAL | 24 hours |
| HIGH | 7 days |
| MEDIUM | 30 days |
| LOW | Next maintenance window |

Run `npm audit` in each repository. Dependency vulnerabilities in production code take priority over development dependencies.

### 8.3 Cyber Essentials Plus

Cyber Essentials Plus is the current certification priority. When the assessment is initiated:

1. Gather evidence for the five technical controls: firewalls, secure configuration, user access control, malware protection, patch management
2. The security measures in Schedule 2 of the DPA template accurately describe the current technical posture and are a useful starting point for the assessment questionnaire
3. Third-party assessor will require access logs and configuration evidence for AWS security groups and Cognito settings

### 8.4 Superuser session security

Superuser authentication uses time-limited 6-digit codes sent to verified `@mindmeasure.co.uk` email addresses. Codes are HMAC-hashed, not stored in plaintext. Challenge tokens expire after single use.

If a superuser account is suspected to be compromised:
1. Revoke the account immediately via `memberships` table
2. Rotate the HMAC secret used for superuser code generation
3. Treat as a P1 incident

---

## 9. Backup and recovery

### 9.1 Automated backups

Aurora Serverless v2 provides:
- Automated backups retained for 35 days (point-in-time recovery to any second within the window)
- Daily snapshots stored in S3 (eu-west-2)
- Cross-Region Replication on S3 for disaster recovery

Vercel maintains deployment history indefinitely. Any previous deployment can be promoted to production instantly.

### 9.2 Point-in-time recovery

To restore Aurora to a previous point in time:

```bash
aws rds restore-db-cluster-to-point-in-time \
  --source-db-cluster-identifier mindmeasure-aurora \
  --db-cluster-identifier mindmeasure-aurora-restored \
  --restore-to-time "2026-06-01T12:00:00Z" \
  --region eu-west-2
```

This creates a new cluster. After verifying data integrity, update the `DB_HOST` environment variable in Vercel to point to the restored cluster and redeploy.

### 9.3 Manual backup

```bash
pg_dump -h <DB_HOST> -U <DB_USER> -d mindmeasure > backup_$(date +%Y%m%d_%H%M).sql
```

Run manual backups before any significant migration.

---

## 10. Environment variables

All environment variables are managed in Vercel's encrypted environment settings. Never commit secrets to source control.

| Variable | Purpose | Used by |
|---|---|---|
| `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Aurora PostgreSQL | All server-side functions |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` | Bedrock, SES, S3, Rekognition | Core and Pro backends |
| `COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID` | Authentication | All applications |
| `WEEKLY_REFLECTION_SECRET` | Signs web view and unsubscribe URLs; authenticates manual triggers | mind-measure-core |
| `CRON_SECRET` | Authenticates Vercel cron requests | mind-measure-core, mind-measure-pro-core |
| `SENTRY_DSN` | Error tracking | All applications |
| `ELEVENLABS_API_KEY` | Jodie voice agent | Both mobile apps |

To add a new environment variable:
1. Add it in Vercel: Project → Settings → Environment Variables
2. Add it to the local `.env.example` file (value as a placeholder, never the real value)
3. If required by a Lambda function, add it to the Lambda configuration via the AWS console or Terraform

---

## 11. Key contacts and access

| System | Access route |
|---|---|
| Vercel dashboard | vercel.com — Mind Measure team account |
| AWS console | AWS account, eu-west-2 region |
| GitHub | mindmeasure-ltd organisation |
| Sentry | Sentry project dashboard |
| ElevenLabs | ElevenLabs account (voice agent management) |
| University Superuser | admin.mindmeasure.co.uk/superuser-login |
| Pro Superuser | admin.mindmeasurepro.com/superuser-login |

Superuser credentials (email + HMAC code) are for @mindmeasure.co.uk staff only. Never share superuser credentials with clients.

---

## Key reference documents

| Document | Location |
|---|---|
| Weekly Reflection runbook | `/operations/weekly-reflection-runbook` |
| Wellbeing Protection Policy | `/operations/wellbeing-protection-policy` |
| Database provisioning playbook | `/operations/playbooks` |
| Technical Due Diligence report | `/planning/technical-due-diligence` |
| Testing and QA guide | `/operations/testing-qa` |
| Architecture Decision Records | `/adr` |

---

*© 2026 Mind Measure Ltd. Internal use only. Do not share externally.*
