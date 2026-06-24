const styles: Record<string, string> = {
  'Low':    'bg-slate-100 text-slate-600 ring-slate-200',
  'Normal': 'bg-sky-100 text-sky-700 ring-sky-200',
  'High':   'bg-orange-100 text-orange-700 ring-orange-200',
  'Urgent': 'bg-red-100 text-red-700 ring-red-200',
};

export default function PriorityBadge({ priority }: { priority: string }) {
  const cls = styles[priority] ?? 'bg-slate-100 text-slate-600 ring-slate-200';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cls}`}>
      {priority}
    </span>
  );
}
