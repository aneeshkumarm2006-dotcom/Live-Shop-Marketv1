'use client';

import React from 'react';
import { Heart, CalendarClock, Radio } from 'lucide-react';

/* ─────────────────────────────────────────────────────
   BuyerOverview — Summary stat cards for buyer dashboard
   Displays: total favorites, upcoming sessions, live now
   ───────────────────────────────────────────────────── */

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: string;
}

function StatCard({
  label,
  value,
  icon,
  accent = 'bg-neon-green/10 text-deep-navy',
}: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-card bg-white p-5u shadow-card">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-deep-navy">{value.toLocaleString()}</p>
        <p className="text-small text-charcoal/60">{label}</p>
      </div>
    </div>
  );
}

export interface BuyerOverviewProps {
  totalFavorites: number;
  upcomingSessionsCount: number;
  liveNowCount: number;
}

export default function BuyerOverview({
  totalFavorites,
  upcomingSessionsCount,
  liveNowCount,
}: BuyerOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Favorite Creators"
        value={totalFavorites}
        icon={<Heart className="h-6 w-6" />}
        accent="bg-favorite-heart/10 text-favorite-heart"
      />
      <StatCard
        label="Live Now"
        value={liveNowCount}
        icon={<Radio className="h-6 w-6" />}
        accent="bg-live-indicator/10 text-live-indicator"
      />
      <StatCard
        label="Upcoming Sessions"
        value={upcomingSessionsCount}
        icon={<CalendarClock className="h-6 w-6" />}
        accent="bg-blue-500/10 text-blue-600"
      />
    </div>
  );
}
