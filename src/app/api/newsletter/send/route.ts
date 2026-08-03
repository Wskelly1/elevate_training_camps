import { NextRequest, NextResponse } from 'next/server';
import type { PortableTextBlock } from '@portabletext/types';
import { Client } from '@hubspot/api-client';
import { FilterOperatorEnum } from '@hubspot/api-client/lib/codegen/crm/contacts';
import { sendMail } from '../../../../lib/email';
import { client as sanityClient } from '../../../../lib/sanity';

/**
 * POST /api/newsletter/send — email a published newsletter issue to the
 * subscriber list. Deliberately separate from publishing: an issue can sit
 * on /newsletter for review before it is ever sent.
 *
 * Auth: requires `Authorization: Bearer <NEWSLETTER_SEND_SECRET>`. The
 * endpoint is disabled (503) until that env var is set.
 *
 * Body: { "slug": "<issue slug>", "recipients"?: ["a@b.com", ...] }
 *   - Without `recipients`, the list is pulled from HubSpot (contacts with
 *     newsletter_subscription = true — the property the signup route sets).
 *     Subscriber emails are NEVER stored in Sanity: the dataset is public.
 *   - With `recipients`, exactly those addresses are used (manual sends,
 *     or a fallback while the HubSpot token is broken — roadmap O-3).
 *
 * Recipients ride BCC in batches so addresses are never exposed to each
 * other. If SANITY_API_WRITE_TOKEN is set the issue's `sentAt` is stamped
 * afterwards; without it the send still works and the response says the
 * stamp was skipped.
 */

const BCC_BATCH_SIZE = 50;

type IssueForSend = {
  _id: string;
  title: string;
  slug: string;
  issueDate?: string;
  intro?: string;
  heroImageUrl?: string;
  body?: PortableTextBlock[];
  sentAt?: string;
};

/** Minimal Portable Text → email HTML (paragraphs, headings, lists, marks). */
function blocksToHtml(blocks: PortableTextBlock[]): { html: string; text: string } {
  const htmlParts: string[] = [];
  const textParts: string[] = [];
  let listOpen: string | null = null;

  const closeList = () => {
    if (listOpen) {
      htmlParts.push(`</${listOpen}>`);
      listOpen = null;
    }
  };

  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  for (const block of blocks) {
    if (block._type !== 'block' || !Array.isArray(block.children)) continue;

    const spanHtml = block.children
      .map((child) => {
        if (typeof child.text !== 'string') return '';
        let t = escape(child.text);
        const marks = Array.isArray(child.marks) ? child.marks : [];
        for (const mark of marks) {
          if (mark === 'strong') t = `<strong>${t}</strong>`;
          else if (mark === 'em') t = `<em>${t}</em>`;
          else {
            const def = block.markDefs?.find((d) => d._key === mark);
            if (def && def._type === 'link' && typeof def.href === 'string') {
              t = `<a href="${escape(def.href)}" style="color:#427b4d;">${t}</a>`;
            }
          }
        }
        return t;
      })
      .join('');
    const plain = block.children.map((c) => (typeof c.text === 'string' ? c.text : '')).join('');

    if (block.listItem) {
      const tag = block.listItem === 'number' ? 'ol' : 'ul';
      if (listOpen !== tag) {
        closeList();
        htmlParts.push(`<${tag} style="margin:0 0 16px;padding-left:24px;">`);
        listOpen = tag;
      }
      htmlParts.push(`<li style="margin:4px 0;line-height:1.7;">${spanHtml}</li>`);
      textParts.push(`- ${plain}`);
      continue;
    }
    closeList();

    switch (block.style) {
      case 'h2':
        htmlParts.push(`<h2 style="margin:28px 0 8px;font-size:22px;color:#2c4a33;">${spanHtml}</h2>`);
        break;
      case 'h3':
        htmlParts.push(`<h3 style="margin:22px 0 6px;font-size:18px;color:#2c4a33;">${spanHtml}</h3>`);
        break;
      case 'blockquote':
        htmlParts.push(
          `<blockquote style="margin:16px 0;padding-left:16px;border-left:3px solid #d3c7b4;color:#555;">${spanHtml}</blockquote>`
        );
        break;
      default:
        htmlParts.push(`<p style="margin:0 0 16px;line-height:1.75;">${spanHtml}</p>`);
    }
    textParts.push(plain);
  }
  closeList();

  return { html: htmlParts.join('\n'), text: textParts.join('\n\n') };
}

/** All HubSpot contacts flagged as newsletter subscribers (paginated). */
async function fetchHubSpotSubscribers(): Promise<string[]> {
  const hubspot = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });
  const emails: string[] = [];
  let after: string | undefined;

  do {
    const page = await hubspot.crm.contacts.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            { propertyName: 'newsletter_subscription', operator: FilterOperatorEnum.Eq, value: 'true' },
          ],
        },
      ],
      properties: ['email'],
      limit: 100,
      after,
    });
    for (const contact of page.results) {
      const email = contact.properties?.email;
      if (email) emails.push(email);
    }
    after = page.paging?.next?.after;
  } while (after);

  return emails;
}

export async function POST(request: NextRequest) {
  const secret = process.env.NEWSLETTER_SEND_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'Newsletter sending is not configured (NEWSLETTER_SEND_SECRET is unset).' },
      { status: 503 }
    );
  }
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.GMAIL_FROM_EMAIL) {
    return NextResponse.json(
      { error: 'Email sending is not configured (Gmail env vars missing).' },
      { status: 503 }
    );
  }

  let body: { slug?: string; recipients?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!body.slug) {
    return NextResponse.json({ error: 'Missing "slug" (the issue to send)' }, { status: 400 });
  }

  // Published issues only — never send a draft.
  const issue: IssueForSend | null = await sanityClient.fetch(
    `*[_type == "newsletterIssue" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      _id, title, "slug": slug.current, issueDate, intro,
      "heroImageUrl": heroImage.asset->url, body, sentAt
    }`,
    { slug: body.slug }
  );
  if (!issue) {
    return NextResponse.json({ error: `No published issue with slug "${body.slug}"` }, { status: 404 });
  }
  if (issue.sentAt && !body.recipients) {
    return NextResponse.json(
      {
        error: `Issue "${issue.title}" was already sent at ${issue.sentAt}. To re-send anyway, pass an explicit "recipients" list.`,
      },
      { status: 409 }
    );
  }

  // Resolve the recipient list.
  let recipients: string[];
  if (Array.isArray(body.recipients) && body.recipients.length > 0) {
    recipients = body.recipients;
  } else if (process.env.HUBSPOT_ACCESS_TOKEN) {
    try {
      recipients = await fetchHubSpotSubscribers();
    } catch (error) {
      console.error('HubSpot subscriber fetch failed:', error);
      return NextResponse.json(
        {
          error:
            'Could not fetch the subscriber list from HubSpot. Fix the HubSpot token (roadmap O-3) or pass an explicit "recipients" list.',
        },
        { status: 502 }
      );
    }
  } else {
    return NextResponse.json(
      { error: 'No subscriber source: set HUBSPOT_ACCESS_TOKEN or pass "recipients".' },
      { status: 503 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  recipients = [...new Set(recipients.map((r) => r.trim().toLowerCase()))].filter((r) =>
    emailRegex.test(r)
  );
  if (recipients.length === 0) {
    return NextResponse.json({ error: 'Subscriber list is empty — nothing to send.' }, { status: 422 });
  }

  const { html: bodyHtml, text: bodyText } = blocksToHtml(issue.body || []);
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://elevatetrainingcamps.com';
  const issueUrl = `${siteUrl}/newsletter/${issue.slug}`;

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #333;">
      ${issue.heroImageUrl ? `<img src="${issue.heroImageUrl}?w=1200" alt="" style="width:100%;height:auto;margin-bottom:20px;" />` : ''}
      <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#a8794f;margin:0 0 10px;">The monthly letter</p>
      <h1 style="margin:0 0 8px;font-size:30px;line-height:1.15;color:#2c4a33;">${issue.title}</h1>
      ${issue.intro ? `<p style="margin:0 0 24px;font-size:17px;line-height:1.6;color:#555;">${issue.intro}</p>` : ''}
      ${bodyHtml}
      <hr style="margin:32px 0;border:none;border-top:1px solid #d3c7b4;" />
      <p style="font-size:13px;color:#666;line-height:1.6;">
        Read this issue on the site: <a href="${issueUrl}" style="color:#427b4d;">${issueUrl}</a><br />
        You received this because you signed up for the Elevate Training Camps newsletter.
        To unsubscribe, reply to this email and we'll take you off the list.
      </p>
    </div>`;
  const text = `${issue.title}\n\n${issue.intro ? issue.intro + '\n\n' : ''}${bodyText}\n\n---\nRead this issue on the site: ${issueUrl}\nYou received this because you signed up for the Elevate Training Camps newsletter. To unsubscribe, reply to this email and we'll take you off the list.`;

  // BCC batches: recipients never see each other's addresses.
  let sent = 0;
  const failures: string[] = [];
  for (let i = 0; i < recipients.length; i += BCC_BATCH_SIZE) {
    const batch = recipients.slice(i, i + BCC_BATCH_SIZE);
    try {
      await sendMail({
        to: process.env.GMAIL_FROM_EMAIL,
        bcc: batch,
        subject: issue.title,
        html,
        text,
      });
      sent += batch.length;
    } catch (error) {
      console.error(`Newsletter batch ${i / BCC_BATCH_SIZE + 1} failed:`, error);
      failures.push(...batch);
    }
  }

  // Stamp sentAt when a write token exists; the send is complete either way.
  let sentAtStamped = false;
  if (process.env.SANITY_API_WRITE_TOKEN && sent > 0) {
    try {
      await sanityClient
        .withConfig({ token: process.env.SANITY_API_WRITE_TOKEN, useCdn: false })
        .patch(issue._id)
        .set({ sentAt: new Date().toISOString() })
        .commit();
      sentAtStamped = true;
    } catch (error) {
      console.error('Failed to stamp sentAt:', error);
    }
  }

  return NextResponse.json({
    success: failures.length === 0,
    issue: issue.slug,
    sent,
    failed: failures.length,
    ...(failures.length > 0 ? { failedRecipients: failures } : {}),
    sentAtStamped,
    ...(sentAtStamped
      ? {}
      : { note: 'sentAt not stamped (set SANITY_API_WRITE_TOKEN to enable duplicate-send protection).' }),
  });
}
