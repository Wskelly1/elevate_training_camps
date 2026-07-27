import type { Metadata } from "next";

/**
 * Style Guide (internal) — Checkpoint A1 review artifact.
 *
 * Renders the PROPOSED brand system for owner review: canonical green
 * consolidation, cream ramp, every photo-derived accent candidate with
 * provenance and contrast data, the typography scale, and the motion
 * vocabulary. Not linked from any nav and noindexed. Once approved, the
 * values here become the real CSS tokens in globals.css (Phase 2) and this
 * page switches to rendering those tokens directly, becoming a permanent
 * visual-regression reference.
 */

export const metadata: Metadata = {
  title: "Style Guide (internal) — Elevate Training Camps",
  robots: { index: false, follow: false },
};

// ——— Proposed core palette ———————————————————————————————————————————

const greens = [
  { token: "--primary", hex: "#427b4d", label: "Elevate Green", note: "The canonical brand green (already 50× dominant in the codebase). Replaces #3c6e45, #2E5631 and #4a7f53 wherever they appear." },
  { token: "--primary-hover", hex: "#387143", label: "Green / hover", note: "Pressed & hover state (kept from current usage)." },
  { token: "--primary-deep", hex: "#2e5631", label: "Green / deep", note: "Dark green for footers/overlays on light photography." },
];

const creams = [
  { token: "--background", hex: "#fbf9f3", label: "Cream / page", note: "Main page background. Absorbs #f7f2e7, #f2f0eb." },
  { token: "--surface", hex: "#f0ead6", label: "Cream / surface", note: "Header, footer, cards. Absorbs #fff9eb, #e9e0d2." },
  { token: "--border", hex: "#d3c7b4", label: "Cream / border", note: "Borders & dividers. Absorbs #e6dfd3, #d1c3a1, #D6CBB4." },
];

const browns = [
  { token: "--foreground", hex: "#333333", label: "Ink", note: "Body text." },
  { token: "--muted-foreground", hex: "#755f4f", label: "Brown", note: "Secondary text, footer links (existing)." },
  { token: "--accent-brown", hex: "#583e2e", label: "Brown / deep", note: "Link hover (existing)." },
];

// ——— Photo-derived accent candidates (all rendered for the A1 decision) ——

const accentCandidates = [
  {
    name: "Alpine Sky", hex: "#5b7ba9",
    provenance: "The deepest recurring sky tone — ~10 Colorado photos",
    white: "4.33:1", cream: "4.11:1",
    verdict: "Strongest cool complement. Passes WCAG AA for large text & UI.",
  },
  {
    name: "Haze Blue", hex: "#a8bcd7",
    provenance: "The most common sky rendering — 15+ Colorado photos",
    white: "1.94:1", cream: "1.84:1",
    verdict: "Section tints and backgrounds only — never text.",
  },
  {
    name: "Golden Trail", hex: "#bf9f74",
    provenance: "Sunlit dirt road / golden light — 49 Colorado photos",
    white: "2.49:1", cream: "2.37:1",
    verdict: "Decorative fills, badges, image overlays — not text.",
  },
  {
    name: "Red Rock", hex: "#b67d5e",
    provenance: "Flagstaff terracotta/bark — the warmest tone in the corpus",
    white: "3.45:1", cream: "3.28:1",
    verdict: "AA large-text/UI warm accent. Closest thing to a sunrise orange that actually exists in the photos.",
  },
  {
    name: "Trail Brown", hex: "#67563b",
    provenance: "Flagstaff forest floor; echoed across Colorado ground tones",
    white: "7.07:1", cream: "6.71:1",
    verdict: "AAA-capable text accent; the safest earthy pick.",
  },
  {
    name: "Summit Navy", hex: "#2e3877",
    provenance: "Athlete apparel in three photos (not landscape)",
    white: "10.78:1", cream: "10.24:1",
    verdict: "Very high contrast dark accent — but apparel-derived, not landscape.",
  },
];

// ——— Typography scale proposal ————————————————————————————————————————

const typeScale = [
  { name: "Display", cls: "text-6xl font-bold tracking-tight", spec: "60px / bold / tight — page heroes only" },
  { name: "H1", cls: "text-5xl font-bold", spec: "48px / bold" },
  { name: "H2", cls: "text-4xl font-bold", spec: "36px / bold — section headings" },
  { name: "H3", cls: "text-2xl font-semibold", spec: "24px / semibold — card titles" },
  { name: "H4", cls: "text-xl font-semibold", spec: "20px / semibold" },
  { name: "Body", cls: "text-base", spec: "16px / regular / 1.5 line-height" },
  { name: "Small", cls: "text-sm", spec: "14px — metadata, footer" },
  { name: "Caption", cls: "text-xs uppercase tracking-wide", spec: "12px / uppercase / wide tracking — labels, badges" },
];

function Swatch({ hex, label, note, token }: { hex: string; label: string; note: string; token?: string }) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="h-16 w-16 shrink-0 rounded-lg border border-[#d3c7b4] shadow-sm"
        style={{ backgroundColor: hex }}
      />
      <div className="min-w-0">
        <p className="font-semibold text-[#333333]">
          {label} <span className="font-mono text-sm text-[#755f4f]">{hex}</span>
          {token && <span className="ml-2 rounded bg-[#f0ead6] px-1.5 py-0.5 font-mono text-xs text-[#755f4f]">{token}</span>}
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
        {/* Header */}
        <header className="border-b border-[#d3c7b4] pb-8">
          <p className="text-xs uppercase tracking-wide text-[#755f4f]">Internal · Checkpoint A1 review artifact</p>
          <h1 className="mt-2 text-5xl font-bold">Elevate Training Camps — Style Guide</h1>
          <p className="mt-4 max-w-2xl text-lg text-[#755f4f]">
            The proposed brand system: a consolidated palette grounded in the real camp
            photography, a typography scale, and the motion vocabulary. Nothing here is
            final until approved — accent candidates are shown in full so the keepers
            can be chosen from rendered color, not hex codes.
          </p>
        </header>

        {/* Core palette */}
        <section className="space-y-6">
          <h2 className="text-4xl font-bold">1 · Core palette (consolidation)</h2>
          <p className="text-[#755f4f]">
            Today the codebase carries <strong>4 competing greens</strong> and{" "}
            <strong>9 near-identical creams</strong>. Proposal: collapse to the sets below.
          </p>
          <div className="grid gap-6 sm:grid-cols-1">
            <div className="space-y-4 rounded-xl border border-[#d3c7b4] bg-white p-6">
              <h3 className="text-2xl font-semibold">Greens</h3>
              {greens.map((s) => <Swatch key={s.hex} {...s} />)}
            </div>
            <div className="space-y-4 rounded-xl border border-[#d3c7b4] bg-white p-6">
              <h3 className="text-2xl font-semibold">Cream ramp</h3>
              {creams.map((s) => <Swatch key={s.hex} {...s} />)}
            </div>
            <div className="space-y-4 rounded-xl border border-[#d3c7b4] bg-white p-6">
              <h3 className="text-2xl font-semibold">Ink &amp; browns</h3>
              {browns.map((s) => <Swatch key={s.hex} {...s} />)}
            </div>
          </div>
        </section>

        {/* Accent candidates */}
        <section className="space-y-6">
          <h2 className="text-4xl font-bold">2 · Accent candidates (pick 1–2)</h2>
          <p className="text-[#755f4f]">
            All six were extracted from the 194 real camp photos — nothing invented.
            Each card shows the color as a large field, as a button, as a badge on cream,
            and its measured WCAG contrast. Note: no true sunrise-orange exists anywhere
            in the photography; Red Rock is the warmest genuine tone.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {accentCandidates.map((a) => (
              <div key={a.hex} className="overflow-hidden rounded-xl border border-[#d3c7b4] bg-white">
                <div className="flex h-28 items-end p-4" style={{ backgroundColor: a.hex }}>
                  <span className="rounded bg-white/85 px-2 py-1 font-mono text-sm text-[#333333]">{a.hex}</span>
                </div>
                <div className="space-y-3 p-5">
                  <h3 className="text-2xl font-semibold">{a.name}</h3>
                  <p className="text-sm text-[#755f4f]">{a.provenance}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className="rounded-md px-4 py-2 text-sm font-semibold text-white"
                      style={{ backgroundColor: a.hex }}
                    >
                      Button
                    </button>
                    <span
                      className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                      style={{ color: a.hex, borderColor: a.hex, backgroundColor: "#f0ead6" }}
                    >
                      Badge
                    </span>
                    <span className="text-lg font-bold" style={{ color: a.hex }}>
                      Large text
                    </span>
                  </div>
                  <p className="text-xs text-[#755f4f]">
                    Contrast — on white: <strong>{a.white}</strong> · on cream: <strong>{a.cream}</strong>
                  </p>
                  <p className="text-sm">{a.verdict}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-4xl font-bold">3 · Typography scale</h2>
          <p className="text-[#755f4f]">
            Geist Sans stays (already loaded); this simply gives it a disciplined scale —
            today there are zero type tokens and every page improvises.
          </p>
          <div className="space-y-5 rounded-xl border border-[#d3c7b4] bg-white p-6">
            {typeScale.map((t) => (
              <div key={t.name} className="flex flex-col gap-1 border-b border-[#f0ead6] pb-4 last:border-0 last:pb-0">
                <span className="text-xs uppercase tracking-wide text-[#755f4f]">{t.name} — {t.spec}</span>
                <span className={t.cls}>Run higher. Race faster.</span>
              </div>
            ))}
          </div>
        </section>

        {/* Motion vocabulary */}
        <section className="space-y-6">
          <h2 className="text-4xl font-bold">4 · Motion vocabulary</h2>
          <div className="space-y-4 rounded-xl border border-[#d3c7b4] bg-white p-6 text-[#333333]">
            <p>
              <strong>House style — “cinematic scroll”:</strong> the homepage’s
              scroll-driven video expansion is the signature move; large media responds
              to scroll with weight and momentum rather than snapping.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-sm">
              <li><strong>Shared-layout transitions</strong> (framer-motion <code className="rounded bg-[#f0ead6] px-1">layoutId</code>) for card → detail expansion, as the testimonial modal already does.</li>
              <li><strong>Subtle 3D tilt on hover</strong> for interactive cards (≤3° rotation, scale ≤1.02) — already the testimonial-card behavior.</li>
              <li><strong>Continuous “flywheel” motion</strong> (marquee / scroll-velocity from Magic UI, parallax galleries from Aceternity) reserved for the media page and testimonial strips — never for body content.</li>
              <li><strong>Durations:</strong> micro-interactions 150–300ms; section reveals 500–700ms ease-out; nothing over 1s except scroll-driven sequences.</li>
              <li><strong>Accessibility:</strong> every animated component must respect <code className="rounded bg-[#f0ead6] px-1">prefers-reduced-motion</code> (globals.css already carries the global guard).</li>
            </ul>
          </div>
        </section>

        <footer className="border-t border-[#d3c7b4] pt-6 text-sm text-[#755f4f]">
          Internal artifact — not linked from navigation, noindexed. Approved values
          graduate to CSS tokens in <code className="rounded bg-[#f0ead6] px-1">globals.css</code> (Phase 2).
        </footer>
      </div>
    </div>
  );
}
