import Layout from "../../components/layout";

/**
 * MediaPage — placeholder until the real gallery ships (roadmap Phase 3).
 *
 * The previous placeholder listed invented items ("Coach's welcome speech
 * (2023)", "past camps") — fabricated history for a business whose first
 * season is 2027, which violates the no-track-record guardrail
 * (business-plan/WEBSITE-SYNC.md). This copy stays honest until the real
 * gallery is built from the ~200 staged photos in media-source/ (blocked on
 * Gates 3 and 4 — hosting decision and photo consent).
 */
export default function MediaPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-10 p-8 text-center">
        <h1 className="text-3xl mb-4">Media</h1>
        <p className="text-lg mb-6 text-[#4a4a4a]">
          The photo and film gallery is coming ahead of the 2027 season —
          Flagstaff&apos;s trails, the terrain teams train on, and the town
          they&apos;ll call home for a block.
        </p>
        <p className="text-[15px] text-[var(--muted-foreground)]">
          Want a feel for the training before then? The homepage carries
          current footage from Flagstaff.
        </p>
      </div>
    </Layout>
  );
}
