'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { SEGMENT_LABELS } from '../../../../lib/crm/types';
import { actionAddLead } from '../actions';

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  organization: '',
  segment: 'coach',
  city: '',
  state: '',
};

/** Manual lead entry. Email is the only hard requirement — it is the dedupe key. */
export default function AddLeadForm() {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const field = (key: keyof typeof EMPTY) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('A valid email is required — it is how duplicates are prevented.');
      return;
    }

    startTransition(() => {
      void actionAddLead(form).then((id) => {
        setForm(EMPTY);
        router.push(`/crm/lead/${id}`);
      });
    });
  }

  const input =
    'w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--primary)] focus:outline-none';
  const label = 'text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground';

  return (
    <form onSubmit={submit} className="mt-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className={label}>Program / organization</span>
          <input {...field('organization')} className={`mt-1 ${input}`} placeholder="Desert Vista HS XC" />
        </label>
        <label className="block">
          <span className={label}>Segment</span>
          <select {...field('segment')} className={`mt-1 ${input}`}>
            {Object.entries(SEGMENT_LABELS).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={label}>First name</span>
          <input {...field('firstName')} className={`mt-1 ${input}`} />
        </label>
        <label className="block">
          <span className={label}>Last name</span>
          <input {...field('lastName')} className={`mt-1 ${input}`} />
        </label>
        <label className="block">
          <span className={label}>Email *</span>
          <input {...field('email')} type="email" required className={`mt-1 ${input}`} />
        </label>
        <label className="block">
          <span className={label}>Phone</span>
          <input {...field('phone')} type="tel" className={`mt-1 ${input}`} />
        </label>
        <label className="block">
          <span className={label}>City</span>
          <input {...field('city')} className={`mt-1 ${input}`} />
        </label>
        <label className="block">
          <span className={label}>State</span>
          <input {...field('state')} maxLength={2} className={`mt-1 ${input}`} placeholder="AZ" />
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-[var(--destructive)]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded bg-[var(--primary)] px-5 py-2 text-sm text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-40"
      >
        {pending ? 'Adding…' : 'Add lead'}
      </button>
    </form>
  );
}
