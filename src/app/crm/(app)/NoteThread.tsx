'use client';

import { useState, useTransition } from 'react';
import type { LeadNote } from '../../../lib/crm/types';
import { actionAddNote, actionDeleteNote, actionResolveNote } from './actions';
import { Card, formatDateTime } from './ui';

/**
 * The dated note thread, with resolve/unresolve — carried over from the
 * source CRM, where it was the feature that made the tool worth opening.
 *
 * A resolved note is struck through rather than hidden: "we already chased
 * this" is information, and deleting it loses the history the funnel report
 * is read against.
 */
export default function NoteThread({ leadId, notes }: { leadId: string; notes: LeadNote[] }) {
  const [draft, setDraft] = useState('');
  const [pending, startTransition] = useTransition();

  function save() {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    startTransition(() => {
      void actionAddNote(leadId, text);
    });
  }

  return (
    <Card>
      <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg text-foreground">Notes</h2>

      <div className="mb-5">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Cmd/Ctrl+Enter saves — this gets typed during calls.
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') save();
          }}
          rows={3}
          placeholder="Add a note… (the date and your name are stamped automatically)"
          className="w-full resize-y rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--primary)] focus:outline-none"
        />
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={pending || !draft.trim()}
            className="rounded bg-[var(--primary)] px-4 py-1.5 text-sm text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-40"
          >
            Save note
          </button>
          <span className="text-xs text-muted-foreground">⌘↵</span>
        </div>
      </div>

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notes yet.</p>
      ) : (
        <ol className="space-y-4">
          {notes.map((note) => (
            <li
              key={note.id}
              className="border-l-2 pl-3"
              style={{
                borderColor: note.resolvedAt ? 'var(--border)' : 'var(--primary)',
              }}
            >
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-[family-name:var(--font-geist-mono)] text-[0.65rem] text-muted-foreground">
                  {formatDateTime(note.createdAt)}
                </span>
                <span className="text-[0.65rem] text-muted-foreground">{note.author}</span>
              </div>
              <p
                className={`mt-1 whitespace-pre-wrap text-sm leading-relaxed ${
                  note.resolvedAt ? 'text-muted-foreground line-through' : 'text-foreground'
                }`}
              >
                {note.body}
              </p>
              <div className="mt-1.5 flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    startTransition(() => {
                      void actionResolveNote(note.id, !note.resolvedAt);
                    })
                  }
                  className="text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground hover:text-[var(--primary)]"
                >
                  {note.resolvedAt ? 'Reopen' : 'Resolve'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm('Delete this note?')) return;
                    startTransition(() => {
                      void actionDeleteNote(note.id);
                    });
                  }}
                  className="text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground hover:text-[var(--destructive)]"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
