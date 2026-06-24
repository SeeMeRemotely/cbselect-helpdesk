'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

type Office = {
  id: string;
  name: string;
  city: string | null;
};

type CreatedTicket = {
  ticket_number: number;
  subject: string;
};

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

const labelClass = 'block text-sm font-medium text-slate-700';

export default function NewTicketPage() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [createdTicket, setCreatedTicket] = useState<CreatedTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState({
    requester_name: '',
    requester_email: '',
    requester_phone: '',
    office_id: '',
    category: 'General Tech Help',
    subject: '',
    description: '',
  });

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submitTicket(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setCreatedTicket(null);

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        requester_name: form.requester_name,
        requester_email: form.requester_email,
        requester_phone: form.requester_phone || null,
        office_id: form.office_id || null,
        category: form.category,
        subject: form.subject,
        description: form.description,
        status: 'New',
        priority: 'Normal',
        source: 'Portal',
      })
      .select('id, ticket_number, subject')
      .single();

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setCreatedTicket(data);

    // Fire confirmation email (non-blocking)
    fetch('/api/ticket/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId: data.id }),
    }).catch(() => {});

    setForm({
      requester_name: '',
      requester_email: '',
      requester_phone: '',
      office_id: '',
      category: 'General Tech Help',
      subject: '',
      description: '',
    });
  }

  useEffect(() => {
    supabase
      .from('offices')
      .select('id, name, city')
      .eq('active', true)
      .order('name')
      .then(({ data, error }) => {
        if (!error && data) setOffices(data);
      });
  }, []);

  if (createdTicket) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-10">
          <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-green-600">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Ticket Submitted</h1>
          <p className="mt-2 text-slate-500">Your request has been received. Someone from IT will follow up shortly.</p>

          <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Ticket #{createdTicket.ticket_number}</p>
            <p className="text-slate-800 font-medium">{createdTicket.subject}</p>
          </div>

          <div className="mt-6 flex gap-3 justify-center">
            <Link
              href="/"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Back to Home
            </Link>
            <button
              onClick={() => setCreatedTicket(null)}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Submit a Ticket</h1>
        <p className="mt-2 text-slate-500">Describe the issue and someone from IT will follow up.</p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
        <form onSubmit={submitTicket} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Your Name <span className="text-red-500">*</span></label>
              <input
                name="requester_name"
                value={form.requester_name}
                onChange={updateField}
                required
                placeholder="Jane Smith"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email <span className="text-red-500">*</span></label>
              <input
                name="requester_email"
                type="email"
                value={form.requester_email}
                onChange={updateField}
                required
                placeholder="jane@cbselect.com"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Phone <span className="text-slate-400 font-normal">(optional)</span></label>
              <input
                name="requester_phone"
                value={form.requester_phone}
                onChange={updateField}
                placeholder="(918) 555-0100"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Office</label>
              <select
                name="office_id"
                value={form.office_id}
                onChange={updateField}
                className={inputClass}
              >
                <option value="">Select your office</option>
                {offices.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={updateField}
              className={inputClass}
            >
              <option>Email Setup</option>
              <option>Printer Drivers</option>
              <option>Copiers / Scanning</option>
              <option>Phones / Voicemail</option>
              <option>Google Workspace</option>
              <option>Dotloop / Zillow</option>
              <option>Office Wi-Fi</option>
              <option>Security / Phishing</option>
              <option>General Tech Help</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Subject <span className="text-red-500">*</span></label>
            <input
              name="subject"
              value={form.subject}
              onChange={updateField}
              required
              placeholder="Brief summary of the issue"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Describe the Issue <span className="text-red-500">*</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              required
              rows={5}
              placeholder="What's happening? When did it start? What have you tried?"
              className={inputClass}
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Submitting…' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
