/**
 * Shared bits for the /mockups/* aesthetic explorations (2026-07-31).
 *
 * These routes exist so the owner can compare three "refined rustic"
 * directions live in dev before one is applied site-wide. They are
 * self-contained (own mini-nav, static sample copy, real CDN images),
 * noindexed, and NOT wired to the CMS — the no-copy-fallback rule governs
 * production pages, not throwaway mockups (same precedent as the A2.5a
 * /mockup route). Delete the folder once a direction ships.
 */

export const CDN = "https://cdn.sanity.io/images/yvqe54iq/production";

export const IMG = {
  trackPortrait: `${CDN}/c48d0605d78850ce8f379d5e09aea8f5587b867d-1638x2048.jpg`,
  packLandscape: `${CDN}/2edafd98ea58992f2bdd7f8c1dfe6b6a1cb82bee-2048x1638.jpg`,
  meadow: `${CDN}/c812e9558eae8f13b75717fdcc1793514d0f5447-2304x1536.jpg`,
  overlookPortrait: `${CDN}/ffe20f9d3e17205e12d505389c73a20560808315-1536x2304.jpg`,
  dusk: `${CDN}/c04f251b4a7a0edb29ab0e160a410cca724c49fc-2304x1536.jpg`,
  sawmillPortrait: `${CDN}/3861b137fa69d93145d8491ca683dc66362b1f3a-1536x2304.jpg`,
  stormFairway: `${CDN}/0d6a2fc2db5ed9fa2b689d564aa6803eb85994aa-2304x1536.jpg`,
  runnersTrail: `${CDN}/3232ca8cf5c84a311f49a525e1e447b89429e670-1536x2304.jpg`,
};

export const COPY = {
  eyebrow: "About Elevate",
  heading: "About Elevate Training Camps",
  intro:
    "Discover the story behind our commitment to excellence in high-altitude training. We're dedicated to helping teams get the most from a summer at altitude, on Flagstaff's trail network in the heart of northern Arizona.",
  chips: ["First season: Summer 2027", "Flagstaff, Arizona", "7,000 ft Elevation"],
  story: {
    title: "Our Story",
    body: "What began as two runners' summers in the high country is becoming a place for teams to do the same thing, properly: a multi-week altitude block on Flagstaff's trails, with the logistics handled and the program built around the coach who brings the squad.",
  },
  team: [
    { name: "Will Skelly", role: "Co-founder", img: "trackPortrait" as const },
    { name: "William Sacay", role: "Co-founder", img: "overlookPortrait" as const },
  ],
  navItems: ["About", "Recruiting", "Registration", "Media", "FAQ", "Contact Us"],
};
