'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * The tab bar — ten views over one lead table, the organising idea inherited
 * from the source CRM.
 *
 * Active state is derived from the pathname prefix rather than an exact
 * match, so a detail route stays under its parent tab.
 */

const TABS = [
  { href: '/crm', label: 'Leads', exact: true },
  { href: '/crm/queue', label: 'My Queue' },
  { href: '/crm/call', label: 'Call Mode' },
  { href: '/crm/callbacks', label: 'Callbacks' },
  { href: '/crm/checkins', label: 'Check-ins' },
  { href: '/crm/booked', label: 'Booked Teams' },
  { href: '/crm/pipeline', label: 'Pipeline' },
  { href: '/crm/settings', label: 'Settings' },
];

export default function CrmTabs() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto max-w-[1600px] overflow-x-auto px-6">
      <ul className="flex min-w-max gap-1">
        {TABS.map((tab) => {
          const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={[
                  'block border-b-2 px-4 py-2.5 text-[0.8rem] tracking-[0.06em] transition-colors',
                  active
                    ? 'border-[var(--primary)] text-[var(--primary-deep)]'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
                ].join(' ')}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
