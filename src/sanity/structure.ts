import type { StructureResolver } from 'sanity/structure'
import {
  CogIcon,
  HomeIcon,
  ClipboardIcon,
  UsersIcon,
  HelpCircleIcon,
  CalendarIcon,
  StarIcon,
  TagIcon,
  CheckmarkCircleIcon,
  UserIcon,
  DocumentTextIcon,
  BulbOutlineIcon,
  ErrorOutlineIcon,
} from '@sanity/icons'

/**
 * Studio structure — organised by WHERE CONTENT APPEARS ON THE SITE.
 *
 * The organising logic (see docs/03-sanity-studio-guide.md for the full rationale):
 * an editor thinks "I need to update the Registration page", not "I need to
 * edit a trainingPackage document". So the top level mirrors the site's
 * navigation, and document types are nested under the page they feed.
 * Anything global (settings, home) sits above the divider.
 *
 * Lists that the site renders in a fixed sequence are sorted by their
 * `order` field by default, so what an editor sees in the Studio matches
 * what a visitor sees on the page.
 *
 * Note on singletons: Site Settings and Home Page are one-document types,
 * but the existing documents use generated UUIDs rather than fixed IDs, so
 * they are presented as filtered lists rather than forced single documents.
 * Pinning a fixed documentId here would open a different, empty document
 * and make the real content look like it had vanished.
 */

/** Types rendered in a fixed sequence, driven by their `order` field. */
const byOrder = [{ field: 'order', direction: 'asc' as const }]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Elevate Training Camps')
    .items([
      // ——— Global ————————————————————————————————————————————————
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.documentList()
            .title('Site Settings')
            .filter('_type == "siteSettings"')
        ),

      S.listItem()
        .title('Home Page')
        .icon(HomeIcon)
        .child(
          S.documentList()
            .title('Home Page')
            .filter('_type == "homePage"')
        ),

      S.divider(),

      // ——— Registration page ———————————————————————————————————
      // Wave 1 of the CMS-ification (docs/10-sanity-content-plan.md §5):
      // the page reads the pinned registrationPage singleton + teamBlock
      // documents. The three legacy types below it render nowhere and are
      // removed in Wave 5.
      S.listItem()
        .title('Registration Page')
        .icon(ClipboardIcon)
        .child(
          S.list()
            .title('Registration Page')
            .items([
              S.listItem()
                .title('Page Copy')
                .icon(ClipboardIcon)
                .child(
                  S.document()
                    .schemaType('registrationPage')
                    .documentId('registrationPage')
                    .title('Registration Page Copy')
                ),
              S.listItem()
                .title('Team Blocks (pricing)')
                .icon(TagIcon)
                .child(
                  S.documentTypeList('teamBlock')
                    .title('Team Blocks (pricing)')
                    .defaultOrdering(byOrder)
                ),
              S.divider(),
              S.listItem()
                .title('Training Packages (legacy — not rendered)')
                .icon(TagIcon)
                .child(
                  S.documentTypeList('trainingPackage')
                    .title('Training Packages (legacy — not rendered)')
                    .defaultOrdering(byOrder)
                ),
              S.listItem()
                .title('Upcoming Camps (legacy — not rendered)')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('upcomingCamp')
                    .title('Upcoming Camps (legacy — not rendered)')
                    .defaultOrdering(byOrder)
                ),
              S.listItem()
                .title("What's Included (legacy — not rendered)")
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentTypeList('whatsIncluded')
                    .title("What's Included (legacy — not rendered)")
                    .defaultOrdering(byOrder)
                ),
            ])
        ),

      // ——— Coaching page (legacy — renders nowhere) ————————————————
      // /coaching was repurposed as /recruiting (O-16, 2026-07-29), whose
      // copy is in code; no query reads these types anymore. The group stays
      // visible (deprecated-not-hidden rule) until the Phase 1.5 schema
      // reshape removes the types and their 3 remaining documents.
      S.listItem()
        .title('Coaching Page (legacy — not rendered)')
        .icon(BulbOutlineIcon)
        .child(
          S.list()
            .title('Coaching Page (legacy — not rendered)')
            .items([
              S.listItem()
                .title('Coaching Programs')
                .icon(TagIcon)
                .child(
                  S.documentTypeList('coachingProgram')
                    .title('Coaching Programs')
                    .defaultOrdering(byOrder)
                ),
              S.listItem()
                .title('Why Choose Us (Benefits)')
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentTypeList('coachingBenefit')
                    .title('Why Choose Us (Benefits)')
                    .defaultOrdering(byOrder)
                ),
              S.listItem()
                .title('Athlete Testimonials')
                .icon(StarIcon)
                .child(
                  S.documentTypeList('coachingTestimonial')
                    .title('Athlete Testimonials')
                    .defaultOrdering(byOrder)
                ),
            ])
        ),

      // ——— About page ——————————————————————————————————————————
      S.listItem()
        .title('About Page')
        .icon(UserIcon)
        .child(
          S.list()
            .title('About Page')
            .items([
              S.listItem()
                .title('Page Sections')
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList('aboutSection').title('Page Sections')
                ),
              S.listItem()
                .title('Team Members')
                .icon(UsersIcon)
                .child(
                  S.documentTypeList('teamMember')
                    .title('Team Members')
                    .defaultOrdering(byOrder)
                ),
            ])
        ),

      // ——— FAQ page ————————————————————————————————————————————
      S.listItem()
        .title('FAQ Page')
        .icon(HelpCircleIcon)
        .child(
          S.documentTypeList('faq')
            .title('FAQ Questions')
            .defaultOrdering(byOrder)
        ),

      S.divider(),

      // ——— Deprecated ——————————————————————————————————————————
      // Surfaced rather than hidden so nothing disappears silently.
      S.listItem()
        .title('Deprecated — do not use')
        .icon(ErrorOutlineIcon)
        .child(
          S.list()
            .title('Deprecated — do not use')
            .items([
              S.listItem()
                .title('Payment Options')
                .icon(ErrorOutlineIcon)
                .child(
                  S.documentTypeList('paymentOption')
                    .title('Payment Options (deprecated)')
                ),
            ])
        ),
    ])
