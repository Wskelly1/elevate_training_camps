import type { Metadata } from 'next';

/**
 * Outer CRM layout — metadata only, no auth and no chrome.
 *
 * The auth check and the tab shell live one level down, in `(app)/layout.tsx`,
 * so that `/crm/signin` does not inherit them. It previously did, and a layout
 * that redirects unauthenticated visitors to `/crm/signin` will redirect
 * `/crm/signin` to itself — an infinite loop that made signing in impossible.
 *
 * `(app)` is a route group, so it adds nothing to the URL: `/crm` is still
 * `/crm`.
 *
 * Indexing is refused here rather than per-page, so a new CRM route cannot be
 * added without inheriting it.
 */
export const metadata: Metadata = {
  title: 'Elevate CRM',
  robots: { index: false, follow: false, nocache: true },
};

export default function CrmRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
