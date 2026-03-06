/* ─────────────────────────────────────────────────────────────────────
   Single Category Page Loading Skeleton — TODO §11
   Hero banner skeleton + filter bar + brand grid placeholders.
   ───────────────────────────────────────────────────────────────────── */

export default function CategorySlugLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* ── Hero banner skeleton ── */}
      <div className="relative h-60 w-full bg-neutral-gray/50">
        <div className="mx-auto flex h-full max-w-container flex-col items-center justify-center px-3u">
          <div className="h-9 w-64 rounded bg-white/20" />
          <div className="mt-2u h-5 w-48 rounded bg-white/10" />
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="mx-auto max-w-container px-3u py-6u">
        {/* Breadcrumb skeleton */}
        <div className="mb-4u flex items-center gap-2">
          <div className="h-4 w-12 rounded bg-neutral-gray/40" />
          <div className="h-4 w-4 rounded bg-neutral-gray/20" />
          <div className="h-4 w-20 rounded bg-neutral-gray/40" />
          <div className="h-4 w-4 rounded bg-neutral-gray/20" />
          <div className="h-4 w-28 rounded bg-neutral-gray/40" />
        </div>

        {/* Filter bar skeleton */}
        <div className="flex items-center justify-between gap-3u">
          <div className="h-10 w-44 rounded-button bg-neutral-gray/40" />
          <div className="flex items-center gap-2u">
            <div className="h-10 w-64 rounded-search bg-neutral-gray/30" />
            <div className="h-10 w-10 rounded-full bg-neutral-gray/30" />
          </div>
        </div>

        {/* Live streams skeleton */}
        <div className="mt-6u">
          <div className="mb-3u h-7 w-32 rounded bg-neutral-gray/40" />
          <div className="grid gap-3u sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-card bg-white shadow-card">
                <div className="aspect-video w-full bg-neutral-gray/50" />
                <div className="space-y-2u p-3u">
                  <div className="h-5 w-3/4 rounded bg-neutral-gray/40" />
                  <div className="h-4 w-1/2 rounded bg-neutral-gray/20" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand grid skeleton */}
        <div className="mt-6u">
          <div className="mb-3u h-7 w-24 rounded bg-neutral-gray/40" />
          <div className="grid grid-cols-2 gap-4u sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2u">
                <div className="aspect-square w-full rounded-card-sm bg-neutral-gray/50" />
                <div className="h-4 w-2/3 rounded bg-neutral-gray/30" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
