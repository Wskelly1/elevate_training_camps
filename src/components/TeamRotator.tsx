"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
/** A team member as displayed by the rotator (name, role, bio, photo). */
export type TeamIntroduction = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

/**
 * TeamRotator — rotational team showcase (owner request 2026-07-31:
 * "a flywheel or some sort of rotational component").
 *
 * A stacked photo deck: inactive photos sit behind the active one, each
 * fanned at its own slight angle; advancing rotates the next card upright
 * to the top while the rest settle deeper into the fan. Copy crossfades
 * alongside. Pure CSS transitions — no animation library — and rotation
 * angles are a fixed per-index pattern so server and client render
 * identically. Auto-advances unless the visitor prefers reduced motion;
 * any manual navigation stops the auto-advance.
 */

const FAN_ANGLES = [-7, 6, -4, 8, -6, 5];
const AUTO_ADVANCE_MS = 6000;

export default function TeamRotator({ introductions }: { introductions: TeamIntroduction[] }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const count = introductions.length;

  const advance = useCallback(
    (delta: number) => setActive((c) => (c + delta + count) % count),
    [count]
  );

  useEffect(() => {
    if (!auto || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => advance(1), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [auto, count, advance]);

  const manual = (delta: number) => {
    setAuto(false);
    advance(delta);
  };

  if (count === 0) return null;

  return (
    <div className="mt-12 grid items-center gap-12 md:grid-cols-12 md:gap-16">
      {/* ——— Photo deck ————————————————————————————————— */}
      <div className="md:col-span-5">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
          {introductions.map((member, i) => {
            const isActive = i === active;
            // Depth = distance behind the active card, wrapping.
            const depth = (i - active + count) % count;
            return (
              <div
                key={member.name}
                className="absolute inset-0 overflow-hidden rounded-lg shadow-lg transition-all duration-700 ease-in-out"
                style={{
                  transform: isActive
                    ? "rotate(0deg) scale(1)"
                    : `rotate(${FAN_ANGLES[i % FAN_ANGLES.length]}deg) scale(0.94)`,
                  zIndex: count - depth,
                  opacity: depth > 2 ? 0 : 1,
                }}
              >
                <Image
                  src={member.src}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 40vw"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ——— Copy ———————————————————————————————————————— */}
      <div className="md:col-span-7">
        <div key={active} className="animate-[fadeIn_500ms_ease-in-out]">
          <h3 className="text-[2rem] leading-snug md:text-[2.5rem]">
            {introductions[active].name}
          </h3>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--accent-rock)]">
            {introductions[active].designation}
          </p>
          {introductions[active].quote && (
            <p className="mt-6 max-w-[56ch] text-[17px] leading-[1.75] text-[#4a4a4a]">
              {introductions[active].quote}
            </p>
          )}
        </div>

        {count > 1 && (
          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={() => manual(-1)}
              aria-label="Previous team member"
              className="rounded-full border border-[var(--border)] p-2.5 text-[var(--primary)] transition hover:border-[var(--primary)] hover:bg-[var(--surface)]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => manual(1)}
              aria-label="Next team member"
              className="rounded-full border border-[var(--border)] p-2.5 text-[var(--primary)] transition hover:border-[var(--primary)] hover:bg-[var(--surface)]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="ml-2 text-sm text-[var(--muted-foreground)]">
              {active + 1} / {count}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
