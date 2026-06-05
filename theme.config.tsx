import React from 'react';
import { DownloadPDF } from './components/DownloadPDF';
import { LogoutButton } from './components/LogoutButton';

export default {
  logo: <span style={{ fontWeight: 'bold' }}>Mind Measure Documentation</span>,
  project: { 
    link: 'https://github.com/mindmeasure/mind-measure-core' 
  },
  navbar: {
    extraContent: <LogoutButton />,
  },
  docsRepositoryBase: 'https://github.com/mindmeasure/mind-measure-docs/blob/main',
  footer: { 
    text: `© ${new Date().getFullYear()} Mind Measure. All rights reserved.`
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Mind Measure Docs'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Mind Measure Documentation" />
      <meta property="og:description" content="Complete documentation for the Mind Measure platform" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="alternate icon" href="/favicon.ico" />
      <style>{`
        /* Hide all folder icons */
        .nextra-sidebar-container nav svg {
          display: none !important;
        }
        /* Remove extra spacing left by hidden icons */
        .nextra-sidebar-container nav a,
        .nextra-sidebar-container nav button {
          padding-left: 0 !important;
        }
        @media print {
          .nextra-sidebar-container,
          .nextra-navbar,
          .nextra-breadcrumb,
          .nextra-toc,
          nav[aria-label="breadcrumb"],
          .no-print,
          .pdf-download-bar,
          .nextra-banner-container,
          footer {
            display: none !important;
          }

          @page {
            size: A4 portrait;
            margin: 12mm 14mm;
          }

          html { font-size: 10px !important; }

          body {
            font-size: 10px !important;
            line-height: 1.45 !important;
            color: #1a1a1a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .nextra-content, .nextra-content main, main, article {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            font-size: 10px !important;
          }

          h1 { font-size: 20px !important; line-height: 1.2 !important; margin: 16px 0 8px !important; }
          h2 { font-size: 16px !important; line-height: 1.25 !important; margin: 14px 0 6px !important; }
          h3 { font-size: 13px !important; line-height: 1.3 !important; margin: 10px 0 4px !important; }
          h4, h5, h6 { font-size: 11px !important; line-height: 1.35 !important; margin: 8px 0 4px !important; }

          p, li, td, th, dd, dt, blockquote, label, span, div {
            font-size: 10px !important;
            line-height: 1.45 !important;
          }

          p { margin: 0 0 6px !important; }
          ul, ol { margin: 4px 0 6px !important; padding-left: 18px !important; }
          li { margin: 1px 0 !important; }

          table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 9px !important;
            page-break-inside: auto !important;
            margin: 6px 0 !important;
          }
          thead { display: table-header-group !important; }
          tr { page-break-inside: avoid !important; }
          th, td {
            padding: 4px 6px !important;
            font-size: 9px !important;
            line-height: 1.35 !important;
            border: 1px solid #d1d5db !important;
          }
          th {
            background: #f3f4f6 !important;
            font-weight: 600 !important;
          }

          pre, code {
            font-size: 8.5px !important;
            line-height: 1.35 !important;
          }
          pre {
            padding: 6px 8px !important;
            margin: 4px 0 6px !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 4px !important;
            background: #f9fafb !important;
            white-space: pre-wrap !important;
            word-break: break-word !important;
            page-break-inside: avoid !important;
          }
          code {
            padding: 1px 3px !important;
            background: #f3f4f6 !important;
            border-radius: 3px !important;
          }
          pre code {
            padding: 0 !important;
            background: transparent !important;
          }

          blockquote {
            margin: 4px 0 6px !important;
            padding: 4px 10px !important;
            border-left: 3px solid #d1d5db !important;
          }

          img { max-width: 100% !important; page-break-inside: avoid !important; }

          /* Phone screenshots must stay small in print; the rule above would otherwise blow them up to full page width and clip them. */
          img.print-narrow { max-width: 300px !important; display: block !important; margin: 0.5rem auto !important; }

          a { color: inherit !important; text-decoration: none !important; }

          .nextra-callout, [class*="callout"] {
            padding: 6px 10px !important;
            margin: 6px 0 !important;
            font-size: 9px !important;
            page-break-inside: avoid !important;
          }

          details { page-break-inside: avoid !important; }
          h1, h2, h3, h4 { page-break-after: avoid !important; }
        }
      `}</style>
    </>
  ),
  main({ children }: { children: React.ReactNode }) {
    return (
      <>
        <div className="pdf-download-bar" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', paddingTop: '4px' }}>
          <DownloadPDF />
        </div>
        {children}
      </>
    );
  },
  banner: {
    key: 'main-app-link',
    text: (
      <a href="https://app.mindmeasure.co.uk" target="_blank" rel="noopener noreferrer">
        Access the Mind Measure Platform →
      </a>
    )
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    titleComponent({ title, type }: { title: string; type: string }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    }
  }
};
