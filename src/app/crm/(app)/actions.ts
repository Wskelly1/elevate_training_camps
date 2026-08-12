'use server';

/**
 * CRM server actions.
 *
 * Every action starts with `requireOperator()`. That call is both the
 * authorisation check and the source of the `actor` stamped on the resulting
 * note, call or status change — so there is no path where an action runs
 * without a known, allowlisted person attached to it.
 *
 * Middleware already gates the /crm routes; this is the second gate, because
 * a server action is a POST endpoint that can be invoked directly and must
 * not rely on the UI having been rendered.
 */

import { revalidatePath } from 'next/cache';
import { requireOperator } from '../../../auth';
import { isAllowed } from '../../../auth.config';
import {
  addNote,
  archiveLead,
  deleteNote,
  markCheckedIn,
  recordTouch,
  setLeadStatus,
  setNoteResolved,
  updateLead,
  upsertLead,
} from '../../../lib/crm/leads';
import type { LeadStatus } from '../../../lib/crm/types';

/** Refresh every CRM screen — they are all views over the same rows. */
function refresh() {
  revalidatePath('/crm', 'layout');
}

export async function actionSetStatus(id: string, status: LeadStatus) {
  const actor = await requireOperator();
  await setLeadStatus(id, status, actor);
  refresh();
}

/**
 * Assign a lead.
 *
 * `owner` must be '' (unassign) or an address on the allowlist. A server
 * action is a POST endpoint that can be called directly, so the value is
 * validated here rather than trusted from the select that rendered it —
 * otherwise a lead could be assigned to an arbitrary string and quietly
 * disappear from every queue.
 *
 * Reassigning away from someone who has since lost access is still allowed;
 * only the destination is checked.
 */
export async function actionSetOwner(id: string, owner: string) {
  await requireOperator();
  if (owner !== '' && !isAllowed(owner)) {
    throw new Error('Owner must be someone with CRM access');
  }
  await updateLead(id, { owner });
  refresh();
}

export async function actionSaveField(
  id: string,
  field: 'phone' | 'email' | 'organization' | 'city' | 'state' | 'website' | 'squadSize' | 'preferredWeeks' | 'gradYear' | 'school' | 'collegeDestination',
  value: string,
) {
  await requireOperator();
  await updateLead(id, { [field]: value });
  refresh();
}

export async function actionAddNote(id: string, body: string) {
  const actor = await requireOperator();
  const text = body.trim();
  if (!text) return;
  await addNote(id, text, actor);
  refresh();
}

export async function actionResolveNote(noteId: string, resolved: boolean) {
  await requireOperator();
  await setNoteResolved(noteId, resolved);
  refresh();
}

export async function actionDeleteNote(noteId: string) {
  await requireOperator();
  await deleteNote(noteId);
  refresh();
}

export async function actionMarkCheckedIn(id: string) {
  const actor = await requireOperator();
  await markCheckedIn(id, actor);
  refresh();
}

/**
 * Schedule (or clear) a callback.
 *
 * Setting a date also moves the lead to `callback`, because a scheduled
 * callback that doesn't show in the callback stage is the kind of split state
 * that makes a pipeline untrustworthy.
 */
export async function actionSetCallback(id: string, when: string | null) {
  const actor = await requireOperator();
  await updateLead(id, { callbackAt: when });
  if (when) {
    await setLeadStatus(id, 'callback', actor);
    await recordTouch(id, { kind: 'call', actor, outcome: 'callback_scheduled', detail: when });
  }
  refresh();
}

/** Log a call outcome from Call Mode. */
export async function actionLogCall(id: string, outcome: string, detail = '') {
  const actor = await requireOperator();
  await recordTouch(id, { kind: 'call', actor, outcome, detail });
  await updateLead(id, { lastContactedAt: new Date().toISOString() });
  refresh();
}

export async function actionArchive(id: string) {
  await requireOperator();
  await archiveLead(id);
  refresh();
}

/** Add a lead by hand, from Settings. */
export async function actionAddLead(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  segment: string;
  city: string;
  state: string;
}) {
  const actor = await requireOperator();
  const lead = await upsertLead({
    ...input,
    segment: input.segment as never,
    source: 'manual',
  });
  await recordTouch(lead.id, { kind: 'manual', actor, detail: 'Added by hand' });
  refresh();
  return lead.id;
}
