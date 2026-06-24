import Link from 'next/link';
import AdminNav from '../../../components/AdminNav';
import { createArticle } from '../actions';

const CATEGORIES = [
  'Email Setup',
  'Printer Drivers',
  'Copiers / Scanning',
  'Phones / Voicemail',
  'Google Workspace',
  'Dotloop / Zillow',
  'Office Wi-Fi',
  'Security / Phishing',
  'General Tech Help',
];

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

export default function NewArticlePage() {
  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-2xl px-6 pb-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/kb" className="text-sm text-slate-500 hover:text-slate-800">
            ← Knowledgebase
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">New Article</h1>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
          <form action={createArticle} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">Title</label>
              <input
                name="title"
                required
                placeholder="e.g. Set Up Google Workspace Email on iPhone"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select name="category" className={inputClass}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Content
                <span className="ml-2 font-normal text-slate-400 text-xs">Plain text — line breaks are preserved</span>
              </label>
              <textarea
                name="body"
                required
                rows={12}
                placeholder="Write the article here. Use blank lines between paragraphs. You can include URLs directly in the text."
                className={`${inputClass} resize-y`}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                name="active"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              <label htmlFor="active" className="text-sm font-medium text-slate-700">
                Published (visible on the Knowledgebase page)
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Create Article
              </button>
              <Link
                href="/admin/kb"
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
