import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">How can we help?</h1>
        <p className="mt-3 text-lg text-slate-500">
          Browse help articles or open a support request with the IT team.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/help"
          className="group rounded-2xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Knowledgebase</h2>
          <p className="mt-2 text-slate-500 text-sm leading-relaxed">
            Printer drivers, email setup, copier help, phones, and common issues.
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
            Browse articles
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </span>
        </Link>

        <Link
          href="/ticket/new"
          className="group rounded-2xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Submit a Ticket</h2>
          <p className="mt-2 text-slate-500 text-sm leading-relaxed">
            Send IT a support request with your office, issue, and contact info.
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
            Open a request
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </span>
        </Link>
      </div>
    </main>
  );
}
