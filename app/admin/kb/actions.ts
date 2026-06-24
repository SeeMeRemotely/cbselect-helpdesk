'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function createArticle(formData: FormData) {
  const title    = String(formData.get('title') || '').trim();
  const category = String(formData.get('category') || '').trim();
  const body     = String(formData.get('body') || '').trim();
  const active   = formData.get('active') === 'on';

  if (!title || !body) return;

  const { error } = await supabase.from('kb_articles').insert({
    title,
    slug: toSlug(title),
    category,
    body,
    active,
  });

  if (error) throw new Error(error.message);

  revalidatePath('/help');
  revalidatePath('/admin/kb');
  redirect('/admin/kb');
}

export async function updateArticle(id: string, formData: FormData) {
  const title    = String(formData.get('title') || '').trim();
  const category = String(formData.get('category') || '').trim();
  const body     = String(formData.get('body') || '').trim();
  const active   = formData.get('active') === 'on';

  if (!title || !body) return;

  const { error } = await supabase
    .from('kb_articles')
    .update({ title, slug: toSlug(title), category, body, active, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/help');
  revalidatePath('/admin/kb');
  redirect('/admin/kb');
}

export async function deleteArticle(id: string) {
  const { error } = await supabase.from('kb_articles').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/help');
  revalidatePath('/admin/kb');
}

export async function toggleArticleActive(id: string, active: boolean) {
  const { error } = await supabase
    .from('kb_articles')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/help');
  revalidatePath('/admin/kb');
}
