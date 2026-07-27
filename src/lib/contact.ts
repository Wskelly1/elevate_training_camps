export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
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

  // Required field validation
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else {
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  if (!data.subject?.trim()) {
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

