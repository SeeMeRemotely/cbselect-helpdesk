'use client';

import { useActionState } from 'react';
import { verifyPin } from '../actions';

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(verifyPin, null);

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Admin Access</h1>
            <p className="mt-1 text-sm text-slate-500">Enter your PIN to continue</p>
          </div>

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-slate-700 mb-1">
                PIN
              </label>
              <input
                id="pin"
                name="pin"
                type="password"
                inputMode="numeric"
                required
                autoFocus
                autoComplete="current-password"
                placeholder="••••"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-center text-2xl tracking-widest shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {state?.error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60 transition-colors"
            >
              {pending ? 'Verifying…' : 'Enter'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
