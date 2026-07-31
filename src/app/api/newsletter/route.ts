import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '../../../lib/email';
import { Client } from '@hubspot/api-client';

// Initialize HubSpot client
const hubspotClient = new Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});

interface NewsletterData {
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: NewsletterData = await request.json();
    const { email } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Send email notification via Gmail/Workspace
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD && process.env.GMAIL_FROM_EMAIL && process.env.GMAIL_TO_EMAIL) {
      try {
        // Send notification email to admin
        const adminMsg = {
          to: process.env.GMAIL_TO_EMAIL,
          subject: `New Newsletter Subscription: ${email}`,
          html: `
            <h2>New Newsletter Subscription</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subscription Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Source:</strong> Website Footer Newsletter Signup</p>
            <hr>
            <p><em>This subscription was captured from the Elevate Training Camps newsletter signup form.</em></p>
          `,
          text: `
            New Newsletter Subscription

            Email: ${email}
            Subscription Date: ${new Date().toLocaleDateString()}
            Source: Website Footer Newsletter Signup

            This subscription was captured from the Elevate Training Camps newsletter signup form.
          `
        };

        // Send confirmation email to subscriber
        const subscriberMsg = {
          to: email,
          subject: `Welcome to Elevate Training Camps Newsletter!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #427b4d; margin-bottom: 20px;">Welcome to Our Newsletter!</h2>

              <p>Thank you for subscribing to the Elevate Training Camps newsletter!</p>

              <p>You're now part of our community and will receive:</p>
              <ul style="color: #427b4d;">
                <li>Training camp updates and 2027 season dates as they're set</li>
                <li>Training tips and techniques from our coaches</li>
                <li>News from Flagstaff and the altitude-training world</li>
              </ul>

              <div style="background-color: #f0ead6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <h3 style="color: #427b4d; margin-top: 0;">Ready to Elevate Your Game?</h3>
                <p>Check out our upcoming training camps and take your skills to the next level!</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/registration"
                   style="display: inline-block; background-color: #427b4d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  View Training Camps
                </a>
              </div>

              <p>We're excited to have you on this journey with us. If you have any questions, feel free to reach out!</p>

              <p>Best regards,<br>
              The Elevate Training Camps Team</p>

              <hr style="margin: 30px 0; border: none; border-top: 1px solid #d3c7b4;">
              <p style="font-size: 12px; color: #666;">
                You received this email because you subscribed to our newsletter. If you no longer wish to receive these emails, please contact us to unsubscribe.
              </p>
            </div>
          `,
          text: `
            Welcome to Our Newsletter!

            Thank you for subscribing to the Elevate Training Camps newsletter!

            You're now part of our community and will receive:
            - Training camp updates and 2027 season dates as they're set
            - Training tips and techniques from our coaches
            - News from Flagstaff and the altitude-training world

            Ready to Elevate Your Game?
            Check out our upcoming training camps and take your skills to the next level!
            Visit: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/registration

            We're excited to have you on this journey with us. If you have any questions, feel free to reach out!

            Best regards,
            The Elevate Training Camps Team

            ---
            You received this email because you subscribed to our newsletter. If you no longer wish to receive these emails, please contact us to unsubscribe.
          `
        };

        // Send both emails
        await Promise.all([
          sendMail(adminMsg),
          sendMail(subscriberMsg)
        ]);

        results.email.success = true;
      } catch (error) {
        console.error('Email error:', error);
        results.email.error = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    // Create contact in HubSpot with newsletter subscription
    if (process.env.HUBSPOT_ACCESS_TOKEN) {
      try {
        const properties = {
          email: email,
          hs_lead_status: 'NEW',
          lifecyclestage: 'lead',
          lead_source: 'Newsletter Signup',
          newsletter_subscription: 'true',
          newsletter_signup_date: new Date().toISOString(),
          newsletter_source: 'Website Footer'
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
          error: 'Failed to process newsletter subscription',
          details: results
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
