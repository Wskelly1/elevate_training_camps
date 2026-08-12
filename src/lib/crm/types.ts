/**
 * Elevate CRM — shared types.
 *
 * `LeadSegment` is deliberately the same union as `ContactSegment` in
 * `src/lib/contact.ts`. They are re-declared rather than imported so the
 * contact form's public data layer does not pull the CRM into the client
 * bundle; the compile-time check at the bottom of this file makes the two
 * impossible to drift apart silently.
 */

import type { ContactSegment } from '../contact';

export type LeadSegment = 'coach' | 'athlete' | 'partner' | 'local' | 'other';

/**
 * The funnel, in order. Mirrors the six-wave outreach calendar in
 * business-plan/ doc 06 — `booked` is the conversion the 120-coach funnel is
 * aiming at, `no_interest` is a terminal state that is kept rather than
 * deleted so the funnel's denominator survives.
 */
export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'callback'
  | 'interested'
  | 'booked'
  | 'no_interest';

export type LeadSource =
  | 'website_contact'
  | 'website_newsletter'
  | 'manual'
  | 'import';

export type TouchKind =
  | 'form_submission'
  | 'newsletter_signup'
  | 'call'
  | 'checkin'
  | 'email'
  | 'status_change'
  | 'note'
  | 'import'
  | 'manual';

export interface Lead {
  id: string;
  createdAt: string;
  updatedAt: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  segment: LeadSegment;
  organization: string;
  city: string;
  state: string;
  website: string;

  status: LeadStatus;
  owner: string;

  squadSize: string;
  preferredWeeks: string;
  gradYear: string;
  interest: string;
  affiliation: string;
  connectionType: string;
  businessType: string;
  subject: string;

  school: string;
  collegeDestination: string;

  source: LeadSource;
  newsletterSubscribed: boolean;

  callbackAt: string | null;
  lastContactedAt: string | null;
  lastCheckinAt: string | null;

  archived: boolean;
}

export interface LeadNote {
  id: string;
  leadId: string;
  createdAt: string;
  author: string;
  body: string;
  resolvedAt: string | null;
}

export interface LeadTouch {
  id: string;
  leadId: string;
  createdAt: string;
  actor: string;
  kind: TouchKind;
  outcome: string;
  detail: string;
}

/** Human labels. Single source for every screen, so no tab invents its own. */
export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  callback: 'Callback',
  interested: 'Interested',
  booked: 'Booked',
  no_interest: 'No interest',
};

export const SEGMENT_LABELS: Record<LeadSegment, string> = {
  coach: 'Coach / organizer',
  athlete: 'Athlete & family',
  partner: 'College / pro',
  local: 'Housing / local',
  other: 'Other',
};

export const SOURCE_LABELS: Record<LeadSource, string> = {
  website_contact: 'Contact form',
  website_newsletter: 'Newsletter signup',
  manual: 'Added manually',
  import: 'Imported',
};

export const STATUS_ORDER: LeadStatus[] = [
  'new',
  'contacted',
  'callback',
  'interested',
  'booked',
  'no_interest',
];

/**
 * The check-in clock inherited from the source CRM: a 30-day cadence, with a
 * one-week amber warning before it trips.
 */
export const CHECKIN_INTERVAL_DAYS = 30;
export const CHECKIN_WARNING_DAYS = 23;

export type CheckinState = 'overdue' | 'due_soon' | 'current' | 'never';

export function checkinState(lastCheckinAt: string | null, now = new Date()): CheckinState {
  if (!lastCheckinAt) return 'never';
  const days = (now.getTime() - new Date(lastCheckinAt).getTime()) / 86_400_000;
  if (days >= CHECKIN_INTERVAL_DAYS) return 'overdue';
  if (days >= CHECKIN_WARNING_DAYS) return 'due_soon';
  return 'current';
}

/**
 * Compile-time guard: `LeadSegment` and the contact form's `ContactSegment`
 * must stay identical. If someone adds a segment to the form and not here (or
 * vice versa), this fails to typecheck rather than silently dropping the new
 * segment's leads into 'other'.
 */
type AssertEqual<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never;
export const _segmentsMatchContactForm: AssertEqual<LeadSegment, ContactSegment> = true;
