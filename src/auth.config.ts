import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

/**
 * Edge-safe half of the auth configuration.
 *
 * Kept separate from `src/auth.ts` because `middleware.ts` runs on the Edge
 * runtime and must not pull in the database driver. This file therefore does
 * no I/O: the allowlist is read from an environment variable and compared in
 * memory. All logging lives in `src/auth.ts`, which only ever runs in the
 * Node.js auth route.
 *
 * Decision D5 (docs/12-crm-plan.md): the CRM stores PII, so sign-in is Google
 * Workspace SSO rather than a password. This app therefore stores no
 * credential of any kind, and inherits the 2-Step Verification already
 * enforced on the Workspace account.
 */

/** 12 hours — a working day, then re-authenticate. */
export const SESSION_MAX_AGE = 12 * 60 * 60;

/**
 * Who may open the CRM.
 *
 * `CRM_ALLOWED_EMAILS` is a comma-separated list of exact addresses. Access is
 * granted and revoked by editing it — there is no user table, and no way to
 * self-register.
 *
 * Note this is the *second* gate. The Google OAuth client is configured as an
 * Internal app, so Google itself refuses anyone outside the Workspace domain
 * before the callback is ever reached. This list narrows that further to
 * named people.
 */
export function allowedEmails(): string[] {
  return (process.env.CRM_ALLOWED_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = allowedEmails();
  // An empty allowlist denies everyone. Failing closed matters more than
  // convenience when the records are minors' contact details.
  if (list.length === 0) return false;
  return list.includes(email.toLowerCase());
}

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          // Always show the account chooser: this machine may be signed into
          // a personal Google account, and silently reusing it would produce
          // a confusing denial rather than a usable session.
          prompt: 'select_account',
        },
      },
    }),
  ],

  session: { strategy: 'jwt', maxAge: SESSION_MAX_AGE },

  pages: {
    signIn: '/crm/signin',
    error: '/crm/signin',
  },

  callbacks: {
    /**
     * The allowlist gate. Returning false sends the visitor back to the
     * sign-in page with an error rather than issuing a session.
     */
    signIn({ profile }) {
      const email = profile?.email;
      // Google's own verification of the address — a Workspace account is
      // always verified, so a false here means something is wrong.
      if (profile && profile.email_verified === false) return false;
      return isAllowed(email);
    },

    jwt({ token, profile }) {
      if (profile?.email) token.email = profile.email;
      return token;
    },

    session({ session, token }) {
      if (session.user && token.email) session.user.email = token.email;
      return session;
    },

    /**
     * Used by `middleware.ts`. Re-checks the allowlist on every request, so
     * removing an address from `CRM_ALLOWED_EMAILS` revokes an already-issued
     * session immediately rather than at its 12-hour expiry.
     */
    authorized({ auth }) {
      return isAllowed(auth?.user?.email);
    },
  },

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-elevate.crm.session'
          : 'elevate.crm.session',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  trustHost: true,
};
