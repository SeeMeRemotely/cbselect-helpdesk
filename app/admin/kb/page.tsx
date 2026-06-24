import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import AdminNav from '../../components/AdminNav';
import { deleteArticle, toggleArticleActive } from './actions';

export const dynamic = 'force-dynamic';

type Article = {
  id: string;
  title: string;
  category: string;
  active: boolean;
  updated_at: string;
};

export default async function KBAdminPage() {
  const { data, error } = await supabase
    .from('kb_articles')
    .select('id, title, category, active, updated_at')
    .order('category')
    .order('sort_order');

  const articles = (data || []) as Article[];

  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-4xl px-6 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Knowledgebase</h1>
            <p className="mt-1 text-sm text-slate-500">{articles.length} articles</p>
          </div>
          <Link
            href="/admin/kb/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            + New Article
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error.message}
          </div>
        )}

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          {articles.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              No articles yet.{' '}
              <Link href="/admin/kb/new" className="text-blue-600 hover:underline">
                Create one
              </Link>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Title</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Category</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Updated</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/kb/${article.id}`}
                        className="font-medium text-slate-800 hover:text-blue-600"
                      >
                        {article.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">{article.category}</td>
                    <td className="px-4 py-3">
                      <form
                        action={async () => {
                          'use server';
                          await toggleArticleActive(article.id, !article.active);
                        }}
                      >
                        <button
                          type="submit"
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset transition-colors ${
                            article.active
                              ? 'bg-green-100 text-green-800 ring-green-200'
                              : 'bg-slate-100 text-slate-500 ring-slate-200'
                          }`}
                        >
                          {article.active ? 'Published' : 'Draft'}
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(article.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-3 justify-end">
                        <Link
                          href={`/admin/kb/${article.id}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <form
                          action={async () => {
                            'use server';
                            await deleteArticle(article.id);
                          }}
                          onSubmit="return confirm('Delete this article?')"
                        >
                          <button type="submit" className="text-sm text-red-500 hover:text-red-700">
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}
