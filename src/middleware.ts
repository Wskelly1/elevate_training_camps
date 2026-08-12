import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

/**
 * Gate every `/crm` route at the edge.
 *
 * This is the difference between this CRM and the concept it was rebuilt from:
 * the source hid its data behind a password checked in browser JavaScript, so
 * the records were already in the page for anyone who opened View Source.
 * Here an unauthenticated request never reaches a component that can read the
 * database — it is redirected before rendering begins.
 *
 * `/crm/signin` is excluded for the obvious reason.
 */

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ['/crm/((?!signin).*)', '/crm'],
};
