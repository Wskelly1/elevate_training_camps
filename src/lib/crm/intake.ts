/**
 * Elevate CRM — website intake.
 *
 * The bridge from the public forms to the CRM, and the answer to the founding
 * requirement: anyone who submits a form is stored automatically.
 *
 * Every function here is best-effort by construction. A visitor must never see
 * a failure because an internal tool is down, so callers get a result object
 * and nothing throws.
 */

import { isCrmConfigured } from './db';
import { recordTouch, upsertLead } from './leads';
import type { LeadSegment } from './types';

export interface IntakeResult {
  success: boolean;
  /** True when there was no database configured — a skip, not a failure. */
  skipped?: boolean;
  leadId?: string;
  error?: string;
}

/** The shape `/api/contact` receives. Mirrors `ContactFormData` in ../contact. */
export interface ContactIntake {
  segment?: string;
  firstName: string;
  lastName: string;
  email: string;
  program?: string;
  state?: string;
  squadSize?: string;
  preferredWeeks?: string;
  gradYear?: string;
  interest?: string;
  affiliation?: string;
  connectionType?: string;
  businessName?: string;
  businessType?: string;
  subject?: string;
  message: string;
}

const SEGMENTS: LeadSegment[] = ['coach', 'athlete', 'partner', 'local', 'other'];

function asSegment(v: string | undefined): LeadSegment {
  return SEGMENTS.includes(v as LeadSegment) ? (v as LeadSegment) : 'other';
}

/**
 * The organisation name, wherever this segment happens to put it.
 *
 * Coaches give a program, partners an affiliation, local businesses a business
 * name — three form fields that all mean "who you represent". Collapsing them
 * into one column is what makes a single searchable lead list possible.
 */
function organizationFor(body: ContactIntake, segment: LeadSegment): string {
  switch (segment) {
    case 'coach':
      return body.program ?? '';
    case 'partner':
      return body.affiliation ?? '';
    case 'local':
      return body.businessName ?? '';
    default:
      return '';
  }
}

/**
 * Store (or enrich) a lead from a contact-form submission, and log the touch.
 *
 * The submission's message is written as a note rather than onto the lead, so
 * a coach who writes three times leaves three legible messages instead of one
 * overwritten blob — the thing the HubSpot leg got wrong.
 */
export async function recordContactSubmission(
  body: ContactIntake,
): Promise<IntakeResult> {
  if (!isCrmConfigured()) return { success: false, skipped: true };

  try {
    const segment = asSegment(body.segment);

    const lead = await upsertLead({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      segment,
      organization: organizationFor(body, segment),
      state: body.state ?? '',
      squadSize: body.squadSize ?? '',
      preferredWeeks: body.preferredWeeks ?? '',
      gradYear: body.gradYear ?? '',
      interest: body.interest ?? '',
      affiliation: body.affiliation ?? '',
      connectionType: body.connectionType ?? '',
      businessType: body.businessType ?? '',
      subject: body.subject ?? '',
      source: 'website_contact',
      lastContactedAt: new Date().toISOString(),
    });

    await recordTouch(lead.id, {
      kind: 'form_submission',
      actor: 'website',
      outcome: segment,
      detail: body.message.slice(0, 2000),
    });

    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error('[crm] contact intake failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Store a newsletter subscriber.
 *
 * Subscribers and enquirers share one table on purpose: a coach who
 * subscribes and later fills in the contact form is one person, and the CRM
 * should show that rather than keeping two silos the way HubSpot-plus-inbox
 * did. `newsletterSubscribed` latches true in `upsertLead`.
 */
export async function recordNewsletterSignup(email: string): Promise<IntakeResult> {
  if (!isCrmConfigured()) return { success: false, skipped: true };

  try {
    const lead = await upsertLead({
      email,
      source: 'website_newsletter',
      newsletterSubscribed: true,
    });

    await recordTouch(lead.id, {
      kind: 'newsletter_signup',
      actor: 'website',
      detail: 'Subscribed via website footer',
    });

    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error('[crm] newsletter intake failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
