import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import AdminNav from '../components/AdminNav';

export const dynamic = 'force-dynamic';

type Ticket = {
  id: string;
  ticket_number: number;
  requester_name: string;
  requester_email: string;
  category: string | null;
  subject: string;
  status: string;
  priority: string;
  source: string;
  created_at: string;
  offices: { name: string }[] | null;
};

const ALL_STATUSES = ['New', 'Open', 'Waiting on Agent', 'Waiting on Vendor', 'Resolved', 'Closed'];

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default async function AdminPage({ searchParams }: PageProps) {
  const { status: filterStatus } = await searchParams;

  const { data, error } = await supabase
    .from('tickets')
    .select(`
      id, ticket_number, requester_name, requester_email,
      category, subject, status, priority, source, created_at,
      offices ( name )
    `)
    .order('created_at', { ascending: false });

  const allTickets = (data || []) as Ticket[];

  // Counts for stat cards
  const counts = ALL_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = allTickets.filter((t) => t.status === s).length;
    return acc;
  }, {});
  const openCount = (counts['New'] ?? 0) + (counts['Open'] ?? 0);
  const waitingCount = (counts['Waiting on Agent'] ?? 0) + (counts['Waiting on Vendor'] ?? 0);

  // Filtered list
  const tickets = filterStatus
    ? allTickets.filter((t) => t.status === filterStatus)
    : allTickets.filter((t) => !['Resolved', 'Closed'].includes(t.status));

  const activeFilter = filterStatus ?? 'active';

  return (
    <>
    <AdminNav />
    <main className="mx-auto max-w-7xl px-6 pb-10">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">{allTickets.length} total tickets</p>
        </div>
        <Link
          href="/ticket/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          + New Ticket
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error.message}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">New</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">{counts['New'] ?? 0}</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Open</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{openCount}</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Waiting</p>
          <p className="mt-1 text-3xl font-bold text-amber-600">{waitingCount}</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Resolved</p>
          <p className="mt-1 text-3xl font-bold text-purple-600">{counts['Resolved'] ?? 0}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        <Link
          href="/admin"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeFilter === 'active'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          Active
        </Link>
        {ALL_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin?status=${encodeURIComponent(s)}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeFilter === s
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {s}
            {counts[s] ? (
              <span className="ml-1.5 text-xs opacity-60">{counts[s]}</span>
            ) : null}
          </Link>
        ))}
      </div>

      {/* Ticket table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">#</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Priority</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Subject</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Requester</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Office</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/tickets/${ticket.id}`}
                      className="font-semibold text-blue-600 hover:text-blue-800"
                    >
                      #{ticket.ticket_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <Link
                      href={`/admin/tickets/${ticket.id}`}
                      className="text-slate-800 hover:text-blue-600 font-medium line-clamp-1"
                    >
                      {ticket.subject}
                    </Link>
                    {ticket.category && (
                      <p className="text-xs text-slate-400 mt-0.5">{ticket.category}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-800">{ticket.requester_name}</p>
                    <p className="text-xs text-slate-400">{ticket.requester_email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-sm">
                    {ticket.offices?.[0]?.name || <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                    {timeAgo(ticket.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tickets.length === 0 && (
          <div className="py-16 text-center text-slate-400 text-sm">
            No tickets match this filter.
          </div>
        )}
      </div>
    </main>
    </>
  );
}
