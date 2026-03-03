'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Radio, Square, AlertTriangle, Trash2 } from 'lucide-react';
import type { DashboardSession } from '@/hooks/useCreatorDashboard';

/* ─────────────────────────────────────────────────────
   SessionActions — TODO §8.6
   Quick action confirmation dialogs:
   • Go Live  (scheduled → live)
   • End Session (live → ended)
   • Delete session
   ───────────────────────────────────────────────────── */

// ── Go Live Confirmation ──

export interface GoLiveDialogProps {
  session: DashboardSession | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function GoLiveDialog({
  session,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: GoLiveDialogProps) {
  if (!session) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Go Live Now?" size="sm">
      <div className="px-6 py-5 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/10 shrink-0">
            <Radio className="h-5 w-5 text-deep-navy" />
          </div>
          <div>
            <p className="text-sm text-charcoal">
              Start broadcasting <strong className="text-deep-navy">{session.title}</strong>?
            </p>
            <p className="text-xs text-charcoal/50 mt-1">
              Your session will appear as live on the platform immediately.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button variant="primary" size="md" onClick={onConfirm} isLoading={isLoading} fullWidth>
            <Radio className="h-4 w-4" aria-hidden />
            Go Live
          </Button>
          <Button variant="secondary" size="md" onClick={onClose} fullWidth disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ── End Session Confirmation ──

export interface EndSessionDialogProps {
  session: DashboardSession | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function EndSessionDialog({
  session,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: EndSessionDialogProps) {
  if (!session) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="End Session?" size="sm">
      <div className="px-6 py-5 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-live-indicator/10 shrink-0">
            <Square className="h-5 w-5 text-live-indicator" />
          </div>
          <div>
            <p className="text-sm text-charcoal">
              End <strong className="text-deep-navy">{session.title}</strong>?
            </p>
            <p className="text-xs text-charcoal/50 mt-1">
              The session will be moved to your past sessions list. This cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button variant="danger" size="md" onClick={onConfirm} isLoading={isLoading} fullWidth>
            <Square className="h-4 w-4" aria-hidden />
            End Session
          </Button>
          <Button variant="secondary" size="md" onClick={onClose} fullWidth disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ── Delete Session Confirmation ──

export interface DeleteSessionDialogProps {
  session: DashboardSession | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteSessionDialog({
  session,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteSessionDialogProps) {
  if (!session) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Session?" size="sm">
      <div className="px-6 py-5 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-charcoal">
              Permanently delete <strong className="text-deep-navy">{session.title}</strong>?
            </p>
            <p className="text-xs text-charcoal/50 mt-1">
              This action cannot be undone. The session will be permanently removed.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button variant="danger" size="md" onClick={onConfirm} isLoading={isLoading} fullWidth>
            <Trash2 className="h-4 w-4" aria-hidden />
            Delete
          </Button>
          <Button variant="secondary" size="md" onClick={onClose} fullWidth disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
