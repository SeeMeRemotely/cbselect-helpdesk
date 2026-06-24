import { supabase } from '../../../../lib/supabaseClient';
import StatusBadge from '../../../components/StatusBadge';
import PriorityBadge from '../../../components/PriorityBadge';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ token: string }> };

type Ticket = {
  id: string;
  ticket_number: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  requester_name: string;
  requester_email: string;
  category: string | null;
  created_at: string;
  offices: { name: string } | null;
};

type Message = {
  id: string;
  sender_name: string;
  body: string;
  created_at: string;
};

export default async function TicketStatusPage({ params }: Props) {
  const { token } = await params;

  const { data: ticketData } = await supabase
    .from('tickets')
    .select(`
      id, ticket_number, subject, description, status, priority,
      requester_name, requester_email, category, created_at,
      offices ( name )
    `)
    .eq('view_token', token)
    .single();

  const ticket = ticketData as Ticket | null;

  // Fetch public (non-internal) replies only — needs actual ticket id
  const { data: messagesData } = ticket
    ? await supabase
        .from('ticket_messages')
        .select('id, sender_name, body, created_at')
        .eq('ticket_id', ticket.id)
        .eq('is_internal_note', false)
        .order('created_at', { ascending: true })
    : { data: [] };

  const messages = (messagesData || []) as Message[];

  if (!ticket) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16 text-center">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-10">
          <h1 className="text-xl font-bold text-slate-900">Ticket not found</h1>
          <p className="mt-2 text-slate-500 text-sm">
            This link may be invalid or expired. Please{' '}
            <a href="/ticket/new" className="text-blue-600 hover:underline">
              submit a new ticket
            </a>{' '}
            if you need help.
          </p>
        </div>
      </main>
    );
  }

  const isClosed = ['Resolved', 'Closed'].includes(ticket.status);

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
          Ticket #{ticket.ticket_number}
        </p>
        <h1 className="text-2xl font-bold text-slate-900">{ticket.subject}</h1>
        <p className="mt-1 text-sm text-slate-400">
          Opened {new Date(ticket.created_at).toLocaleString()}
        </p>
      </div>

      {/* Status banner */}
      <div className={`rounded-xl border p-4 mb-6 flex items-center gap-3 ${
        isClosed ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex-1">
          <p className={`text-sm font-semibold ${isClosed ? 'text-purple-800' : 'text-blue-800'}`}>
            {isClosed
              ? 'This ticket has been resolved.'
              : 'Your request is being worked on.'}
          </p>
          <p className={`text-xs mt-0.5 ${isClosed ? 'text-purple-600' : 'text-blue-600'}`}>
            IT will contact you at {ticket.requester_email}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      <div className="space-y-4">
        {/* Original message */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
              {ticket.requester_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{ticket.requester_name}</p>
              <p className="text-xs text-slate-400">Original request</p>
            </div>
          </div>
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
            {ticket.description}
          </p>
        </div>

        {/* IT replies */}
        {messages.map((msg) => (
          <div key={msg.id} className="rounded-2xl bg-slate-50 border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  IT
                </div>
                <p className="text-sm font-semibold text-slate-800">{msg.sender_name}</p>
              </div>
              <p className="text-xs text-slate-400">
                {new Date(msg.created_at).toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {msg.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <a href="/ticket/new" className="text-sm text-blue-600 hover:underline">
          Submit another ticket
        </a>
      </div>
    </main>
  );
}
