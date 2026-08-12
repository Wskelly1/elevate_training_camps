# Service & Subscription Tracker

Every external service this project depends on, what it costs, when it renews,
and which account pays. Update this whenever a service is added, upgraded, or
cancelled — the Sanity outage happened because nothing tracked this.

Renewal dates marked **TBC** need the owner to confirm from each dashboard;
once confirmed they should also become Google Calendar events with reminders.

| Service | Purpose | Plan / tier | Cost | Renewal / billing date | Paying account | Status |
|---|---|---|---|---|---|---|
| Vercel | Hosting + deploys | Hobby (assumed) | $0 | — | williamskelly-6824 | Active |
| Sanity | CMS (project `yvqe54iq`) | Free tier | $0 | — | TBC | **Blocked — quota overage; billing team contacted 2026-07-26** |
| Google Workspace | Email (@elevatetrainingcamps.com), SMTP sending, Calendar | TBC | TBC | TBC | william.skelly@elevatetrainingcamps.com | Active |
| GoDaddy | Domain registration `elevatetrainingcamps.com` (DNS now delegated to Vercel) | Domain only | TBC/yr | **TBC — confirm renewal date in GoDaddy** | TBC | Active |
| ~~HubSpot~~ | ~~CRM lead capture~~ | — | $0 | — | — | **Removed 2026-08-11.** Replaced by the in-house CRM (Phase 9, decision D3). Dependency dropped, env var retired. Nothing to cancel — the account was free — but the private app can be deleted. |
| Neon (via Vercel) | CRM lead store — Postgres behind `/crm` | Free | $0 | — | n/a | Replaces HubSpot. Free tier; watch storage if the lead list grows past a few thousand. `DATABASE_URL` is set by Vercel when the integration is connected. |
| Google Cloud | OAuth client for CRM sign-in | Free | $0 | — | n/a | No billing account needed — OAuth for an Internal Workspace app is free. Project: `Elevate Training Camps`. |
| Google Analytics | Traffic analytics (GA4 `G-DBG2BXTWND`) | Free | $0 | — | william.skelly@elevatetrainingcamps.com | Active |
| Mux | Homepage video streaming (via Sanity plugin) | TBC (via Sanity plugin config) | TBC | TBC | TBC | Active |
| SendGrid | ~~Transactional email~~ — replaced by Gmail SMTP 2026-07-26 | TBC | TBC | — | TBC | **Cancel account if a paid plan is active** |
| Stripe | Payments (Phase 5) | Pay-per-transaction | 2.9% + 30¢/txn (standard) | — | Not yet created (O-1) | Pending |

## Owner to-dos captured here

- [ ] Confirm GoDaddy domain renewal date + auto-renew status
- [ ] Confirm Google Workspace plan/seat cost
- [ ] Check SendGrid dashboard for an active paid plan; cancel if so
- [ ] Confirm which card/account pays for each TBC above
- [ ] After confirmations: create Google Calendar renewal reminders
