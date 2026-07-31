import Image from "next/image";
import Layout from "../../components/layout";
import { getMediaPage } from "../../lib/queries";
import { urlFor } from "../../lib/sanity";

/**
 * MediaPage — CMS-driven (Wave 4 of the CMS-ification,
 * docs/10-sanity-content-plan.md §5). Copy lives in the mediaPage
 * singleton; the gallery renders published mediaItem documents, of which
 * there are none until the photo-consent gate clears (01-roadmap.md
 * Gate-4) — until then the page shows only the intro copy.
 *
 * Guardrail: no invented history — the first season is 2027, so nothing
 * here may imply past camps.
 */
export default async function MediaPage() {
  const { page, items } = await getMediaPage();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-10 p-8 text-center">
        <h1 className="text-3xl mb-4">{page?.heading || "Media"}</h1>
        {page?.intro && <p className="text-lg mb-6 text-[#4a4a4a]">{page.intro}</p>}
        {items.length > 0 && (
          <div className="mt-10 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <figure key={item._id}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <Image
                    src={urlFor(item.image).width(1200).url()}
                    alt={item.alt || item.caption || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  />
                </div>
                {item.caption && (
                  <figcaption className="mt-2 text-sm text-[var(--muted-foreground)]">{item.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
        {items.length === 0 && page?.note && (
          <p className="text-[15px] text-[var(--muted-foreground)]">{page.note}</p>
        )}
      </div>
    </Layout>
  );
}
