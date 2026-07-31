import Layout from "../../components/layout";
import ContactForm from "../../components/ContactForm";
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
      <ContactForm heading={content?.heading} intro={content?.intro} />
    </Layout>
  );
}
