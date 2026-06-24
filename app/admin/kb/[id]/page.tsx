import Link from 'next/link';
import { supabase } from '../../../../lib/supabaseClient';
import AdminNav from '../../../components/AdminNav';
import { updateArticle } from '../actions';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

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

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('kb_articles')
    .select('id, title, category, body, active')
    .eq('id', id)
    .single();

  if (error || !data) {
    return (
      <>
        <AdminNav />
        <main className="mx-auto max-w-2xl px-6 pb-12">
          <p className="text-slate-500">Article not found.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-2xl px-6 pb-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/kb" className="text-sm text-slate-500 hover:text-slate-800">
            ← Knowledgebase
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Edit Article</h1>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
          <form
            action={async (formData: FormData) => {
              'use server';
              await updateArticle(data.id, formData);
            }}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700">Title</label>
              <input
                name="title"
                required
                defaultValue={data.title}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select name="category" defaultValue={data.category} className={inputClass}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Content
                <span className="ml-2 font-normal text-slate-400 text-xs">Plain text — line breaks preserved</span>
              </label>
              <textarea
                name="body"
                required
                rows={12}
                defaultValue={data.body}
                className={`${inputClass} resize-y`}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                name="active"
                defaultChecked={data.active}
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
                Save Changes
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
