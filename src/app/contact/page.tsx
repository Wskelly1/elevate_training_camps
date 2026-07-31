import Layout from "../../components/layout";
import ContactForm from "../../components/ContactForm";
import PageMasthead from "../../components/PageMasthead";
import { getContactPage } from "../../lib/queries";

/**
 * ContactPage - Contact form page for Elevate Training Camps
 *
 * Server Component shell (required so it can render the async Layout
 * directly); all interactive form logic lives in ContactForm. The page
 * heading and intro come from the contactPage singleton (CMS-ification
 * Wave 3); form field labels stay in code — they are UI, not content.
 */
export default async function ContactPage() {
  const content = await getContactPage();
  return (
    <Layout>
      <PageMasthead
        eyebrow="Get in touch"
        heading={content?.heading || "Contact Us"}
        intro={content?.intro}
      />
      <div className="py-16">
        <ContactForm />
      </div>
    </Layout>
  );
}
