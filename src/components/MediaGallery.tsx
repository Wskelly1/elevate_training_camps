"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MediaItem } from "../lib/queries";
import { urlFor } from "../lib/sanity";

/**
 * MediaGallery — one continuous mosaic for /media (owner direction
 * 2026-08-01: no chapter sections, the pictures should fit together as a
 * single wall).
 *
 * The mosaic is built from repeating rows whose column spans always sum
 * to 12 and whose frames share a fixed row height, so every row tiles
 * edge-to-edge with no holes — images crop to fill their frame:
 *
 *   row A — one full-width panorama
 *   row B — a 5/7 pair
 *   row C — a 4/4/4 triptych
 *   row D — a 7/5 pair
 *
 * The final row redistributes its spans (12, 6/6, or 4/4/4) so the wall
 * always finishes flush. Tight 4px gutters, hover caption scrims, and a
 * full-screen lightbox with keyboard navigation. mediaItem categories
 * still exist in the Studio for organization; the wall renders everything
 * in display order.
 */

const PATTERN: Array<{ spans: number[]; height: string }> = [
  { spans: [12], height: "h-[300px] md:h-[52vh]" },
  { spans: [5, 7], height: "h-[240px] md:h-[440px]" },
  { spans: [4, 4, 4], height: "h-[200px] md:h-[320px]" },
  { spans: [7, 5], height: "h-[240px] md:h-[440px]" },
];

const SPAN_CLASS: Record<number, string> = {
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  12: "col-span-12",
};

/** Chunk items into rows following the pattern; the last row's spans are
 *  redistributed so the wall always ends flush. */
function buildRows(items: MediaItem[]) {
  const rows: Array<{ items: MediaItem[]; spans: number[]; height: string }> = [];
  let i = 0;
  let p = 0;
  while (i < items.length) {
    const { spans, height } = PATTERN[p % PATTERN.length];
    const remaining = items.length - i;
    if (remaining < spans.length) {
      const fill = remaining === 1 ? [12] : remaining === 2 ? [6, 6] : [4, 4, 4];
      rows.push({ items: items.slice(i), spans: fill, height: remaining === 1 ? PATTERN[0].height : "h-[240px] md:h-[400px]" });
      break;
    }
    rows.push({ items: items.slice(i, i + spans.length), spans, height });
    i += spans.length;
    p += 1;
  }
  return rows;
}

export default function MediaGallery({ items }: { items: MediaItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const move = useCallback(
    (delta: number) => setOpen((c) => (c === null ? null : (c + delta + items.length) % items.length)),
    [items.length]
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

  if (!items.length) return null;

  const rows = buildRows(items);
  let idx = -1;

  return (
    <>
      <section className="px-1 pb-16 md:px-2">
        <div className="flex flex-col gap-1">
          {rows.map((row, r) => (
            <div key={r} className="grid grid-cols-12 gap-1">
              {row.items.map((item, c) => {
                idx += 1;
                const openIdx = idx;
                return (
                  <button
                    key={item._id}
                    onClick={() => setOpen(openIdx)}
                    className={`img-live group relative block w-full overflow-hidden text-left ${SPAN_CLASS[row.spans[c]] ?? "col-span-6"} ${row.height}`}
                    aria-label={item.caption ? `Expand: ${item.caption}` : "Expand photo"}
                  >
                    <Image
                      src={urlFor(item.image).width(1800).url()}
                      alt={item.alt || item.caption || ""}
                      fill
                      className="object-cover"
                      sizes={row.spans[c] >= 12 ? "100vw" : `${Math.round((row.spans[c] / 12) * 100)}vw`}
                    />
                    {item.caption && (
                      <span
                        className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{ background: "linear-gradient(180deg, rgba(20,26,18,0) 30%, rgba(20,26,18,0.7) 100%)" }}
                      >
                        <span className="text-[13px] leading-snug text-[#f0ead6]">{item.caption}</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* ——— Lightbox ————————————————————————————————————— */}
      {open !== null && items[open] && (
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
              src={urlFor(items[open].image).width(2400).url()}
              alt={items[open].alt || items[open].caption || ""}
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
              {items[open].caption}
              <span className="ml-3 text-[#f0ead6]/50">{open + 1} / {items.length}</span>
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
