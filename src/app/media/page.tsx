import Image from "next/image";
import Layout from "../../components/layout";
import PageMasthead from "../../components/PageMasthead";
import { getMediaPage, type MediaItem } from "../../lib/queries";
import { urlFor } from "../../lib/sanity";

/**
 * MediaPage — chaptered editorial gallery (owner decision 2026-07-31).
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

      {/* ——— Chapters ————————————————————————————————————— */}
      {(chapters.length > 0 || uncategorized.length > 0) && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="mb-16 last:mb-0">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-rock)]">
                  {chapter.title}
                </p>
                <div className="mt-6 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                  {chapter.items.map((item) => (
                    <figure key={item._id}>
                      <div className="img-live relative aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={urlFor(item.image).width(1200).url()}
                          alt={item.alt || item.caption || ""}
                          fill
                          className="object-cover"
                          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                        />
                      </div>
                      {item.caption && (
                        <figcaption className="mt-2 mb-4 px-1 text-sm text-[var(--muted-foreground)]">
                          {item.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            ))}
            {uncategorized.length > 0 && (
              <div className="mt-6 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {uncategorized.map((item) => (
                  <figure key={item._id}>
                    <div className="img-live relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={urlFor(item.image).width(1200).url()}
                        alt={item.alt || item.caption || ""}
                        fill
                        className="object-cover"
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      />
                    </div>
                    {item.caption && (
                      <figcaption className="mt-2 text-sm text-[var(--muted-foreground)]">
                        {item.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </div>
        </section>
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
