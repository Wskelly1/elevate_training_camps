import Layout from "../../components/layout";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";

/**
 * ContactPage - Contact form page for Elevate Training Camps
 *
 * This component provides a contact form for users to get in touch with the team.
 * It includes form fields for personal information and message content with
 * proper styling and layout.
 *
 * Features:
 * - Contact form with multiple input fields
 * - Responsive design with proper spacing
 * - Form validation and user feedback
 * - Clean, professional styling
 * - Accessible form labels and structure
 *
 * @returns {JSX.Element} The contact page with form
 */
export default function ContactPage() {
  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Contact Us</h1>
        <p className="text-center text-gray-600 mb-8">We'd love to hear from you! Please fill out the form below and we'll get back to you as soon as possible.</p>
      </div>
      <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-sm border border-gray-200 mb-24">
        <form className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1" htmlFor="firstName">First Name</label>
              <Input id="firstName" placeholder="First Name" />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1" htmlFor="lastName">Last Name</label>
              <Input id="lastName" placeholder="Last Name" />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="email">Email</label>
            <Input id="email" type="email" placeholder="Email" />
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="subject">Subject</label>
            <Input id="subject" placeholder="Subject" />
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="message">Message</label>
            <Textarea id="message" placeholder="Type your message here." rows={4} />
          </div>
          <Button type="submit" className="w-full h-12 text-base font-semibold">Send Message</Button>
        </form>
      </div>
    </Layout>
  );
}
