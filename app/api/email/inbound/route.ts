/**
 * Inbound email webhook — Postmark format
 *
 * Setup (one time):
 *  1. Sign up at postmark.com (free inbound)
 *  2. Create an Inbound Server, copy the @inbound.postmarkapp.com address
 *  3. In Gmail: Settings → Forwarding → Add a forwarding address → paste the Postmark address
 *  4. Set Postmark Webhook URL to: https://yourdomain.com/api/email/inbound
 *  5. Add INBOUND_WEBHOOK_SECRET to .env.local (set the same value in Postmark)
 *
 * .env.local entries:
 *   INBOUND_WEBHOOK_SECRET=some-long-random-string
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';
import { sendEmail, ticketConfirmationEmail } from '../../../../lib/email';

// Postmark inbound payload shape (we only use what we need)
interface PostmarkPayload {
  From?: string;
  FromName?: string;
  Subject?: string;
  TextBody?: string;
  StrippedTextReply?: string;
}

function extractName(from: string, fromName?: string): string {
  if (fromName && fromName.trim()) return fromName.trim();
  // Pull the part before @ as a fallback
  const local = from.split('@')[0].replace(/[._+]/g, ' ');
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function cleanBody(text: string | undefined): string {
  if (!text) return '';
  // Strip common email footer noise (everything after first blank+-- line)
  return text.replace(/\n--\s*\n[\s\S]*$/, '').trim();
}

export async function POST(req: NextRequest) {
  // Optional: verify shared secret header set in Postmark
  const secret = process.env.INBOUND_WEBHOOK_SECRET;
  if (secret) {
    const header = req.headers.get('x-webhook-secret');
    if (header !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  let payload: PostmarkPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const requesterEmail = payload.From?.trim() ?? '';
  const requesterName = extractName(requesterEmail, payload.FromName);
  const subject = payload.Subject?.trim() || 'No subject';
  const body = cleanBody(payload.StrippedTextReply || payload.TextBody);

  if (!requesterEmail) {
    return NextResponse.json({ error: 'Missing From' }, { status: 400 });
  }

  // Create the ticket
  const { data, error } = await supabase
    .from('tickets')
    .insert({
      requester_name: requesterName,
      requester_email: requesterEmail,
      subject,
      description: body || '(no message body)',
      status: 'New',
      priority: 'Normal',
      source: 'Email',
      category: 'General Tech Help',
    })
    .select('id, ticket_number, view_token')
    .single();

  if (error) {
    console.error('[inbound] supabase insert error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send confirmation email
  const { subject: emailSubject, html } = ticketConfirmationEmail({
    ticketNumber: data.ticket_number,
    subject,
    requesterName,
    viewToken: data.view_token,
  });

  await sendEmail({ to: requesterEmail, subject: emailSubject, html });

  return NextResponse.json({ ok: true, ticket_number: data.ticket_number });
}
