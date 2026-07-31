'use client';

import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";
import { ContactFormData, ContactFormErrors, validateContactForm, submitContactForm } from "../lib/contact";

/**
 * ContactForm - Client-side interactive contact form.
 *
 * Split out from app/contact/page.tsx so that page can be a plain Server
 * Component (needed to render the now-async Layout directly) while this
 * component owns all the form state/validation/submission logic. The
 * heading/intro copy arrives as props from the contactPage singleton
 * (CMS-ification Wave 3); form labels stay in code.
 */
export default function ContactForm({ heading, intro }: { heading?: string; intro?: string }) {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof ContactFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateContactForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrors({});

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || 'Thank you for your message! We\'ll get back to you soon.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitStatus('error');
      setSubmitMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl mb-2 text-center">{heading || "Contact Us"}</h1>
        {intro && <p className="text-center text-gray-600 mb-8">{intro}</p>}
      </div>
      <div className="max-w-xl mx-auto p-8 bg-[var(--surface)] rounded-lg shadow-sm border-2 border-[var(--border)] border-t-[var(--primary)] mb-24">
        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            <p className="font-medium">Success!</p>
            <p>{submitMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-medium">Error</p>
            <p>{submitMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-black" htmlFor="firstName">
                First Name *
              </label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-black" htmlFor="lastName">
                Last Name *
              </label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block mb-1 text-black" htmlFor="email">
              Email *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-black" htmlFor="subject">
              Subject *
            </label>
            <Input
              id="subject"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleInputChange}
              className={errors.subject ? 'border-red-500' : ''}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-black" htmlFor="message">
              Message *
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Type your message here."
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              className={errors.message ? 'border-red-500' : ''}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </div>
    </>
  );
}
