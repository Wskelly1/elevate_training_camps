import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";

/**
 * Style Guide (internal) — revision 3. Checkpoint A1 is CLOSED.
 *
 * Records the decided brand system: consolidated palette, Red Rock + Trail
 * Brown accents, Instrument Serif as the display face, and the twin-peak
 * logo with cream-on-deep-green as the primary treatment. All of it is now
 * live in globals.css and BrandLogo.tsx — this page is the reference and
 * visual-regression surface, not a proposal.
 *
 * Not linked from any nav; noindexed.
 */

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", display: "swap" });

export const metadata: Metadata = {
  title: "Style Guide (internal) — Elevate Training Camps",
  robots: { index: false, follow: false },
};

// ——— Palette (decided) ————————————————————————————————————————————

const greens = [
  { token: "--primary", hex: "#427b4d", label: "Elevate Green", note: "Canonical brand green. Absorbs #3c6e45, #2E5631, #4a7f53." },
  { token: "--primary-hover", hex: "#33603c", label: "Green / hover", note: "REVISED — the old #387143 was only 4% darker and effectively invisible. This is 8.3% darker, a real state change." },
  { token: "--primary-deep", hex: "#24422a", label: "Green / deep", note: "Footers, dark overlays, logo backgrounds." },
];

const creams = [
  { token: "--background", hex: "#fbf9f3", label: "Cream / page", note: "Page background. Absorbs #f7f2e7, #f2f0eb." },
  { token: "--surface", hex: "#f0ead6", label: "Cream / surface", note: "Header, footer, cards. Absorbs #fff9eb, #e9e0d2." },
  { token: "--border", hex: "#d3c7b4", label: "Cream / border", note: "Borders and dividers. Absorbs #e6dfd3, #d1c3a1, #D6CBB4." },
];

const inks = [
  { token: "--foreground", hex: "#333333", label: "Ink", note: "Body text." },
  { token: "--muted-foreground", hex: "#755f4f", label: "Brown", note: "Secondary text, footer links." },
  { token: "--accent-brown", hex: "#583e2e", label: "Brown / deep", note: "Link hover." },
];

const accents = [
  { token: "--accent-rock", hex: "#b67d5e", label: "Red Rock", note: "Warm terracotta from the Flagstaff photography — the only genuine warm tone in the corpus. Large text, badges, UI accents (3.45:1 on white: AA large, not body copy).", },
  { token: "--accent-trail", hex: "#67563b", label: "Trail Brown", note: "Forest-floor brown, echoed across the Colorado ground tones. Safe for body text (7.07:1 on white: AAA-capable).", },
];

const typeScale = [
  { name: "Display", cls: "text-6xl", spec: "60px — page heroes", serif: true },
  { name: "H1", cls: "text-5xl", spec: "48px", serif: true },
  { name: "H2", cls: "text-4xl", spec: "36px — section headings", serif: true },
  { name: "H3", cls: "text-2xl", spec: "24px — card titles", serif: true },
  { name: "Body", cls: "text-base", spec: "16px / 1.5 — Geist Sans", serif: false },
  { name: "Small", cls: "text-sm", spec: "14px — metadata, footer", serif: false },
  { name: "Caption", cls: "text-xs uppercase tracking-[0.18em]", spec: "12px / uppercase / wide — labels, badges", serif: false },
];

// ——— Logo marks ———————————————————————————————————————————————————————

function MarkTwinPeak({ size = 96, color = "#427b4d" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} fill={color} aria-hidden="true">
      <path d="M100 16 L196 184 L140 184 L100 112 L60 184 L4 184 Z" />
      <path d="M100 132 L134 184 L66 184 Z" />
    </svg>
  );
}

function MarkSinglePeak({ size = 96, color = "#427b4d" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} fill={color} aria-hidden="true">
      <path d="M100 16 L196 184 L140 184 L100 112 L60 184 L4 184 Z" />
    </svg>
  );
}

function Wordmark({ fontClass, color, sub = "#755f4f", size = "text-5xl" }: { fontClass: string; color: string; sub?: string; size?: string }) {
  return (
    <div className="leading-none">
      <div className={`${fontClass} ${size} lowercase`} style={{ color }}>elevate</div>
      <div className="mt-1 text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: sub }}>Training Camps</div>
    </div>
  );
}

function Swatch({ hex, label, note, token }: { hex: string; label: string; note: string; token: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-16 w-16 shrink-0 rounded-lg border border-[#d3c7b4] shadow-sm" style={{ backgroundColor: hex }} />
      <div className="min-w-0">
        <p className="font-semibold text-[#333333]">
          {label} <span className="font-mono text-sm text-[#755f4f]">{hex}</span>
          <span className="ml-2 rounded bg-[#f0ead6] px-1.5 py-0.5 font-mono text-xs text-[#755f4f]">{token}</span>
        </p>
        <p className="text-sm text-[#755f4f]">{note}</p>
      </div>
    </div>
  );
}

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-[#fbf9f3] px-6 py-16 text-[#333333]">
      <div className="mx-auto max-w-4xl space-y-16">

        <header className="border-b border-[#d3c7b4] pb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-[#755f4f]">Internal · Checkpoint A1 CLOSED · revision 3</p>
          <h1 className={`${instrument.className} mt-3 text-5xl`}>Elevate Training Camps — Style Guide</h1>
          <p className="mt-4 max-w-2xl text-lg text-[#755f4f]">
            Checkpoint A1 is closed and every decision below is live on the site.
            Instrument Serif carries headings and navigation, the twin-peak mark is in
            the header, and the palette drives the CSS tokens in{" "}
            <code className="rounded bg-[#f0ead6] px-1">globals.css</code>. Change values
            there, not in components.
          </p>
        </header>

        {/* 1 — Palette */}
        <section className="space-y-6">
          <h2 className={`${instrument.className} text-4xl`}>1 · Palette</h2>

          <div className="rounded-xl border border-[#b67d5e] bg-[#b67d5e]/10 p-5">
            <p className="text-sm font-semibold">Fixed: green hover was indistinguishable</p>
            <div className="mt-4 flex flex-wrap items-center gap-8">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#755f4f]">Before — 4% apart</p>
                <div className="flex">
                  <div className="h-14 w-24" style={{ backgroundColor: "#427b4d" }} />
                  <div className="h-14 w-24" style={{ backgroundColor: "#387143" }} />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#755f4f]">After — 8.3% apart</p>
                <div className="flex">
                  <div className="h-14 w-24" style={{ backgroundColor: "#427b4d" }} />
                  <div className="h-14 w-24" style={{ backgroundColor: "#33603c" }} />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <button type="button" className="rounded-md bg-[#427b4d] px-5 py-2.5 text-sm font-semibold text-white">Rest</button>
                <button type="button" className="rounded-md bg-[#33603c] px-5 py-2.5 text-sm font-semibold text-white">Hover</button>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-[#d3c7b4] bg-white p-6">
            <h3 className={`${instrument.className} text-2xl`}>Greens</h3>
            {greens.map((s) => <Swatch key={s.hex} {...s} />)}
          </div>
          <div className="space-y-4 rounded-xl border border-[#d3c7b4] bg-white p-6">
            <h3 className={`${instrument.className} text-2xl`}>Cream ramp</h3>
            {creams.map((s) => <Swatch key={s.hex} {...s} />)}
          </div>
          <div className="space-y-4 rounded-xl border border-[#d3c7b4] bg-white p-6">
            <h3 className={`${instrument.className} text-2xl`}>Ink &amp; browns</h3>
            {inks.map((s) => <Swatch key={s.hex} {...s} />)}
          </div>
          <div className="space-y-4 rounded-xl border-2 border-[#427b4d] bg-white p-6">
            <h3 className={`${instrument.className} text-2xl`}>Accents — locked</h3>
            <p className="text-sm text-[#755f4f]">Alpine Sky, Haze Blue, Golden Trail and Summit Navy are dropped.</p>
            {accents.map((s) => <Swatch key={s.hex} {...s} />)}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button type="button" className="rounded-md bg-[#b67d5e] px-4 py-2 text-sm font-semibold text-white">Red Rock CTA</button>
              <span className="rounded-full border border-[#b67d5e] bg-[#f0ead6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#b67d5e]">Summer 2027</span>
              <span className="text-base" style={{ color: "#67563b" }}>Trail Brown body copy sits comfortably on cream.</span>
            </div>
          </div>
        </section>

        {/* 2 — Typography */}
        <section className="space-y-6">
          <h2 className={`${instrument.className} text-4xl`}>2 · Typography — <span className="text-[#427b4d]">DECIDED: Instrument Serif</span></h2>
          <p className="text-[#755f4f]">
            The Tracksmith direction means a serif for headlines — retro, editorial, a
            little characterful — with Geist Sans retained for body and UI. Two free
            candidates below; the same face should carry the logo wordmark, so this
            choice and the logo choice travel together.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border-2 border-[#d3c7b4] bg-white p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[#755f4f]">Not chosen</p>
              <h3 className="mt-1 font-sans text-3xl font-semibold">Fraunces</h3>
              <p className="mt-2 text-sm text-[#755f4f]">
                Old-style serif with deliberate &ldquo;wonk&rdquo; — soft, warm, a little
                weathered. Leans rustic and characterful.
              </p>
              <div className={`${instrument.className} mt-5 space-y-2`}>
                <p className="text-4xl">Run higher.</p>
                <p className="text-2xl">7,000 feet of thin air</p>
                <p className="text-lg italic">Flagstaff, Arizona</p>
              </div>
            </div>
            <div className="rounded-xl border-2 border-[#d3c7b4] bg-white p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[#427b4d]">CHOSEN — now live sitewide</p>
              <h3 className={`${instrument.className} mt-1 text-3xl`}>Instrument Serif</h3>
              <p className="mt-2 text-sm text-[#755f4f]">
                High-contrast editorial serif with sheared terminals — closest match to
                the wordmark in your inspiration image. Leans high-end and classy.
              </p>
              <div className={`${instrument.className} mt-5 space-y-2`}>
                <p className="text-4xl">Run higher.</p>
                <p className="text-2xl">7,000 feet of thin air</p>
                <p className="text-lg italic">Flagstaff, Arizona</p>
              </div>
            </div>
          </div>

          <div className="space-y-5 rounded-xl border border-[#d3c7b4] bg-white p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[#755f4f]">Scale (Instrument Serif headings + Geist Sans body)</p>
            {typeScale.map((t) => (
              <div key={t.name} className="flex flex-col gap-1 border-b border-[#f0ead6] pb-4 last:border-0 last:pb-0">
                <span className="text-xs uppercase tracking-[0.18em] text-[#755f4f]">{t.name} — {t.spec}</span>
                <span className={`${t.serif ? instrument.className : ""} ${t.cls}`}>Run higher. Race faster.</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3 — Logo */}
        <section className="space-y-6">
          <h2 className={`${instrument.className} text-4xl`}>3 · Logo — <span className="text-[#427b4d]">DECIDED: twin peak, cream on deep green</span></h2>
          <p className="text-[#755f4f]">
            Built from your inspiration: a peak mark that doubles as an{" "}
            <strong>A</strong>, a lowercase serif wordmark, and a spaced-out sans
            subtitle. Recoloured into the approved palette — the black background from
            the reference becomes deep green <span className="font-mono text-sm">#24422a</span>,
            which keeps the outdoors feel where black reads as fashion-brand.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border-2 border-[#d3c7b4] bg-white p-6 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-[#755f4f]">Mark A — Twin peak</p>
              <div className="my-6 flex justify-center"><MarkTwinPeak size={110} /></div>
              <p className="text-sm text-[#755f4f]">Two summits: the ascent plus the athlete climbing it. Closest to your reference.</p>
            </div>
            <div className="rounded-xl border-2 border-[#d3c7b4] bg-white p-6 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-[#755f4f]">Mark B — Single peak</p>
              <div className="my-6 flex justify-center"><MarkSinglePeak size={110} /></div>
              <p className="text-sm text-[#755f4f]">Cleaner chevron. Reads better at favicon size and on merch stitching.</p>
            </div>
          </div>

          <h3 className={`${instrument.className} pt-2 text-2xl`}>Lockups — wordmark in each serif</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[#d3c7b4] bg-[#f0ead6] p-8">
              <p className="mb-5 text-xs uppercase tracking-[0.18em] text-[#755f4f]">Horizontal · site header (live)</p>
              <div className="flex items-center gap-4">
                <MarkTwinPeak size={64} />
                <Wordmark fontClass={instrument.className} color="#427b4d" size="text-4xl" />
              </div>
            </div>
            <div className="rounded-xl border border-[#d3c7b4] bg-[#f0ead6] p-8">
              <p className="mb-5 text-xs uppercase tracking-[0.18em] text-[#755f4f]">Horizontal · alternate spacing</p>
              <div className="flex items-center gap-4">
                <MarkTwinPeak size={64} />
                <Wordmark fontClass={instrument.className} color="#427b4d" size="text-4xl" />
              </div>
            </div>
          </div>

          <h3 className={`${instrument.className} pt-2 text-2xl`}>Colour treatments</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center justify-center rounded-xl border border-[#d3c7b4] bg-[#24422a] p-8">
              <MarkTwinPeak size={72} color="#f0ead6" />
              <div className="mt-4 text-center">
                <Wordmark fontClass={instrument.className} color="#f0ead6" sub="#b6c4ae" size="text-3xl" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[#b6c4ae]">Cream on deep green</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-[#d3c7b4] bg-[#fbf9f3] p-8">
              <MarkTwinPeak size={72} color="#427b4d" />
              <div className="mt-4 text-center">
                <Wordmark fontClass={instrument.className} color="#24422a" size="text-3xl" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[#755f4f]">Green on cream</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-[#d3c7b4] bg-[#67563b] p-8">
              <MarkTwinPeak size={72} color="#f0ead6" />
              <div className="mt-4 text-center">
                <Wordmark fontClass={instrument.className} color="#f0ead6" sub="#d3c7b4" size="text-3xl" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[#d3c7b4]">Cream on Trail Brown</p>
            </div>
          </div>

          <h3 className={`${instrument.className} pt-2 text-2xl`}>Mark alone — favicon &amp; avatar</h3>
          <div className="flex flex-wrap items-end gap-6">
            {[64, 40, 32, 16].map((s) => (
              <div key={s} className="text-center">
                <div className="flex h-20 items-center justify-center rounded-lg bg-[#f0ead6] px-5">
                  <MarkTwinPeak size={s} />
                </div>
                <p className="mt-2 text-xs text-[#755f4f]">{s}px</p>
              </div>
            ))}
            <p className="max-w-xs text-sm text-[#755f4f]">
              If the twin peak muddies at 16px, Mark B is the favicon fallback — a
              normal pattern (full mark for large, simplified for small).
            </p>
          </div>
        </section>

        {/* 4 — References */}
        <section className="space-y-6">
          <h2 className={`${instrument.className} text-4xl`}>4 · Reference mapping</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-[#d3c7b4] bg-white p-6">
              <h3 className={`${instrument.className} text-2xl`}>The Kenya Experience → content &amp; pricing structure</h3>
              <p className="mt-2 text-sm text-[#755f4f]">
                Specifically the Young Athlete Camp page. Drives how Registration and camp
                pages are organised: camp-type segmentation, what-is-included breakdowns,
                dates calendar, all-levels-welcome framing. Applies in Phase 6 (real content).
              </p>
            </div>
            <div className="rounded-xl border border-[#d3c7b4] bg-white p-6">
              <h3 className={`${instrument.className} text-2xl`}>Under Canvas → homepage video</h3>
              <p className="mt-2 text-sm text-[#755f4f]">
                Full-bleed landscape video as the hero. The good news: this already exists —
                the Mux-backed scroll-expanding video on the homepage, editable from Sanity.
                The work is tuning it toward Under Canvas&apos;s calmer, more cinematic
                treatment rather than rebuilding it.
              </p>
            </div>
            <div className="rounded-xl border border-[#d3c7b4] bg-white p-6">
              <h3 className={`${instrument.className} text-2xl`}>Tracksmith → aesthetic, type, layout</h3>
              <p className="mt-2 text-sm text-[#755f4f]">
                The retro running-culture register: serif headlines, generous whitespace,
                photography-led editorial blocks, muted earth tones. This is what the serif
                decision above serves, and it drives layout rhythm from Phase 2 onward.
                Refined rustic — high-end and classy, but unmistakably outdoors.
              </p>
            </div>
          </div>
        </section>

        {/* 5 — Motion */}
        <section className="space-y-6">
          <h2 className={`${instrument.className} text-4xl`}>5 · Motion vocabulary</h2>
          <div className="space-y-4 rounded-xl border border-[#d3c7b4] bg-white p-6">
            <p>
              <strong>House style — cinematic scroll.</strong> Large media responds to
              scroll with weight and momentum rather than snapping.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-sm">
              <li><strong>Shared-layout transitions</strong> (<code className="rounded bg-[#f0ead6] px-1">layoutId</code>) for card to detail expansion.</li>
              <li><strong>Subtle 3D tilt on hover</strong> for interactive cards — rotation under 3°, scale under 1.02.</li>
              <li><strong>Flywheel motion</strong> (marquee, scroll-velocity, parallax galleries) reserved for the media page and testimonial strips — never body content.</li>
              <li><strong>Durations:</strong> micro-interactions 150–300ms; section reveals 500–700ms ease-out; nothing over 1s except scroll-driven sequences.</li>
              <li><strong>Accessibility:</strong> every animated component respects <code className="rounded bg-[#f0ead6] px-1">prefers-reduced-motion</code>.</li>
            </ul>
          </div>
        </section>

        <footer className="border-t border-[#d3c7b4] pt-6 text-sm text-[#755f4f]">
          Internal artifact — unlinked, noindexed. Approved values graduate to CSS tokens
          in <code className="rounded bg-[#f0ead6] px-1">globals.css</code> (Phase 2).
        </footer>
      </div>
    </div>
  );
}
