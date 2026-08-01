"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MediaItem } from "../lib/queries";
import { urlFor } from "../lib/sanity";

/**
 * MediaGallery — the editorial mosaic + lightbox for /media (owner request
 * 2026-08-01: varied frame sizes and click-to-expand instead of a flat
 * grid).
 *
 * Each chapter lays its items into a repeating four-slot mosaic:
 *   slot 0 — full-width 21:9 hero frame
 *   slot 1 — tall portrait, left
 *   slot 2 — landscape, right, dropped lower (staggered baseline)
 *   slot 3 — landscape, offset right at 8 cols
 * so no two adjacent frames share a silhouette. Captions live in a
 * hover-reveal scrim on desktop (always visible on touch via the
 * lightbox). Clicking any frame opens the lightbox: full-screen dark
 * theatre, arrow/escape keys, prev/next across the whole page's items.
 */

type Chapter = { id: string; title: string; items: MediaItem[] };

function Frame({
  item,
  className,
  aspect,
  sizes,
  onOpen,
}: {
  item: MediaItem;
  className?: string;
  aspect: string;
  sizes: string;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className={`img-live group relative block w-full overflow-hidden text-left ${aspect} ${className ?? ""}`}
      aria-label={item.caption ? `Expand: ${item.caption}` : "Expand photo"}
    >
      <Image
        src={urlFor(item.image).width(1800).url()}
        alt={item.alt || item.caption || ""}
        fill
        className="object-cover"
        sizes={sizes}
      />
      {item.caption && (
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "linear-gradient(180deg, rgba(20,26,18,0) 30%, rgba(20,26,18,0.7) 100%)" }}
        >
          <span className="text-[13px] leading-snug text-[#f0ead6]">{item.caption}</span>
        </span>
      )}
    </button>
  );
}

export default function MediaGallery({ chapters }: { chapters: Chapter[] }) {
  const flat = chapters.flatMap((c) => c.items);
  const [open, setOpen] = useState<number | null>(null);

  const move = useCallback(
    (delta: number) => setOpen((c) => (c === null ? null : (c + delta + flat.length) % flat.length)),
    [flat.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, move]);

  let globalIndex = 0;

  return (
    <>
      {chapters.map((chapter, chapterIdx) => {
        const base = globalIndex;
        globalIndex += chapter.items.length;
        return (
          <section key={chapter.id} className={chapterIdx % 2 === 1 ? "border-y border-[var(--border)] bg-[var(--surface)] py-16" : "py-16"}>
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--accent-rock)]">
                {String(chapterIdx + 1).padStart(2, "0")} · {chapter.title}
              </p>
              <div className="mt-8 grid grid-cols-12 gap-4 md:gap-5">
                {chapter.items.map((item, i) => {
                  const slot = i % 4;
                  const idx = base + i;
                  if (slot === 0) {
                    return (
                      <Frame key={item._id} item={item} onOpen={() => setOpen(idx)}
                        className="col-span-12" aspect="aspect-[21/9]" sizes="92vw" />
                    );
                  }
                  if (slot === 1) {
                    return (
                      <Frame key={item._id} item={item} onOpen={() => setOpen(idx)}
                        className="col-span-6 md:col-span-5" aspect="aspect-[3/4]" sizes="(max-width:768px) 50vw, 38vw" />
                    );
                  }
                  if (slot === 2) {
                    return (
                      <Frame key={item._id} item={item} onOpen={() => setOpen(idx)}
                        className="col-span-6 md:col-span-7 md:mt-16" aspect="aspect-[4/3]" sizes="(max-width:768px) 50vw, 52vw" />
                    );
                  }
                  return (
                    <Frame key={item._id} item={item} onOpen={() => setOpen(idx)}
                      className="col-span-12 md:col-span-8 md:col-start-5" aspect="aspect-[16/9]" sizes="(max-width:768px) 100vw, 60vw" />
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* ——— Lightbox ————————————————————————————————————— */}
      {open !== null && flat[open] && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-[#141a12]/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(null)}
        >
          <div className="flex items-center justify-end p-4">
            <button
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="rounded-full border border-[#f0ead6]/40 p-2.5 text-[#f0ead6] transition hover:bg-[#f0ead6]/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative flex-1 px-4 pb-4 md:px-16" onClick={(e) => e.stopPropagation()}>
            <Image
              src={urlFor(flat[open].image).width(2400).url()}
              alt={flat[open].alt || flat[open].caption || ""}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          <div
            className="flex items-center justify-between gap-6 p-5 md:px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => move(-1)}
              aria-label="Previous photo"
              className="rounded-full border border-[#f0ead6]/40 p-2.5 text-[#f0ead6] transition hover:bg-[#f0ead6]/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <p className="flex-1 text-center text-[14px] leading-snug text-[#f0ead6]/85">
              {flat[open].caption}
              <span className="ml-3 text-[#f0ead6]/50">{open + 1} / {flat.length}</span>
            </p>
            <button
              onClick={() => move(1)}
              aria-label="Next photo"
              className="rounded-full border border-[#f0ead6]/40 p-2.5 text-[#f0ead6] transition hover:bg-[#f0ead6]/10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
