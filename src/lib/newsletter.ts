export interface NewsletterData {
  email: string;
}

export interface NewsletterResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: unknown;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function subscribeToNewsletter(email: string): Promise<NewsletterResponse> {
  try {
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to subscribe to newsletter',
        details: result.details
      };
    }

    return {
      success: true,
      message: result.message || 'Thank you for subscribing to our newsletter!'
    };
  } catch {
    return {
      success: false,
      error: 'Network error. Please try again later.'
    };
  }
}

