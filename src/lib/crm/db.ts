import { neon } from '@neondatabase/serverless';

/**
 * Neon Postgres connection for the CRM.
 *
 * Server-only. Nothing in `src/lib/crm/` may be imported from a Client
 * Component — `DATABASE_URL` is the entire credential surface for every lead
 * record, and a stray import would ship it to the browser.
 *
 * The driver speaks HTTP rather than TCP, so there is no pool to manage and
 * no connection to leak across serverless invocations.
 */

let cached: ReturnType<typeof neon> | null = null;

/**
 * Returns the query function, or throws with an actionable message.
 *
 * Deliberately lazy: importing this module must not throw at build time, so
 * that a deploy without `DATABASE_URL` still builds and every other route on
 * the site keeps working. Only the CRM degrades — see `isCrmConfigured`.
 */
export function sql() {
  if (!cached) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        'DATABASE_URL is not set — the CRM store is unreachable. ' +
          'See docs/13-crm-setup.md.',
      );
    }
    cached = neon(url);
  }
  return cached;
}

/**
 * Whether the CRM has a database to talk to.
 *
 * Callers on the public site (the contact form) use this to skip the CRM leg
 * entirely rather than throwing: a visitor must never see an error because an
 * internal tool is unconfigured.
 */
export function isCrmConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
