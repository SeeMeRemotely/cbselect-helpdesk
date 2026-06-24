/**
 * Outbound email via Resend (https://resend.com)
 *
 * Setup:
 *  1. Sign up at resend.com (free — 3,000 emails/month)
 *  2. Add your domain and follow the DNS verification steps
 *  3. Create an API key
 *  4. Set RESEND_API_KEY and FROM_EMAIL in .env.local
 *
 * .env.local entries:
 *   RESEND_API_KEY=re_xxxxxxxxxxxx
 *   FROM_EMAIL=CB Select Helpdesk <helpdesk@yourdomain.com>
 *   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL ?? 'CB Select Helpdesk <noreply@yourdomain.com>';

  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY is not set — email skipped');
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('[email] Resend error:', res.status, body);
  }
}

// ── Email templates ──────────────────────────────────────────────

const emailHeader = `
  <tr>
    <td style="background:#0f172a;padding:20px 32px;">
      <p style="margin:0;color:#ffffff;font-size:16px;font-weight:700;">CB Select Helpdesk</p>
    </td>
  </tr>`;

const emailFooter = `
  <tr>
    <td style="padding:16px 32px;border-top:1px solid #f1f5f9;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">
        This message was sent by the CB Select IT Helpdesk. Please do not reply to this email.
      </p>
    </td>
  </tr>`;

function emailWrapper(bodyHtml: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">
        ${emailHeader}
        ${bodyHtml}
        ${emailFooter}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(url: string, label: string) {
  return `<table cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#2563eb;border-radius:8px;">
        <a href="${url}" style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">
          ${label}
        </a>
      </td>
    </tr>
  </table>
  <p style="margin:16px 0 0;font-size:13px;color:#94a3b8;">
    Or copy this link: <a href="${url}" style="color:#2563eb;word-break:break-all;">${url}</a>
  </p>`;
}

export function statusUpdateEmail({
  ticketNumber,
  subject,
  requesterName,
  newStatus,
  viewToken,
}: {
  ticketNumber: number;
  subject: string;
  requesterName: string;
  newStatus: string;
  viewToken: string;
}) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const url = `${base}/ticket/status/${viewToken}`;

  const statusColors: Record<string, string> = {
    'New': '#3b82f6',
    'Open': '#16a34a',
    'Waiting on Agent': '#d97706',
    'Waiting on Vendor': '#ea580c',
    'Resolved': '#9333ea',
    'Closed': '#475569',
  };
  const color = statusColors[newStatus] ?? '#475569';

  return {
    subject: `Ticket #${ticketNumber} updated — ${newStatus}`,
    html: emailWrapper(`
      <tr><td style="padding:32px;">
        <p style="margin:0 0 8px;font-size:14px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:.05em;">
          Ticket #${ticketNumber}
        </p>
        <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#0f172a;">${subject}</h1>
        <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
          Hi ${requesterName}, your ticket status has been updated.
        </p>
        <div style="display:inline-block;background:${color}1a;border:1px solid ${color}40;border-radius:8px;padding:10px 20px;margin-bottom:24px;">
          <p style="margin:0;font-size:15px;font-weight:700;color:${color};">${newStatus}</p>
        </div>
        <br>
        ${ctaButton(url, 'View Ticket →')}
      </td></tr>
    `),
  };
}

export function staffReplyEmail({
  ticketNumber,
  subject,
  requesterName,
  replyBody,
  viewToken,
}: {
  ticketNumber: number;
  subject: string;
  requesterName: string;
  replyBody: string;
  viewToken: string;
}) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const url = `${base}/ticket/status/${viewToken}`;
  const escaped = replyBody.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');

  return {
    subject: `Re: [Ticket #${ticketNumber}] ${subject}`,
    html: emailWrapper(`
      <tr><td style="padding:32px;">
        <p style="margin:0 0 8px;font-size:14px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:.05em;">
          Ticket #${ticketNumber}
        </p>
        <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#0f172a;">${subject}</h1>
        <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
          Hi ${requesterName}, IT has replied to your ticket:
        </p>
        <div style="background:#f8fafc;border-left:4px solid #2563eb;border-radius:4px;padding:16px 20px;margin-bottom:24px;">
          <p style="margin:0;font-size:14px;color:#1e293b;line-height:1.7;">${escaped}</p>
        </div>
        ${ctaButton(url, 'View Full Ticket →')}
      </td></tr>
    `),
  };
}

export function ticketConfirmationEmail({
  ticketNumber,
  subject,
  requesterName,
  viewToken,
}: {
  ticketNumber: number;
  subject: string;
  requesterName: string;
  viewToken: string;
}) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const url = `${base}/ticket/status/${viewToken}`;

  return {
    subject: `Ticket #${ticketNumber} received — CB Select IT`,
    html: emailWrapper(`
      <tr><td style="padding:32px;">
        <p style="margin:0 0 8px;font-size:14px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:.05em;">
          Ticket #${ticketNumber}
        </p>
        <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#0f172a;">${subject}</h1>
        <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
          Hi ${requesterName}, we've received your request and someone from IT will follow up shortly.
        </p>
        ${ctaButton(url, 'View Ticket Status →')}
      </td></tr>
    `),
  };
}
