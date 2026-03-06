/* ─────────────────────────────────────────────────────────────────────
   All Categories Page Loading Skeleton — TODO §11
   Matches the page layout: header + 3-column card grid placeholders.
   ───────────────────────────────────────────────────────────────────── */

export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* ── Header skeleton ── */}
      <section className="bg-neutral-gray/40 py-6u">
        <div className="mx-auto max-w-container px-3u">
          <div className="mb-3u flex items-center gap-2">
            <div className="h-4 w-12 rounded bg-neutral-gray/50" />
            <div className="h-4 w-4 rounded bg-neutral-gray/30" />
            <div className="h-4 w-24 rounded bg-neutral-gray/50" />
          </div>
          <div className="mx-auto h-10 w-60 rounded bg-neutral-gray/50" />
          <div className="mx-auto mt-2u h-5 w-80 rounded bg-neutral-gray/30" />
        </div>
      </section>

      {/* ── Card grid skeleton ── */}
      <section className="mx-auto max-w-container px-3u py-8u">
        <div className="grid grid-cols-1 gap-4u sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[3/2] rounded-card bg-neutral-gray/50" />
          ))}
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={`ph-${i}`} className="aspect-[3/2] rounded-card bg-neutral-gray/30" />
          ))}
        </div>
      </section>
    </div>
  );
}
