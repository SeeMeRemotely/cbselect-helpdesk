'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function verifyPin(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const pin = formData.get('pin')?.toString() ?? '';
  const correct = process.env.ADMIN_PIN;

  if (!correct) {
    return { error: 'ADMIN_PIN is not set in environment variables.' };
  }

  if (pin !== correct) {
    return { error: 'Incorrect PIN. Try again.' };
  }

  const cookieStore = await cookies();
  cookieStore.set('admin_auth', 'verified', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  redirect('/admin');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
  redirect('/admin/login');
}
