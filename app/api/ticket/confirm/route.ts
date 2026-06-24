/**
 * Called by the portal after a ticket is successfully created.
 * Fetches the ticket (to get view_token), then sends a confirmation email.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';
import { sendEmail, ticketConfirmationEmail } from '../../../../lib/email';

export async function POST(req: NextRequest) {
  const { ticketId } = await req.json().catch(() => ({}));

  if (!ticketId) {
    return NextResponse.json({ error: 'Missing ticketId' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('tickets')
    .select('ticket_number, subject, requester_name, requester_email, view_token')
    .eq('id', ticketId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'Not found' }, { status: 404 });
  }

  const { subject, html } = ticketConfirmationEmail({
    ticketNumber: data.ticket_number,
    subject: data.subject,
    requesterName: data.requester_name,
    viewToken: data.view_token,
  });

  await sendEmail({ to: data.requester_email, subject, html });

  return NextResponse.json({ ok: true });
}
