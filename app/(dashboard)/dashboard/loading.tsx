/* ─────────────────────────────────────────────────────────────────────
   Dashboard Loading Skeleton — TODO §11
   Displays a centered spinner/skeleton while auth and data load.
   ───────────────────────────────────────────────────────────────────── */

export default function DashboardLoading() {
  return (
    <div className="min-h-[60vh] animate-pulse">
      <div className="mx-auto max-w-container px-3u py-8u">
        {/* ── Overview cards skeleton ── */}
        <div className="mb-6u grid grid-cols-2 gap-4u md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-card bg-neutral-gray/20 p-4u">
              <div className="h-4 w-2/3 rounded bg-neutral-gray/40" />
              <div className="mt-2u h-8 w-1/2 rounded bg-neutral-gray/50" />
            </div>
          ))}
        </div>

        {/* ── Table skeleton ── */}
        <div className="space-y-3">
          <div className="h-7 w-48 rounded bg-neutral-gray/40" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4u rounded-lg border border-neutral-gray/20 p-3u"
            >
              <div className="h-5 w-32 rounded bg-neutral-gray/30" />
              <div className="h-5 flex-1 rounded bg-neutral-gray/20" />
              <div className="h-5 w-20 rounded bg-neutral-gray/30" />
              <div className="h-8 w-20 rounded-button bg-neutral-gray/20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
