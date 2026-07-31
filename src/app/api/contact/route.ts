import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '../../../lib/email';
import { Client } from '@hubspot/api-client';

// Initialize HubSpot client
const hubspotClient = new Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { firstName, lastName, email, subject, message } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

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
          subject: `Contact Form: ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><em>This message was sent from the Elevate Training Camps contact form.</em></p>
          `,
          text: `
            New Contact Form Submission

            Name: ${firstName} ${lastName}
            Email: ${email}
            Subject: ${subject}
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
                <p><strong>Subject:</strong> ${subject}</p>
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
            Subject: ${subject}
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
          subject: subject,
          message: message,
          hs_lead_status: 'NEW',
          lifecyclestage: 'lead',
          lead_source: 'Website Contact Form'
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
