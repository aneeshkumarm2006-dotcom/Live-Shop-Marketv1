/* ─────────────────────────────────────────────────────────────────────
   Creator Profile Page Loading Skeleton — TODO §11
   Banner, avatar, bio, upcoming table, and previous streams grid.
   ───────────────────────────────────────────────────────────────────── */

export default function CreatorProfileLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* ── Banner skeleton ── */}
      <div className="bg-neutral-gray/20">
        <div className="mx-auto aspect-[16/4] max-w-container bg-neutral-gray/50" />

        {/* ── Profile info row ── */}
        <div className="mx-auto max-w-container px-3u">
          <div className="flex flex-col items-start gap-4u md:flex-row md:items-end -mt-[60px] relative z-10">
            {/* Avatar skeleton */}
            <div className="h-[120px] w-[120px] flex-shrink-0 rounded-full border-4 border-white bg-neutral-gray/60" />

            {/* Name & meta skeleton */}
            <div className="flex flex-1 flex-col gap-2 pb-4u">
              <div className="h-10 w-56 rounded bg-neutral-gray/50" />
              <div className="flex gap-3">
                <div className="h-5 w-24 rounded-full bg-neutral-gray/30" />
                <div className="h-5 w-20 rounded bg-neutral-gray/30" />
              </div>
            </div>

            {/* Favorite button skeleton */}
            <div className="h-10 w-36 rounded-button bg-neutral-gray/40" />
          </div>
        </div>
      </div>

      {/* ── Breadcrumb skeleton ── */}
      <div className="mx-auto max-w-container px-3u pt-4u">
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 rounded bg-neutral-gray/40" />
          <div className="h-4 w-4 rounded bg-neutral-gray/20" />
          <div className="h-4 w-20 rounded bg-neutral-gray/40" />
          <div className="h-4 w-4 rounded bg-neutral-gray/20" />
          <div className="h-4 w-32 rounded bg-neutral-gray/40" />
        </div>
      </div>

      {/* ── Bio skeleton ── */}
      <div className="mx-auto max-w-container px-3u py-6u">
        <div className="space-y-2u">
          <div className="h-4 w-full rounded bg-neutral-gray/30" />
          <div className="h-4 w-5/6 rounded bg-neutral-gray/30" />
          <div className="h-4 w-2/3 rounded bg-neutral-gray/30" />
        </div>
        <div className="mt-4u flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-8 rounded-full bg-neutral-gray/40" />
          ))}
        </div>
      </div>

      {/* ── Upcoming streams skeleton ── */}
      <div className="mx-auto max-w-container px-3u py-4u">
        <div className="mb-3u h-7 w-48 rounded bg-neutral-gray/40" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4u rounded-lg border border-neutral-gray/30 p-3u"
            >
              <div className="h-5 w-24 rounded bg-neutral-gray/30" />
              <div className="h-5 w-16 rounded bg-neutral-gray/30" />
              <div className="h-5 flex-1 rounded bg-neutral-gray/40" />
              <div className="h-8 w-24 rounded-button bg-neutral-gray/30" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Previous streams skeleton ── */}
      <div className="mx-auto max-w-container px-3u py-4u">
        <div className="mb-3u h-7 w-40 rounded bg-neutral-gray/40" />
        <div className="flex gap-3u overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <div className="h-36 w-60 rounded-card bg-neutral-gray/50" />
              <div className="mt-2 h-4 w-40 rounded bg-neutral-gray/30" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
