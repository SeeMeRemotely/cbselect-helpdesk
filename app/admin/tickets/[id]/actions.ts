'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '../../../../lib/supabaseClient';

export async function updateTicketStatus(ticketId: string, status: string) {
  const { error } = await supabase
    .from('tickets')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', ticketId);

  if (error) {
    throw new Error(error.message);
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