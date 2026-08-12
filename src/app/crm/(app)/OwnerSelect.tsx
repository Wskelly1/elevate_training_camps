'use client';

import { useTransition } from 'react';
import { operatorName, type Operator } from '../../../auth.config';
import { actionSetOwner } from './actions';

/**
 * Assign a lead to one of the people who can actually sign in.
 *
 * The option list comes from `CRM_ALLOWED_EMAILS` (via `crmOperators()` in a
 * Server Component) rather than a hardcoded roster, so adding a teammate to
 * the allowlist makes them assignable in the same change.
 *
 * Owner is stored as the **email**, not a nickname — stable across display-name
 * changes, and it matches what the session carries.
 */
export default function OwnerSelect({
  leadId,
  owner,
  operators,
  className = '',
}: {
  leadId: string;
  owner: string;
  operators: Operator[];
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  // If a lead is assigned to someone who has since left the allowlist, keep
  // them as an option. Dropping them would make the select silently show the
  // wrong person, and saving would reassign the lead without anyone asking.
  const known = operators.some((o) => o.email === owner);

  return (
    <select
      aria-label="Owner"
      value={owner}
      disabled={pending}
      onChange={(e) =>
        startTransition(() => {
          void actionSetOwner(leadId, e.target.value);
        })
      }
      className={
        className ||
        'rounded border border-border bg-background px-2 py-1 text-xs text-muted-foreground disabled:opacity-50'
      }
    >
      <option value="">Unassigned</option>
      {operators.map((o) => (
        <option key={o.email} value={o.email}>
          {o.name}
        </option>
      ))}
      {owner && !known && (
        <option value={owner}>{operatorName(owner)} (no longer has access)</option>
      )}
    </select>
  );
}
