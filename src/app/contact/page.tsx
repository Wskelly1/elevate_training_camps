import Layout from "../../components/layout";
import ContactForm from "../../components/ContactForm";

/**
 * ContactPage - Contact form page for Elevate Training Camps
 *
 * Server Component shell (required so it can render the async Layout
 * directly); all interactive form logic lives in ContactForm.
 */
export default function ContactPage() {
  return (
    <Layout>
      <ContactForm />
    </Layout>
  );
}
