'use client';

import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  ContactFormData,
  ContactFormErrors,
  ContactSegment,
  CONTACT_SEGMENTS,
  SQUAD_SIZE_OPTIONS,
  validateContactForm,
  submitContactForm,
} from "../lib/contact";

/**
 * ContactForm — segmented by audience (owner decision 2026-07-31).
 *
 * The "I am a…" picker swaps the visible fields so a coach, a family, and a
 * collegiate/professional contact each answer only what matters for their
 * path. The coach path collects program/state/squad size/preferred weeks —
 * the exact inputs the team-block booking flow starts with. The segment
 * rides the email subject and the HubSpot lead for triage.
 *
 * Split out from app/contact/page.tsx so that page can be a plain Server
 * Component; the heading/intro copy arrives as props from the contactPage
 * singleton (CMS-ification Wave 3). Form labels stay in code — UI, not
 * content.
 */

const EMPTY_FORM = (segment: ContactSegment): ContactFormData => ({
  segment,
  firstName: '',
  lastName: '',
  email: '',
  program: '',
  state: '',
  squadSize: '',
  preferredWeeks: '',
  gradYear: '',
  interest: '',
  affiliation: '',
  connectionType: '',
  subject: '',
  message: '',
});

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1">
      <label className="block mb-1 text-black" htmlFor={id}>
        {label}{required ? ' *' : ''}
      </label>
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default function ContactForm({ heading, intro }: { heading?: string; intro?: string }) {
  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM('coach'));
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const segment = formData.segment;
  const activeSegment = CONTACT_SEGMENTS.find((s) => s.id === segment);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const pickSegment = (id: ContactSegment) => {
    // Keep identity + message when switching; clear path-specific fields and
    // their errors so a half-filled coach form doesn't ride along invisibly.
    setFormData(prev => ({
      ...EMPTY_FORM(id),
      firstName: prev.firstName,
      lastName: prev.lastName,
      email: prev.email,
      message: prev.message,
    }));
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        setFormData(EMPTY_FORM(segment));
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

  const selectClass =
    'w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm';

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl mb-2 text-center">{heading || "Contact Us"}</h1>
        {intro && <p className="text-center text-gray-600 mb-8">{intro}</p>}
      </div>
      <div className="max-w-2xl mx-auto p-8 bg-[var(--surface)] rounded-lg shadow-sm border-2 border-[var(--border)] border-t-[var(--primary)] mb-24">
        {/* ——— Segment picker ————————————————————————————— */}
        <fieldset className="mb-8">
          <legend className="block mb-3 text-black">I am a…</legend>
          <div className="grid grid-cols-2 gap-3">
            {CONTACT_SEGMENTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => pickSegment(s.id)}
                aria-pressed={segment === s.id}
                className={`rounded-md border px-4 py-3 text-left text-sm transition ${
                  segment === s.id
                    ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                    : 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--primary)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {activeSegment && (
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">{activeSegment.blurb}</p>
          )}
        </fieldset>

        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            <p className="font-medium">Success!</p>
            <p>{submitMessage}</p>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-medium">Error</p>
            <p>{submitMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ——— Identity (all segments) ————————————————— */}
          <div className="flex gap-4">
            <Field id="firstName" label="First Name" required error={errors.firstName}>
              <Input
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? 'border-red-500' : ''}
              />
            </Field>
            <Field id="lastName" label="Last Name" required error={errors.lastName}>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? 'border-red-500' : ''}
              />
            </Field>
          </div>
          <Field id="email" label="Email" required error={errors.email}>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'border-red-500' : ''}
            />
          </Field>

          {/* ——— Coach / trip organiser ————————————————— */}
          {segment === 'coach' && (
            <>
              <div className="flex gap-4">
                <Field id="program" label="Program / School" required error={errors.program}>
                  <Input
                    id="program"
                    name="program"
                    placeholder="e.g. Desert Vista HS XC"
                    value={formData.program}
                    onChange={handleInputChange}
                    className={errors.program ? 'border-red-500' : ''}
                  />
                </Field>
                <Field id="state" label="State">
                  <Input
                    id="state"
                    name="state"
                    placeholder="e.g. CA"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </Field>
              </div>
              <div className="flex gap-4">
                <Field id="squadSize" label="Likely squad size">
                  <select
                    id="squadSize"
                    name="squadSize"
                    value={formData.squadSize}
                    onChange={handleInputChange}
                    className={selectClass}
                  >
                    <option value="">Select…</option>
                    {SQUAD_SIZE_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field id="preferredWeeks" label="Preferred weeks">
                  <Input
                    id="preferredWeeks"
                    name="preferredWeeks"
                    placeholder="e.g. mid-June, 3 weeks"
                    value={formData.preferredWeeks}
                    onChange={handleInputChange}
                  />
                </Field>
              </div>
            </>
          )}

          {/* ——— Athlete & family ———————————————————————— */}
          {segment === 'athlete' && (
            <div className="flex gap-4">
              <Field id="gradYear" label="Graduation year">
                <Input
                  id="gradYear"
                  name="gradYear"
                  placeholder="e.g. 2028"
                  value={formData.gradYear}
                  onChange={handleInputChange}
                />
              </Field>
              <Field id="interest" label="What are you interested in?">
                <select
                  id="interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleInputChange}
                  className={selectClass}
                >
                  <option value="">Select…</option>
                  <option value="Camp with my team">Camp with my team</option>
                  <option value="Recruiting evaluation">Recruiting evaluation</option>
                  <option value="Recruiting advisory">Recruiting advisory</option>
                  <option value="General question">General question</option>
                </select>
              </Field>
            </div>
          )}

          {/* ——— College / pro connect ——————————————————— */}
          {segment === 'partner' && (
            <div className="flex gap-4">
              <Field id="affiliation" label="Affiliation" required error={errors.affiliation}>
                <Input
                  id="affiliation"
                  name="affiliation"
                  placeholder="e.g. NAU Track & Field, HYPO2, host property"
                  value={formData.affiliation}
                  onChange={handleInputChange}
                  className={errors.affiliation ? 'border-red-500' : ''}
                />
              </Field>
              <Field id="connectionType" label="Type of connection">
                <select
                  id="connectionType"
                  name="connectionType"
                  value={formData.connectionType}
                  onChange={handleInputChange}
                  className={selectClass}
                >
                  <option value="">Select…</option>
                  <option value="Collegiate program">Collegiate program</option>
                  <option value="Professional athlete/group">Professional athlete/group</option>
                  <option value="Housing partner">Housing partner</option>
                  <option value="Local business">Local business</option>
                  <option value="Other partnership">Other partnership</option>
                </select>
              </Field>
            </div>
          )}

          {/* ——— Other ——————————————————————————————————— */}
          {segment === 'other' && (
            <Field id="subject" label="Subject" required error={errors.subject}>
              <Input
                id="subject"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={errors.subject ? 'border-red-500' : ''}
              />
            </Field>
          )}

          <Field id="message" label="Message" required error={errors.message}>
            <Textarea
              id="message"
              name="message"
              placeholder={
                segment === 'coach'
                  ? 'Tell us about your program and what you want out of a block.'
                  : 'Type your message here.'
              }
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              className={errors.message ? 'border-red-500' : ''}
            />
          </Field>

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
