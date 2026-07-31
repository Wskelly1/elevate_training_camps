import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '../../../lib/email';
import { Client } from '@hubspot/api-client';

// Initialize HubSpot client
const hubspotClient = new Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});

type ContactSegment = 'coach' | 'athlete' | 'partner' | 'other';

interface ContactFormData {
  segment?: ContactSegment;
  firstName: string;
  lastName: string;
  email: string;
  // Coach / trip organiser path
  program?: string;
  state?: string;
  squadSize?: string;
  preferredWeeks?: string;
  // Athlete & family path
  gradYear?: string;
  interest?: string;
  // College / pro connect path
  affiliation?: string;
  connectionType?: string;
  // Other path
  subject?: string;
  message: string;
}

/** Subject-line tag + human label per segment, for inbox triage. */
const SEGMENT_LABELS: Record<ContactSegment, string> = {
  coach: 'Team enquiry',
  athlete: 'Athlete & family',
  partner: 'College/pro connect',
  other: 'General',
};

/** The per-segment detail fields, as label/value pairs for the emails. */
function segmentDetails(body: ContactFormData): Array<[string, string]> {
  const rows: Array<[string, string | undefined]> = [];
  switch (body.segment) {
    case 'coach':
      rows.push(['Program / School', body.program], ['State', body.state],
                ['Squad size', body.squadSize], ['Preferred weeks', body.preferredWeeks]);
      break;
    case 'athlete':
      rows.push(['Graduation year', body.gradYear], ['Interested in', body.interest]);
      break;
    case 'partner':
      rows.push(['Affiliation', body.affiliation], ['Connection type', body.connectionType]);
      break;
    default:
      rows.push(['Subject', body.subject]);
  }
  return rows.filter((r): r is [string, string] => Boolean(r[1] && r[1].trim()));
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { firstName, lastName, email, message } = body;
    const segment: ContactSegment = body.segment && body.segment in SEGMENT_LABELS ? body.segment : 'other';

    // Validate required fields (per-segment fields are validated client-side;
    // identity + message gate the submission here)
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const details = segmentDetails(body);
    // Triage headline: "[Team enquiry] Desert Vista HS XC" beats a free-text subject.
    const headline = details.length > 0 ? details[0][1] : `${firstName} ${lastName}`;
    const subjectLine = `[${SEGMENT_LABELS[segment]}] ${headline}`;
    const detailsHtml = details.map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`).join('\n            ');
    const detailsText = details.map(([k, v]) => `${k}: ${v}`).join('\n            ');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const results = {
      email: { success: false, error: null },
      hubspot: { success: false, error: null }
    };

    // Send email via Gmail/Workspace
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD && process.env.GMAIL_FROM_EMAIL && process.env.GMAIL_TO_EMAIL) {
      try {
        // Send notification email to admin
        const adminMsg = {
          to: process.env.GMAIL_TO_EMAIL,
          subject: subjectLine,
          html: `
            <h2>New Contact Form Submission — ${SEGMENT_LABELS[segment]}</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${detailsHtml}
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><em>This message was sent from the Elevate Training Camps contact form.</em></p>
          `,
          text: `
            New Contact Form Submission — ${SEGMENT_LABELS[segment]}

            Name: ${firstName} ${lastName}
            Email: ${email}
            ${detailsText}
            Message: ${message}

            This message was sent from the Elevate Training Camps contact form.
          `
        };

        // Send confirmation email to user
        const userMsg = {
          to: email,
          subject: `Thank you for contacting Elevate Training Camps`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #427b4d; margin-bottom: 20px;">Thank You for Contacting Us!</h2>

              <p>Dear ${firstName},</p>

              <p>Thank you for reaching out to Elevate Training Camps. We have received your message and will get back to you as soon as possible.</p>

              <div style="background-color: #f0ead6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #427b4d; margin-top: 0;">Your Message Details:</h3>
                ${detailsHtml}
                <p><strong>Message:</strong></p>
                <p style="background-color: white; padding: 10px; border-radius: 4px;">${message.replace(/\n/g, '<br>')}</p>
              </div>

              <p>We typically respond within 24-48 hours. If you have any urgent questions, please don't hesitate to call us directly.</p>

              <p>Best regards,<br>
              The Elevate Training Camps Team</p>

              <hr style="margin: 30px 0; border: none; border-top: 1px solid #d3c7b4;">
              <p style="font-size: 12px; color: #666;">
                This is an automated confirmation email. Please do not reply to this message.
              </p>
            </div>
          `,
          text: `
            Thank You for Contacting Us!

            Dear ${firstName},

            Thank you for reaching out to Elevate Training Camps. We have received your message and will get back to you as soon as possible.

            Your Message Details:
            ${detailsText}
            Message: ${message}

            We typically respond within 24-48 hours. If you have any urgent questions, please don't hesitate to call us directly.

            Best regards,
            The Elevate Training Camps Team

            ---
            This is an automated confirmation email. Please do not reply to this message.
          `
        };

        // Send both emails
        await Promise.all([
          sendMail(adminMsg),
          sendMail(userMsg)
        ]);

        results.email.success = true;
      } catch (error) {
        console.error('Email error:', error);
        results.email.error = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    // Create contact in HubSpot
    if (process.env.HUBSPOT_ACCESS_TOKEN) {
      try {
        const properties = {
          firstname: firstName,
          lastname: lastName,
          email: email,
          subject: subjectLine,
          message: [detailsText, message].filter(Boolean).join('\n\n'),
          hs_lead_status: 'NEW',
          lifecyclestage: 'lead',
          lead_source: `Website Contact Form — ${SEGMENT_LABELS[segment]}`
        };

        await hubspotClient.crm.contacts.basicApi.create({
          properties
        });

        results.hubspot.success = true;
      } catch (error) {
        console.error('HubSpot error:', error);
        results.hubspot.error = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    // Check if at least one service succeeded
    const hasSuccess = results.email.success || results.hubspot.success;

    if (!hasSuccess) {
      return NextResponse.json(
        {
          error: 'Failed to process contact form',
          details: results
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      results
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
