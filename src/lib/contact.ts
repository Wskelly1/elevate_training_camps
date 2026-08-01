/**
 * Contact form data layer — segmented by audience (owner decision
 * 2026-07-31): the form adapts to who is writing, and the segment plus its
 * extra fields ride the email subject/body and the HubSpot lead so enquiries
 * can be triaged without reading every message.
 *
 * The coach/organizer path deliberately captures program, state, squad size
 * and preferred weeks — the exact inputs the team-block booking flow starts
 * with, and the data the business plan's coach-validation questions (O-10)
 * need.
 */

export type ContactSegment = 'coach' | 'athlete' | 'partner' | 'local' | 'other';

export const CONTACT_SEGMENTS: Array<{ id: ContactSegment; label: string; blurb: string }> = [
  {
    id: 'coach',
    label: 'Coach or trip organizer',
    blurb: "You're bringing (or thinking about bringing) a team to Flagstaff.",
  },
  {
    id: 'athlete',
    label: 'Athlete or family',
    blurb: 'Questions about camp, or about the recruiting evaluation and advisory.',
  },
  {
    id: 'partner',
    label: 'College or pro connect',
    blurb: 'Collegiate staff and professional athletes or groups.',
  },
  {
    id: 'local',
    label: 'Housing partner or local business',
    blurb: 'Hosts, landlords, and Flagstaff businesses interested in working with visiting teams.',
  },
  {
    id: 'other',
    label: 'Something else',
    blurb: "General questions, press, anything that doesn't fit above.",
  },
];

export const SQUAD_SIZE_OPTIONS = ['Under 8', '8–11', '12–15', '16–20', '20+'] as const;

export interface ContactFormData {
  segment: ContactSegment;
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
  // Housing partner / local business path
  businessName?: string;
  businessType?: string;
  // Other path
  subject?: string;
  message: string;
}

export interface ContactFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  program?: string;
  affiliation?: string;
  businessName?: string;
  subject?: string;
  message?: string;
  general?: string;
}

export interface ContactFormResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: unknown;
}

export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  // Per-segment requirements: only the fields that genuinely gate a useful
  // reply are required — everything else stays optional so the form is light.
  if (data.segment === 'coach' && !data.program?.trim()) {
    errors.program = 'Program or school is required';
  }
  if (data.segment === 'partner' && !data.affiliation?.trim()) {
    errors.affiliation = 'Affiliation is required';
  }
  if (data.segment === 'local' && !data.businessName?.trim()) {
    errors.businessName = 'Business or property name is required';
  }
  if (data.segment === 'other' && !data.subject?.trim()) {
    errors.subject = 'Subject is required';
  }

  if (!data.message?.trim()) {
    errors.message = 'Message is required';
  } else if (data.message.length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  }

  return errors;
}

export async function submitContactForm(data: ContactFormData): Promise<ContactFormResponse> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to submit contact form',
        details: result.details
      };
    }

    return {
      success: true,
      message: result.message || 'Contact form submitted successfully'
    };
  } catch {
    return {
      success: false,
      error: 'Network error. Please try again later.'
    };
  }
}
