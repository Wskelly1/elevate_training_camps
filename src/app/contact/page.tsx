import Layout from "../../components/layout";
import ContactForm from "../../components/ContactForm";
import PageMasthead from "../../components/PageMasthead";
import { getContactPage, getSiteSettings } from "../../lib/queries";

/**
 * ContactPage — Cinematic Lodge treatment (2026-07-31 polish): photo
 * masthead, then an editorial split — a contact-details column beside the
 * open form on paper, replacing the old boxed cream card that predated the
 * design system. Heading/intro come from the contactPage singleton; the
 * email/phone come from siteSettings so they stay Studio-editable.
 */
export default async function ContactPage() {
  const [content, settings] = await Promise.all([getContactPage(), getSiteSettings()]);

  return (
    <Layout transparentNav>
      <PageMasthead
        imageUrl={content?.mastheadImageUrl}
        eyebrow="Get in touch"
        heading={content?.heading || "Contact Us"}
        intro={content?.intro}
      />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-14 md:grid-cols-12">
          {/* ——— Details column ————————————————————————————— */}
          <div className="md:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--accent-rock)]">Direct</p>
            <div className="mt-6 space-y-5">
              {settings.contactEmail && (
                <div className="border-b border-[var(--border)] pb-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Email</p>
                  <a href={`mailto:${settings.contactEmail}`} className="mt-1 block text-[17px] text-[var(--primary)] transition hover:text-[var(--primary-hover)]">
                    {settings.contactEmail}
                  </a>
                </div>
              )}
              {settings.contactPhone && (
                <div className="border-b border-[var(--border)] pb-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Phone</p>
                  <a href={`tel:${settings.contactPhone.replace(/[^+\d]/g, "")}`} className="mt-1 block text-[17px] text-[var(--primary)] transition hover:text-[var(--primary-hover)]">
                    {settings.contactPhone}
                  </a>
                </div>
              )}
              <div className="border-b border-[var(--border)] pb-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Based in</p>
                <p className="mt-1 text-[17px]">Flagstaff, Arizona</p>
              </div>
            </div>
            <p className="mt-8 max-w-[36ch] text-[15px] leading-[1.75] text-[#4a4a4a]">
              We typically reply within a day or two. Coaches and parents
              planning a block: the more you can tell us about your squad and
              your weeks, the faster we can come back with a real plan.
            </p>
          </div>

          {/* ——— Form column ————————————————————————————————— */}
          <div className="md:col-span-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </Layout>
  );
}
