import Layout from "../../components/layout";
import MediaGallery from "../../components/MediaGallery";
import PageMasthead from "../../components/PageMasthead";
import { getMediaPage } from "../../lib/queries";

/**
 * MediaPage — one continuous mosaic wall with lightbox (owner direction
 * 2026-08-01: no chapter sections; the photos tile edge-to-edge — see
 * MediaGallery). Categories remain in the Studio for organization only.
 * Copy lives in the mediaPage singleton; the gallery renders published
 * mediaItem documents grouped into chapters (Trails / Town / Training).
 *
 * Publishing rules (also on the mediaItem schema):
 *  - NO recognizable athletes until photo consent clears (Gate-4).
 *  - Captions must be location-honest and must not invent history —
 *    the first season is 2027, so nothing may imply past camps.
 * With zero published items the page shows only the intro copy.
 */

export default async function MediaPage() {
  const { page, items } = await getMediaPage();

  return (
    <Layout transparentNav>
      {/* ——— Masthead ————————————————————————————————————— */}
      <PageMasthead
        imageUrl={page?.mastheadImageUrl}
        eyebrow="Photo & film"
        heading={page?.heading || "Media"}
        intro={page?.intro}
      />

      {/* ——— The wall — one continuous mosaic ————————————————— */}
      <MediaGallery items={items} />

      {items.length === 0 && page?.note && (
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-[15px] text-[var(--muted-foreground)]">{page.note}</p>
          </div>
        </section>
      )}
    </Layout>
  );
}
