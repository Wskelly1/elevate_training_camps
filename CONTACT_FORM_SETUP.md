# Contact Form & Newsletter Integration Setup Guide

This guide will help you set up SendGrid and HubSpot integration for both the contact form and newsletter signup in your Elevate Training Camps application.

## Overview

The application now includes:
- ✅ Contact form with SendGrid email notifications and HubSpot lead capture
- ✅ Newsletter signup in footer with SendGrid email notifications and HubSpot lead capture
- ✅ **Confirmation emails sent to users** for both contact form and newsletter signup
- ✅ Form validation for both forms
- ✅ Loading states and error handling
- ✅ Success/error feedback for both forms

## Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=your_from_email@example.com
SENDGRID_TO_EMAIL=your_to_email@example.com

# HubSpot Configuration
HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token_here
HUBSPOT_PORTAL_ID=your_hubspot_portal_id_here

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## SendGrid Setup

### 1. Create a SendGrid Account
- Go to [SendGrid](https://sendgrid.com/) and create an account
- Verify your account via email

### 2. Create an API Key
- Log into your SendGrid dashboard
- Navigate to Settings > API Keys
- Click "Create API Key"
- Choose "Restricted Access" and give it "Mail Send" permissions
- Copy the API key and add it to your `.env.local` file

### 3. Verify Sender Identity
- Go to Settings > Sender Authentication
- Choose "Single Sender Verification" or "Domain Authentication"
- For single sender, add the email you want to send from
- Verify the email address

### 4. Update Environment Variables
```env
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=your_verified_email@yourdomain.com
SENDGRID_TO_EMAIL=contact@yourdomain.com
```

## HubSpot Setup

### 1. Create a HubSpot Account
- Go to [HubSpot](https://www.hubspot.com/) and create an account
- Choose the free plan to start

### 2. Get Your Portal ID
- In your HubSpot dashboard, go to Settings (gear icon)
- Under "Account Setup", click "Account Defaults"
- Your Portal ID is displayed at the top

### 3. Create a Private App
- Go to Settings > Integrations > Private Apps
- Click "Create a private app"
- Give it a name (e.g., "Contact Form Integration")
- In the Scopes tab, add these permissions:
  - `crm.objects.contacts.write`
  - `crm.objects.contacts.read`
- Click "Create app"
- Copy the access token

### 4. Update Environment Variables
```env
HUBSPOT_ACCESS_TOKEN=your_private_app_token_here
HUBSPOT_PORTAL_ID=your_portal_id_here
```

## Testing the Integration

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test the Contact Form
- Navigate to `/contact` in your browser
- Fill out the form with test data
- Submit the form

### 3. Test the Newsletter Signup
- Scroll to the footer of any page
- Enter an email address in the newsletter signup form
- Click the subscribe button

### 4. Verify Integration
- **SendGrid Admin Emails**: Check your email inbox for notifications from both forms
- **SendGrid User Confirmations**: Check the email address you used to test - you should receive confirmation emails
- **HubSpot**: Go to Contacts in your HubSpot dashboard to see the new leads

## Features

### Form Validation
- All fields are required
- Email format validation
- Minimum message length (10 characters)
- Real-time error clearing when user starts typing

### Email Notifications (SendGrid)
- **Admin notifications**: Professional HTML email template with all form data sent to your configured email address
- **User confirmation emails**: Beautiful, branded confirmation emails sent to users who submit forms
- **Contact form confirmations**: Personalized thank you emails with message details and response timeline
- **Newsletter confirmations**: Welcome emails with benefits list and call-to-action to view training camps
- Fallback text versions included for all emails

### Lead Capture (HubSpot)
- Creates new contact with all form data
- Sets lead status to "NEW"
- Assigns lifecycle stage as "lead"
- Marks lead source as "Website Contact Form" or "Newsletter Signup"
- For newsletter signups, adds additional properties like newsletter_subscription and signup date

### User Experience
- Loading state during submission
- Success message on completion
- Error handling with user-friendly messages
- Form reset after successful submission

## Troubleshooting

### Common Issues

1. **SendGrid API Key Invalid**
   - Verify the API key is correct
   - Ensure the key has "Mail Send" permissions
   - Check that the sender email is verified

2. **HubSpot Access Token Invalid**
   - Verify the private app token is correct
   - Ensure the app has the required scopes
   - Check that the portal ID is correct

3. **Form Not Submitting**
   - Check browser console for errors
   - Verify all environment variables are set
   - Ensure the API route is accessible

### Debug Mode
To see detailed error information, check the browser's Network tab and the server console logs.

## Security Notes

- Never commit your `.env.local` file to version control
- Use environment-specific API keys for production
- Regularly rotate your API keys
- Monitor your SendGrid and HubSpot usage

## Production Deployment

When deploying to production:

1. Set environment variables in your hosting platform
2. Use production API keys
3. Update `NEXT_PUBLIC_APP_URL` to your production domain
4. Test the integration in the production environment

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all environment variables are correctly set
3. Test each service individually (SendGrid and HubSpot)
4. Check the API documentation for both services

## Files Modified/Created

- `src/app/api/contact/route.ts` - API endpoint for contact form submission
- `src/app/api/newsletter/route.ts` - API endpoint for newsletter subscription
- `src/lib/contact.ts` - Contact form validation and submission utilities
- `src/lib/newsletter.ts` - Newsletter validation and submission utilities
- `src/app/contact/page.tsx` - Updated contact form component
- `src/components/layout.tsx` - Updated footer newsletter form with SendGrid integration
- `package.json` - Added SendGrid and HubSpot dependencies
