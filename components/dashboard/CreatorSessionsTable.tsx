'use client';

import React, { useState } from 'react';
import {
  Pencil,
  Trash2,
  Radio,
  Square,
  ExternalLink,
  Calendar,
  ArchiveRestore,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { DashboardSession, DashboardPagination } from '@/hooks/useCreatorDashboard';

/* ─────────────────────────────────────────────────────
   CreatorSessionsTable — TODO §8.6
   Tabbed table: "Live Now" · "Scheduled" · "Past"
   Each row: title, status, date, platform, actions.
   ───────────────────────────────────────────────────── */

type TabKey = 'live' | 'scheduled' | 'past';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'live', label: 'Live Now' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'past', label: 'Past' },
];

// ── Platform label map ──
const platformLabel: Record<string, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  other: 'Other',
};

// ── Date formatter helpers ──
function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(dateStr?: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

// ── Row component ──

interface SessionRowProps {
  session: DashboardSession;
  tab: TabKey;
  onEdit: (session: DashboardSession) => void;
  onDelete: (session: DashboardSession) => void;
  onGoLive: (session: DashboardSession) => void;
  onEndSession: (session: DashboardSession) => void;
}

function SessionRow({ session, tab, onEdit, onDelete, onGoLive, onEndSession }: SessionRowProps) {
  const dateField =
    tab === 'live'
      ? session.startedAt
      : tab === 'scheduled'
        ? session.scheduledAt
        : session.endedAt;

  return (
    <tr className="border-b border-neutral-gray/20 hover:bg-neutral-50 transition-colors">
      {/* Title + category */}
      <td className="py-3 px-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-deep-navy text-sm leading-tight">
            {session.title}
          </span>
          {session.categoryId && (
            <span className="text-xs text-charcoal/50">{session.categoryId.name}</span>
          )}
        </div>
      </td>

      {/* Status badge */}
      <td className="py-3 px-4">
        <Badge variant={session.status}>
          {session.status === 'live'
            ? 'LIVE'
            : session.status === 'scheduled'
              ? 'Scheduled'
              : 'Ended'}
        </Badge>
      </td>

      {/* Date */}
      <td className="py-3 px-4 text-sm text-charcoal">
        <div className="flex flex-col">
          <span>{formatDate(dateField)}</span>
          <span className="text-xs text-charcoal/50">{formatTime(dateField)}</span>
        </div>
      </td>

      {/* Platform */}
      <td className="py-3 px-4 text-sm text-charcoal">
        {platformLabel[session.platform] ?? session.platform}
      </td>

      {/* Actions */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          {/* Live tab: End Session */}
          {tab === 'live' && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onEndSession(session)}
              title="End session"
            >
              <Square className="h-3.5 w-3.5" aria-hidden />
              End
            </Button>
          )}

          {/* Scheduled tab: Go Live + Edit + Delete */}
          {tab === 'scheduled' && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onGoLive(session)}
                title="Go live now"
              >
                <Radio className="h-3.5 w-3.5" aria-hidden />
                Go Live
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(session)}
                title="Edit session"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(session)}
                title="Delete session"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </>
          )}

          {/* Past tab: view external link + delete */}
          {tab === 'past' && (
            <>
              <a
                href={session.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-button-secondary border border-neutral-gray px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-neutral-50 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                View
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(session)}
                title="Delete session"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── Pagination ──

interface PaginationProps {
  pagination: DashboardPagination;
  onPageChange: (page: number) => void;
}

function Pagination({ pagination, onPageChange }: PaginationProps) {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-gray/20">
      <p className="text-xs text-charcoal/60">
        Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!pagination.hasPrevPage}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// ── Empty state ──
function EmptyState({ tab }: { tab: TabKey }) {
  const messages: Record<TabKey, { icon: React.ReactNode; text: string }> = {
    live: {
      icon: <Radio className="h-10 w-10 text-charcoal/20" />,
      text: "You don't have any live sessions right now.",
    },
    scheduled: {
      icon: <Calendar className="h-10 w-10 text-charcoal/20" />,
      text: 'No upcoming sessions scheduled.',
    },
    past: {
      icon: <ArchiveRestore className="h-10 w-10 text-charcoal/20" />,
      text: 'No past sessions yet.',
    },
  };

  const msg = messages[tab];

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      {msg.icon}
      <p className="text-sm text-charcoal/50">{msg.text}</p>
    </div>
  );
}

// ── Main component ──

export interface CreatorSessionsTableProps {
  liveSessions: DashboardSession[];
  scheduledSessions: DashboardSession[];
  pastSessions: DashboardSession[];
  pastPagination: DashboardPagination;
  onPastPageChange: (page: number) => void;
  onEdit: (session: DashboardSession) => void;
  onDelete: (session: DashboardSession) => void;
  onGoLive: (session: DashboardSession) => void;
  onEndSession: (session: DashboardSession) => void;
}

export default function CreatorSessionsTable({
  liveSessions,
  scheduledSessions,
  pastSessions,
  pastPagination,
  onPastPageChange,
  onEdit,
  onDelete,
  onGoLive,
  onEndSession,
}: CreatorSessionsTableProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('live');

  const sessionMap: Record<TabKey, DashboardSession[]> = {
    live: liveSessions,
    scheduled: scheduledSessions,
    past: pastSessions,
  };

  const countMap: Record<TabKey, number> = {
    live: liveSessions.length,
    scheduled: scheduledSessions.length,
    past: pastPagination.total,
  };

  const currentSessions = sessionMap[activeTab];

  return (
    <div className="rounded-card bg-white shadow-card overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-neutral-gray/20">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={[
              'flex-1 py-3 px-4 text-sm font-semibold transition-colors text-center',
              activeTab === tab.key
                ? 'text-deep-navy border-b-2 border-neon-green bg-neon-green/5'
                : 'text-charcoal/50 hover:text-charcoal hover:bg-neutral-50',
            ].join(' ')}
          >
            {tab.label}
            {countMap[tab.key] > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-neutral-gray/30 px-2 py-0.5 text-xs">
                {countMap[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table or empty state */}
      {currentSessions.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <>
          {/* Desktop table (scrollable) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-gray/20 bg-neutral-50/50">
                  <th className="py-2.5 px-4 text-xs font-semibold text-charcoal/60 uppercase tracking-wide">
                    Session
                  </th>
                  <th className="py-2.5 px-4 text-xs font-semibold text-charcoal/60 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="py-2.5 px-4 text-xs font-semibold text-charcoal/60 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="py-2.5 px-4 text-xs font-semibold text-charcoal/60 uppercase tracking-wide">
                    Platform
                  </th>
                  <th className="py-2.5 px-4 text-xs font-semibold text-charcoal/60 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentSessions.map((session) => (
                  <SessionRow
                    key={session._id}
                    session={session}
                    tab={activeTab}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onGoLive={onGoLive}
                    onEndSession={onEndSession}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination (only for past tab) */}
          {activeTab === 'past' && (
            <Pagination pagination={pastPagination} onPageChange={onPastPageChange} />
          )}
        </>
      )}
    </div>
  );
}
