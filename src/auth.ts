import NextAuth from 'next-auth';
import { authConfig, isAllowed } from './auth.config';
import { isCrmConfigured } from './lib/crm/db';
import { recordAuthEvent } from './lib/crm/leads';

/**
 * Node-runtime auth instance — the one the `/api/auth/*` route uses.
 *
 * Adds the access log on top of the edge-safe config. Every sign-in, denial
 * and sign-out is written to `auth_events`, because once minors' contact
 * details are in the database, "who opened this and when" has to be
 * answerable (docs/12-crm-plan.md §6).
 *
 * Logging never blocks or fails a sign-in: an unreachable database must not
 * be able to lock the owner out of their own CRM.
 */

async function log(
  event: 'signin_success' | 'signin_denied' | 'signout',
  email: string,
): Promise<void> {
  if (!isCrmConfigured()) return;
  try {
    await recordAuthEvent({ email, event });
  } catch (error) {
    console.error('[crm] auth event log failed:', error);
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  callbacks: {
    ...authConfig.callbacks,

    async signIn(params) {
      const email = params.profile?.email ?? '';
      const permitted = isAllowed(email);
      await log(permitted ? 'signin_success' : 'signin_denied', email);
      return permitted && params.profile?.email_verified !== false;
    },
  },

  events: {
    // JWT strategy, so this always carries a token rather than a session row.
    async signOut(message) {
      const email = 'token' in message ? (message.token?.email ?? '') : '';
      await log('signout', email);
    },
  },
});

/**
 * The signed-in operator's email, or null.
 *
 * Every CRM server action calls this rather than trusting anything from the
 * client — it is both the authorisation check and the source of the `actor`
 * recorded against each note, call and status change.
 */
export async function currentOperator(): Promise<string | null> {
  const session = await auth();
  const email = session?.user?.email;
  return isAllowed(email) ? (email as string) : null;
}

/** Throwing variant, for server actions that must never run unauthenticated. */
export async function requireOperator(): Promise<string> {
  const email = await currentOperator();
  if (!email) throw new Error('Not authorised');
  return email;
}
