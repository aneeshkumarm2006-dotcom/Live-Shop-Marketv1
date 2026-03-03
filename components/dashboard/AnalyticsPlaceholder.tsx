'use client';

import React from 'react';
import { BarChart3, TrendingUp, Eye, MousePointerClick } from 'lucide-react';

/* ─────────────────────────────────────────────────────
   AnalyticsPlaceholder — TODO §8.6 / 🔮 Phase 2
   Placeholder area for analytics charts and metrics.
   Will be replaced with real analytics in Phase 2.
   ───────────────────────────────────────────────────── */

export default function AnalyticsPlaceholder() {
  return (
    <div className="rounded-card bg-white shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-gray/20">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-deep-navy" />
          <h3 className="text-card-title font-semibold text-deep-navy">Analytics</h3>
        </div>
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          Coming Soon
        </span>
      </div>

      {/* Placeholder metrics row */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: <Eye className="h-5 w-5" />, label: 'Session Views', placeholder: '---' },
            {
              icon: <MousePointerClick className="h-5 w-5" />,
              label: 'Click-throughs',
              placeholder: '---',
            },
            {
              icon: <TrendingUp className="h-5 w-5" />,
              label: 'Follower Growth',
              placeholder: '---',
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="flex items-center gap-3 rounded-card-sm bg-neutral-50 p-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-gray/20 text-charcoal/30">
                {metric.icon}
              </div>
              <div>
                <p className="text-lg font-bold text-charcoal/30">{metric.placeholder}</p>
                <p className="text-xs text-charcoal/40">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder chart area */}
        <div className="relative rounded-card-sm bg-neutral-50 border-2 border-dashed border-neutral-gray/30 p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]">
          <BarChart3 className="h-12 w-12 text-charcoal/15" />
          <p className="text-sm text-charcoal/40 text-center max-w-sm">
            Detailed analytics including session views, click-through rates, follower growth charts,
            and promotional campaign performance will be available in Phase 2.
          </p>
        </div>
      </div>
    </div>
  );
}
