import Link from 'next/link';
import { logout } from '../admin/actions';

export default function AdminNav() {
  return (
    <div className="bg-slate-800 border-b border-slate-700 mb-8">
      <div className="mx-auto max-w-7xl px-6 py-2 flex items-center justify-between">
        <nav className="flex gap-1">
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            Tickets
          </Link>
          <Link
            href="/admin/kb"
            className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            Knowledgebase
          </Link>
        </nav>

        <form action={logout}>
          <button
            type="submit"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
