const styles: Record<string, string> = {
  'New':              'bg-blue-100 text-blue-800 ring-blue-200',
  'Open':             'bg-green-100 text-green-800 ring-green-200',
  'Waiting on Agent': 'bg-amber-100 text-amber-800 ring-amber-200',
  'Waiting on Vendor':'bg-orange-100 text-orange-800 ring-orange-200',
  'Resolved':         'bg-purple-100 text-purple-800 ring-purple-200',
  'Closed':           'bg-slate-100 text-slate-600 ring-slate-200',
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = styles[status] ?? 'bg-slate-100 text-slate-600 ring-slate-200';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cls}`}>
      {status}
    </span>
  );
}
