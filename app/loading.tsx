/* ─────────────────────────────────────────────────────────────────────
   Homepage Loading Skeleton — TODO §11
   Shows hero skeleton + category row placeholders while SSR data loads.
   ───────────────────────────────────────────────────────────────────── */

export default function HomeLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      {/* ── Hero skeleton ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2563EB]/60 via-[#1A1A6E]/40 to-[#06B6D4]/60">
        <div className="mx-auto flex max-w-container flex-col items-center px-3u py-16 text-center sm:py-20 lg:py-28">
          <div className="mb-4u h-8 w-48 rounded-full bg-white/10" />
          <div className="h-16 w-80 rounded-lg bg-white/15 sm:w-[400px]" />
          <div className="mt-3u h-6 w-64 rounded bg-white/10" />
          <div className="mt-6u h-12 w-full max-w-xl rounded-search bg-white/20" />
        </div>
      </section>

      {/* ── Featured sessions skeleton ── */}
      <section className="py-6u">
        <div className="mx-auto max-w-container px-3u">
          <div className="mb-4u h-8 w-56 rounded bg-neutral-gray/50" />
          <div className="grid gap-3u sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-card bg-white shadow-card">
                <div className="aspect-video w-full bg-neutral-gray/60" />
                <div className="space-y-2u p-3u">
                  <div className="h-5 w-3/4 rounded bg-neutral-gray/50" />
                  <div className="h-4 w-1/2 rounded bg-neutral-gray/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category row skeletons ── */}
      {Array.from({ length: 3 }).map((_, i) => (
        <section key={i} className="py-6u">
          <div className="mx-auto max-w-container px-3u">
            <div className="mb-3u h-7 w-40 rounded bg-neutral-gray/50" />
            <div className="flex gap-3u overflow-hidden">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex flex-shrink-0 flex-col items-center gap-2u">
                  <div className="h-32 w-32 rounded-card-sm bg-neutral-gray/50" />
                  <div className="h-4 w-24 rounded bg-neutral-gray/30" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
