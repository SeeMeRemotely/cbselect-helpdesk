import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-slate-900 text-white shadow-lg">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
              <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
            </svg>
          </div>
          <span className="font-bold text-base tracking-tight">CB Select Helpdesk</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/help"
            className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg text-sm transition-colors"
          >
            Knowledgebase
          </Link>
          <Link
            href="/ticket/new"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-2"
          >
            Submit a Ticket
          </Link>
          <Link
            href="/admin"
            className="text-slate-600 hover:text-slate-400 px-3 py-2 rounded-lg text-xs transition-colors ml-3"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
