'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '../../../../lib/supabaseClient';
import { sendEmail, statusUpdateEmail, staffReplyEmail } from '../../../../lib/email';

export async function updateTicketStatus(ticketId: string, status: string) {
  // Fetch ticket info for the notification email
  const { data: ticket } = await supabase
    .from('tickets')
    .select('ticket_number, subject, requester_name, requester_email, view_token')
    .eq('id', ticketId)
    .single();

  const { error } = await supabase
    .from('tickets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', ticketId);

  if (error) throw new Error(error.message);

  // Send status update email
  if (ticket?.requester_email && ticket?.view_token) {
    const { subject, html } = statusUpdateEmail({
      ticketNumber: ticket.ticket_number,
      subject: ticket.subject,
      requesterName: ticket.requester_name,
      newStatus: status,
      viewToken: ticket.view_token,
    });
    await sendEmail({ to: ticket.requester_email, subject, html });
  }

  revalidatePath('/admin');
  revalidatePath(`/admin/tickets/${ticketId}`);
}

export async function updateTicketPriority(ticketId: string, priority: string) {
  const { error } = await supabase
    .from('tickets')
    .update({
      priority,
      updated_at: new Date().toISOString(),
    })
    .eq('id', ticketId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin');
  revalidatePath(`/admin/tickets/${ticketId}`);
}

export async function sendReplyToRequester(ticketId: string, formData: FormData) {
  const body = String(formData.get('body') || '').trim();
  if (!body) return;

  // Fetch ticket info
  const { data: ticket } = await supabase
    .from('tickets')
    .select('ticket_number, subject, requester_name, requester_email, view_token')
    .eq('id', ticketId)
    .single();

  // Save to thread (visible to requester)
  const { error } = await supabase
    .from('ticket_messages')
    .insert({
      ticket_id: ticketId,
      sender_name: 'IT Staff',
      sender_email: 'helpdesk',
      sender_type: 'staff',
      body,
      is_internal_note: false,
    });

  if (error) throw new Error(error.message);

  await supabase
    .from('tickets')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', ticketId);

  // Email the requester
  if (ticket?.requester_email && ticket?.view_token) {
    const { subject, html } = staffReplyEmail({
      ticketNumber: ticket.ticket_number,
      subject: ticket.subject,
      requesterName: ticket.requester_name,
      replyBody: body,
      viewToken: ticket.view_token,
    });
    await sendEmail({ to: ticket.requester_email, subject, html });
  }

  revalidatePath('/admin');
  revalidatePath(`/admin/tickets/${ticketId}`);
}

export async function addInternalNote(ticketId: string, formData: FormData) {
  const body = String(formData.get('body') || '').trim();

  if (!body) {
    return;
  }

  const { error } = await supabase
    .from('ticket_messages')
    .insert({
      ticket_id: ticketId,
      sender_name: 'IT Staff',
      sender_email: 'helpdesk',
      sender_type: 'staff',
      body,
      is_internal_note: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  await supabase
    .from('tickets')
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq('id', ticketId);

  revalidatePath('/admin');
  revalidatePath(`/admin/tickets/${ticketId}`);
}