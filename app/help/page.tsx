import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export const dynamic = 'force-dynamic';

type Article = {
  id: string;
  title: string;
  category: string;
  body: string;
};

// Detect bare URLs in text and make them clickable
function renderBody(body: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = body.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline break-all"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default async function HelpPage() {
  const { data } = await supabase
    .from('kb_articles')
    .select('id, title, category, body')
    .eq('active', true)
    .order('category')
    .order('sort_order');

  const articles = (data || []) as Article[];

  // Group by category
  const grouped = articles.reduce<Record<string, Article[]>>((acc, a) => {
    (acc[a.category] ||= []).push(a);
    return acc;
  }, {});

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Knowledgebase</h1>
        <p className="mt-2 text-slate-500">
          Common setup guides and support information for CB Select agents.
        </p>
      </div>

      {articles.length === 0 && (
        <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center text-slate-400">
          No articles published yet.
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category}>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
              {category}
            </h2>
            <div className="space-y-4">
              {items.map((article) => (
                <div
                  key={article.id}
                  className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{article.title}</h3>
                  <p className="mt-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {renderBody(article.body)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-slate-500">
          Can&apos;t find what you need?{' '}
          <Link href="/ticket/new" className="text-blue-600 hover:underline font-medium">
            Submit a support ticket
          </Link>
        </p>
      </div>
    </main>
  );
}
