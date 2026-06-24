import Link from 'next/link';
import { supabase } from '../../../../lib/supabaseClient';
import { updateTicketPriority, updateTicketStatus, addInternalNote } from './actions';
import StatusBadge from '../../../components/StatusBadge';
import PriorityBadge from '../../../components/PriorityBadge';
import AdminNav from '../../../components/AdminNav';

export const dynamic = 'force-dynamic';

type TicketPageProps = {
  params: Promise<{ id: string }>;
};

type Ticket = {
  id: string;
  ticket_number: number;
  requester_name: string;
  requester_email: string;
  requester_phone: string | null;
  category: string | null;
  subject: string;
  description: string;
  status: string;
  priority: string;
  source: string;
  created_at: string;
  offices: { name: string; city: string | null } | null;
};

type TicketMessage = {
  id: string;
  sender_name: string;
  sender_type: string;
  body: string;
  is_internal_note: boolean;
  created_at: string;
};

const STATUSES = ['New', 'Open', 'Waiting on Agent', 'Waiting on Vendor', 'Resolved', 'Closed'];
const PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'];

export default async function TicketDetailPage({ params }: TicketPageProps) {
  const { id } = await params;

  const [{ data: ticketData, error }, { data: messagesData }] = await Promise.all([
    supabase
      .from('tickets')
      .select(`
        id, ticket_number, requester_name, requester_email, requester_phone,
        category, subject, description, status, priority, source, created_at,
        offices ( name, city )
      `)
      .eq('id', id)
      .single(),
    supabase
      .from('ticket_messages')
      .select('id, sender_name, sender_type, body, is_internal_note, created_at')
      .eq('ticket_id', id)
      .order('created_at', { ascending: true }),
  ]);

  const ticket = ticketData as Ticket | null;
  const notes = (messagesData || []) as TicketMessage[];

  return (
    <>
    <AdminNav />
    <main className="mx-auto max-w-4xl px-6 pb-10">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
        </svg>
        Back to Admin
      </Link>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 mb-6">
          {error.message}
        </div>
      )}

      {!ticket && !error && (
        <div className="text-slate-500">Ticket not found.</div>
      )}

      {ticket && (
        <div className="space-y-6">
          {/* Ticket header */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  Ticket #{ticket.ticket_number} · via {ticket.source}
                </p>
                <h1 className="text-2xl font-bold text-slate-900 leading-snug">
                  {ticket.subject}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Opened {new Date(ticket.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left column: description + notes */}
            <div className="lg:col-span-2 space-y-6">
              {/* Original description */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
                    {ticket.requester_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{ticket.requester_name}</p>
                    <p className="text-xs text-slate-400">{ticket.requester_email}</p>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
                  {ticket.description}
                </p>
              </div>

              {/* Notes thread */}
              {notes.length > 0 && (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className={`rounded-2xl border p-5 ${
                        note.is_internal_note
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            note.sender_type === 'staff'
                              ? 'bg-slate-200 text-slate-600'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {note.sender_name.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-sm font-semibold text-slate-800">{note.sender_name}</p>
                          {note.is_internal_note && (
                            <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                              Internal Note
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          {new Date(note.created_at).toLocaleString()}
                        </p>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
                        {note.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add internal note */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">Add Internal Note</h2>
                <form
                  action={async (formData: FormData) => {
                    'use server';
                    await addInternalNote(ticket.id, formData);
                  }}
                >
                  <textarea
                    name="body"
                    rows={4}
                    required
                    placeholder="Notes visible to IT staff only…"
                    className="w-full rounded-xl border border-slate-300 bg-amber-50 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
                    >
                      Save Note
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right column: requester + ticket details + actions */}
            <div className="space-y-5">
              {/* Requester */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Requester</h2>
                <p className="font-semibold text-slate-900">{ticket.requester_name}</p>
                <p className="text-sm text-slate-500 mt-0.5">{ticket.requester_email}</p>
                {ticket.requester_phone && (
                  <p className="text-sm text-slate-500">{ticket.requester_phone}</p>
                )}
              </div>

              {/* Ticket info */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Details</h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Office</dt>
                    <dd className="font-medium text-slate-800">{ticket.offices?.name || '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Category</dt>
                    <dd className="font-medium text-slate-800">{ticket.category || '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Source</dt>
                    <dd className="font-medium text-slate-800">{ticket.source}</dd>
                  </div>
                </dl>
              </div>

              {/* Change status */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Status</h2>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((status) => (
                    <form
                      key={status}
                      action={async () => {
                        'use server';
                        await updateTicketStatus(ticket.id, status);
                      }}
                    >
                      <button
                        type="submit"
                        disabled={ticket.status === status}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                          ticket.status === status
                            ? 'bg-slate-900 text-white cursor-default'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {status}
                      </button>
                    </form>
                  ))}
                </div>
              </div>

              {/* Change priority */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Priority</h2>
                <div className="flex flex-wrap gap-2">
                  {PRIORITIES.map((priority) => (
                    <form
                      key={priority}
                      action={async () => {
                        'use server';
                        await updateTicketPriority(ticket.id, priority);
                      }}
                    >
                      <button
                        type="submit"
                        disabled={ticket.priority === priority}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                          ticket.priority === priority
                            ? 'bg-slate-900 text-white cursor-default'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {priority}
                      </button>
                    </form>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
    </>
  );
}
