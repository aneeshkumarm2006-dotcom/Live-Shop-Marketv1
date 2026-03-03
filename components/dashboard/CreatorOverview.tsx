'use client';

import React from 'react';
import { Users, Radio, CalendarClock, ArchiveRestore } from 'lucide-react';
import type { DashboardStats } from '@/hooks/useCreatorDashboard';

/* ─────────────────────────────────────────────────────
   CreatorOverview — Summary stat cards (TODO §8.6)
   Displays: total followers, live now, scheduled, past
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

export interface CreatorOverviewProps {
  stats: DashboardStats;
}

export default function CreatorOverview({ stats }: CreatorOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Followers"
        value={stats.followerCount}
        icon={<Users className="h-6 w-6" />}
        accent="bg-neon-green/10 text-deep-navy"
      />
      <StatCard
        label="Live Now"
        value={stats.liveCount}
        icon={<Radio className="h-6 w-6" />}
        accent="bg-live-indicator/10 text-live-indicator"
      />
      <StatCard
        label="Scheduled"
        value={stats.scheduledCount}
        icon={<CalendarClock className="h-6 w-6" />}
        accent="bg-blue-500/10 text-blue-600"
      />
      <StatCard
        label="Past Sessions"
        value={stats.pastCount}
        icon={<ArchiveRestore className="h-6 w-6" />}
        accent="bg-neutral-gray/30 text-charcoal"
      />
    </div>
  );
}
