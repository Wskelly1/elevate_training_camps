'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import type { Lead, LeadStatus } from '../../../../lib/crm/types';
import { SEGMENT_LABELS } from '../../../../lib/crm/types';
import {
  actionAddNote,
  actionLogCall,
  actionSaveField,
  actionSetCallback,
  actionSetStatus,
} from '../actions';
import { relativeDays } from '../ui';

/**
 * One lead, full screen, with the disposition buttons a call actually ends in.
 *
 * Carried over from the source CRM, which got this right: the value is that
 * you never leave the keyboard or hunt for a save button, so 120 calls is a
 * grind you can finish rather than abandon.
 *
 * The position is held client-side and the queue is not re-fetched between
 * calls — a list that reorders under you mid-session is the fastest way to
 * lose your place and double-call someone.
 */

const DISPOSITIONS: Array<{
  key: string;
  label: string;
  status?: LeadStatus;
  tone: 'good' | 'warn' | 'plain' | 'bad';
}> = [
  { key: 'interested', label: 'Interested', status: 'interested', tone: 'good' },
  { key: 'callback', label: 'Call back', tone: 'warn' },
  { key: 'no_answer', label: 'No answer', status: 'contacted', tone: 'plain' },
  { key: 'left_message', label: 'Left message', status: 'contacted', tone: 'plain' },
  { key: 'not_interested', label: 'Not interested', status: 'no_interest', tone: 'bad' },
];

const TONES = {
  good: 'border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10',
  warn: 'border-[var(--accent-rock)] text-[var(--accent-rock)] hover:bg-[var(--accent-rock)]/10',
  plain: 'border-border text-muted-foreground hover:border-foreground hover:text-foreground',
  bad: 'border-border text-muted-foreground hover:border-[var(--destructive)] hover:text-[var(--destructive)]',
};

export default function CallMode({ queue }: { queue: Lead[] }) {
  const [index, setIndex] = useState(0);
  const [note, setNote] = useState('');
  const [phone, setPhone] = useState('');
  const [pending, startTransition] = useTransition();

  const lead = queue[index];
  const done = index >= queue.length;

  function advance() {
    setNote('');
    setPhone('');
    setIndex((i) => i + 1);
  }

  function dispose(d: (typeof DISPOSITIONS)[number]) {
    const id = lead.id;
    const text = note.trim();
    const newPhone = phone.trim();

    startTransition(() => {
      void (async () => {
        if (newPhone && newPhone !== lead.phone) await actionSaveField(id, 'phone', newPhone);
        if (text) await actionAddNote(id, text);
        await actionLogCall(id, d.key, text);

        if (d.key === 'callback') {
          // Default to this time tomorrow — a callback with no date is just a
          // lead you will forget.
          const tomorrow = new Date(Date.now() + 86_400_000);
          await actionSetCallback(id, tomorrow.toISOString());
        } else if (d.status) {
          await actionSetStatus(id, d.status);
        }
      })();
    });

    advance();
  }

  if (done) {
    return (
      <div className="rounded-lg border border-[var(--primary)]/40 bg-[var(--primary)]/5 px-6 py-16 text-center">
        <div className="font-[family-name:var(--font-display)] text-2xl text-[var(--primary-deep)]">
          Queue complete
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {queue.length} {queue.length === 1 ? 'lead' : 'leads'} worked through. Reload for a fresh
          queue.
        </p>
        <Link
          href="/crm"
          className="mt-6 inline-block rounded border border-border px-4 py-2 text-sm text-foreground hover:border-[var(--primary)]"
        >
          Back to leads
        </Link>
      </div>
    );
  }

  const name = [lead.firstName, lead.lastName].filter(Boolean).join(' ');

  return (
    <div className={pending ? 'opacity-70 transition-opacity' : 'transition-opacity'}>
      <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {index + 1} of {queue.length}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="rounded border border-border px-2.5 py-1 hover:border-foreground disabled:opacity-30"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={advance}
            className="rounded border border-border px-2.5 py-1 hover:border-foreground"
          >
            Skip →
          </button>
        </div>
      </div>

      {/* Progress through the queue. */}
      <div className="mb-6 h-0.5 w-full bg-border">
        <div
          className="h-0.5 bg-[var(--primary)] transition-all"
          style={{ width: `${(index / queue.length) * 100}%` }}
        />
      </div>

      <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--primary-deep)]">
              {lead.organization || name || lead.email}
            </h2>
            <div className="mt-1 text-sm text-muted-foreground">
              {[name && lead.organization ? name : '', [lead.city, lead.state].filter(Boolean).join(', ')]
                .filter(Boolean)
                .join(' · ')}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground">
            <span className="rounded border border-border px-2 py-0.5 uppercase tracking-[0.08em]">
              {SEGMENT_LABELS[lead.segment]}
            </span>
            <span>Last contacted: {relativeDays(lead.lastContactedAt)}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground">
              Phone
            </label>
            {lead.phone ? (
              <a
                href={`tel:${lead.phone}`}
                className="mt-1 block font-[family-name:var(--font-geist-mono)] text-2xl text-[var(--primary)] hover:underline"
              >
                {lead.phone}
              </a>
            ) : (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Add a number…"
                className="mt-1 w-full rounded border border-border bg-background px-3 py-2 font-[family-name:var(--font-geist-mono)] text-lg text-foreground focus:border-[var(--primary)] focus:outline-none"
              />
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="mt-3 block truncate text-sm text-muted-foreground hover:text-[var(--primary)]"
              >
                {lead.email}
              </a>
            )}
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            {lead.squadSize && (
              <div>
                <span className="text-foreground">Squad:</span> {lead.squadSize}
              </div>
            )}
            {lead.preferredWeeks && (
              <div>
                <span className="text-foreground">Weeks:</span> {lead.preferredWeeks}
              </div>
            )}
            {lead.website && <div className="truncate">{lead.website}</div>}
            <Link
              href={`/crm/lead/${lead.id}`}
              target="_blank"
              className="inline-block pt-1 text-xs uppercase tracking-[0.1em] hover:text-[var(--primary)]"
            >
              Full record ↗
            </Link>
          </div>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="What happened on the call…"
          className="mt-6 w-full resize-y rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--primary)] focus:outline-none"
        />

        <div className="mt-5 flex flex-wrap gap-2">
          {DISPOSITIONS.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => dispose(d)}
              disabled={pending}
              className={`rounded border px-4 py-2 text-sm transition-colors disabled:opacity-40 ${TONES[d.tone]}`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
