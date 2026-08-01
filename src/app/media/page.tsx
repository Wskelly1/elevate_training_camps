import Layout from "../../components/layout";
import MediaGallery from "../../components/MediaGallery";
import PageMasthead from "../../components/PageMasthead";
import { getMediaPage, type MediaItem } from "../../lib/queries";

/**
 * MediaPage — editorial mosaic gallery with lightbox (owner request
 * 2026-08-01: varied frame sizes + click-to-expand; see MediaGallery).
 * Copy lives in the mediaPage singleton; the gallery renders published
 * mediaItem documents grouped into chapters (Trails / Town / Training).
 *
 * Publishing rules (also on the mediaItem schema):
 *  - NO recognizable athletes until photo consent clears (Gate-4).
 *  - Captions must be location-honest and must not invent history —
 *    the first season is 2027, so nothing may imply past camps.
 * With zero published items the page shows only the intro copy.
 */

const CHAPTERS: Array<{ id: string; title: string }> = [
  { id: "trails", title: "Trails" },
  { id: "town", title: "Town" },
  { id: "training", title: "Training" },
];

export default async function MediaPage() {
  const { page, items } = await getMediaPage();

  const chapters = CHAPTERS.map((c) => ({
    ...c,
    items: items.filter((i: MediaItem) => i.category === c.id),
  })).filter((c) => c.items.length > 0);
  const uncategorized = items.filter(
    (i: MediaItem) => !i.category || !CHAPTERS.some((c) => c.id === i.category)
  );

  return (
    <Layout transparentNav>
      {/* ——— Masthead ————————————————————————————————————— */}
      <PageMasthead
        imageUrl={page?.mastheadImageUrl}
        eyebrow="Photo & film"
        heading={page?.heading || "Media"}
        intro={page?.intro}
      />

      {/* ——— Chapters — editorial mosaic + lightbox ——————————— */}
      {(chapters.length > 0 || uncategorized.length > 0) && (
        <MediaGallery
          chapters={[
            ...chapters,
            ...(uncategorized.length > 0 ? [{ id: "more", title: "More", items: uncategorized }] : []),
          ]}
        />
      )}

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
