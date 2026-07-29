# Email & Lead-Capture Setup (Gmail SMTP + HubSpot)

How the contact form and newsletter signup actually work, and how to configure
them from scratch. (This replaces the old `CONTACT_FORM_SETUP.md`, which
documented a SendGrid integration that was removed in July 2026.)

## Architecture

- **`src/lib/email.ts`** — shared sender. Uses `nodemailer` with Gmail SMTP,
  authenticated as a real Google Workspace account via an App Password, sending
  from a "Send mail as" alias so recipients see `support@elevatetrainingcamps.com`.
- **`POST /api/contact`** (`src/app/api/contact/route.ts`) — validates the
  contact form, sends an admin notification + a user confirmation email, and
  creates a HubSpot contact.
- **`POST /api/newsletter`** (`src/app/api/newsletter/route.ts`) — validates the
  email, sends an admin notification + a welcome email, and creates a HubSpot
  contact with newsletter properties.
- Client pieces: `src/components/ContactForm.tsx` (contact page form) and the
  newsletter form inside `src/components/LayoutClient.tsx` (site footer).
- Both routes degrade gracefully: if email fails but HubSpot succeeds (or vice
  versa) the request still returns success; only total failure returns a 500.

## Environment variables

```bash
GMAIL_USER=william.skelly@elevatetrainingcamps.com   # real account that authenticates
GMAIL_APP_PASSWORD=****                              # 16-char App Password (not the account password)
GMAIL_FROM_EMAIL=support@elevatetrainingcamps.com    # verified "Send mail as" alias
GMAIL_TO_EMAIL=support@elevatetrainingcamps.com      # where admin notifications land
HUBSPOT_ACCESS_TOKEN=****                            # HubSpot private-app token
```

Set locally in `.env.local` (gitignored) and in Vercel for
production/preview/development.

## Gmail setup (one-time)

1. The authenticating account needs **2-Step Verification** enabled
   (myaccount.google.com → Security).
2. Generate an **App Password**: https://myaccount.google.com/apppasswords —
   name it, copy the 16-character password once. If the page is unavailable on
   a Workspace account, an admin must allow App Passwords
   (admin.google.com → Security → Authentication → 2-Step Verification).
3. If sending as a shared/group address (like `support@`, which is a Google
   Group with no login of its own): in Gmail as the authenticating user →
   Settings → Accounts and Import → **Send mail as** → add the group address →
   confirm the verification email (it arrives in the group inbox).

Limits: Workspace accounts can send to ~2,000 recipients/day — far beyond a
contact form's volume. If the site ever sends bulk mail, revisit.

## HubSpot setup (one-time)

1. HubSpot → Settings → Integrations → **Private Apps** → create (or open) the
   app for this site.
2. Required scope: `crm.objects.contacts.write` (add `.read` for dedupe work).
3. Copy the access token into the env var. Regenerating the token invalidates
   the old one — update Vercel at the same time.

## Testing

```bash
# with the dev server running:
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"you@example.com","subject":"Test","message":"Hello"}'

curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com"}'
```

A successful response includes per-service results, e.g.
`{"results":{"email":{"success":true},"hubspot":{"success":false,"error":"..."}}}` —
check both flags, not just the top-level success.

## Troubleshooting

- **`Invalid login` / EAUTH from nodemailer** — App Password revoked or 2FA
  disabled; regenerate the App Password.
- **Mail sends but shows the wrong from-address** — the "Send mail as" alias
  isn't verified on the authenticating account.
- **HubSpot 401 `INVALID_AUTHENTICATION`** — token revoked/expired or missing
  scopes; regenerate the private-app token and update Vercel envs.
- **Works locally, fails in production** — env vars missing in Vercel; run
  `vercel env ls production` and compare against the list above.
