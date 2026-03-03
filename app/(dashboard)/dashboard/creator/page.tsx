'use client';

import React, { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import {
  useCreatorDashboard,
  creatorDashboardKeys,
  type DashboardSession,
} from '@/hooks/useCreatorDashboard';
import {
  useCreateSession,
  useUpdateSession,
  useDeleteSession,
  useUpdateSessionStatus,
} from '@/hooks';
import { useCategories } from '@/hooks';
import type { CreateSessionPayload } from '@/hooks';

import CreatorOverview from '@/components/dashboard/CreatorOverview';
import CreatorSessionsTable from '@/components/dashboard/CreatorSessionsTable';
import {
  GoLiveDialog,
  EndSessionDialog,
  DeleteSessionDialog,
} from '@/components/dashboard/SessionActions';
import AnalyticsPlaceholder from '@/components/dashboard/AnalyticsPlaceholder';
import SessionForm from '@/components/forms/SessionForm';
import type { CategoryOption } from '@/components/forms/SessionForm';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import type { CreateSessionInput } from '@/lib/validators';

/* ─────────────────────────────────────────────────────
   Creator Dashboard Page — TODO §8.6
   Routes: /dashboard/creator
   ───────────────────────────────────────────────────── */

export default function CreatorDashboardPage() {
  const { data: authSession, status: authStatus } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  // ── Pagination state ──
  const [pastPage, setPastPage] = useState(1);

  // ── Modals state ──
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editSession, setEditSession] = useState<DashboardSession | null>(null);
  const [goLiveSession, setGoLiveSession] = useState<DashboardSession | null>(null);
  const [endSession, setEndSession] = useState<DashboardSession | null>(null);
  const [deleteSession, setDeleteSession] = useState<DashboardSession | null>(null);
  const [serverError, setServerError] = useState('');

  // ── Data fetching ──
  const { data: dashboardData, isLoading, isError, error } = useCreatorDashboard({ pastPage });
  const { data: categoriesData } = useCategories();

  // ── Mutations ──
  const createMutation = useCreateSession();
  const deleteMutation = useDeleteSession();

  // For update/status, we pick the session id dynamically
  const updateMutation = useUpdateSession(editSession?._id ?? '');
  const goLiveMutation = useUpdateSessionStatus(goLiveSession?._id ?? '');
  const endMutation = useUpdateSessionStatus(endSession?._id ?? '');

  // ── Helpers ──
  const invalidateDashboard = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: creatorDashboardKeys.all });
  }, [queryClient]);

  // Extract categories for the form
  const categories: CategoryOption[] =
    (categoriesData?.data as Array<{ _id: string; name: string }> | undefined)?.map((c) => ({
      _id: c._id,
      name: c.name,
    })) ?? [];

  // ── Auth guard ──
  if (authStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" label="Loading dashboard…" />
      </div>
    );
  }

  if (authStatus === 'unauthenticated' || !authSession) {
    router.push('/');
    return null;
  }

  if ((authSession.user as { role?: string })?.role !== 'creator') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-section-heading font-bold text-deep-navy">Access Denied</h2>
        <p className="text-body text-charcoal/60">
          This dashboard is only available to creator accounts.
        </p>
        <Button onClick={() => router.push('/')}>Back to Home</Button>
      </div>
    );
  }

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" label="Loading dashboard…" />
      </div>
    );
  }

  // ── Error state ──
  if (isError || !dashboardData?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-section-heading font-bold text-deep-navy">Something went wrong</h2>
        <p className="text-body text-charcoal/60">
          {(error as Error)?.message ?? 'Failed to load dashboard data.'}
        </p>
        <Button onClick={() => invalidateDashboard()}>Retry</Button>
      </div>
    );
  }

  const { stats, liveSessions, scheduledSessions, pastSessions, pastPagination, creator } =
    dashboardData.data;

  // ── Handlers ──

  async function handleCreateSession(data: CreateSessionInput) {
    setServerError('');
    try {
      await createMutation.mutateAsync(data as unknown as CreateSessionPayload);
      setShowCreateModal(false);
      invalidateDashboard();
    } catch (err) {
      setServerError((err as Error).message || 'Failed to create session');
    }
  }

  async function handleEditSession(data: CreateSessionInput) {
    if (!editSession) return;
    setServerError('');
    try {
      await updateMutation.mutateAsync({
        title: data.title,
        description: data.description ?? undefined,
        externalUrl: data.externalUrl,
        platform: data.platform,
        thumbnailUrl: data.thumbnailUrl ?? undefined,
        categoryId: data.categoryId,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString() : undefined,
      });
      setEditSession(null);
      invalidateDashboard();
    } catch (err) {
      setServerError((err as Error).message || 'Failed to update session');
    }
  }

  async function handleGoLive() {
    if (!goLiveSession) return;
    try {
      await goLiveMutation.mutateAsync({ status: 'live' });
      setGoLiveSession(null);
      invalidateDashboard();
    } catch {
      // Error is handled by react-query
    }
  }

  async function handleEndSession() {
    if (!endSession) return;
    try {
      await endMutation.mutateAsync({ status: 'ended' });
      setEndSession(null);
      invalidateDashboard();
    } catch {
      // Error is handled by react-query
    }
  }

  async function handleDeleteSession() {
    if (!deleteSession) return;
    try {
      await deleteMutation.mutateAsync(deleteSession._id);
      setDeleteSession(null);
      invalidateDashboard();
    } catch {
      // Error is handled by react-query
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-page-title font-bold text-deep-navy">Creator Dashboard</h1>
          <p className="text-body text-charcoal/60 mt-1">Welcome back, {creator.displayName}</p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            setServerError('');
            setShowCreateModal(true);
          }}
        >
          <Plus className="h-5 w-5" aria-hidden />
          New Session
        </Button>
      </div>

      {/* ── Stats overview ── */}
      <CreatorOverview stats={stats} />

      {/* ── Sessions table ── */}
      <div>
        <h2 className="text-section-heading font-semibold text-deep-navy mb-4">My Sessions</h2>
        <CreatorSessionsTable
          liveSessions={liveSessions}
          scheduledSessions={scheduledSessions}
          pastSessions={pastSessions}
          pastPagination={pastPagination}
          onPastPageChange={setPastPage}
          onEdit={(session) => {
            setServerError('');
            setEditSession(session);
          }}
          onDelete={(session) => setDeleteSession(session)}
          onGoLive={(session) => setGoLiveSession(session)}
          onEndSession={(session) => setEndSession(session)}
        />
      </div>

      {/* ── Phase 2 analytics placeholder ── */}
      <AnalyticsPlaceholder />

      {/* ── Create session modal ── */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Session"
        size="lg"
      >
        <div className="px-6 pb-6">
          <SessionForm
            categories={categories}
            onSubmit={handleCreateSession}
            serverError={serverError}
            onCancel={() => setShowCreateModal(false)}
          />
        </div>
      </Modal>

      {/* ── Edit session modal ── */}
      <Modal
        isOpen={!!editSession}
        onClose={() => setEditSession(null)}
        title="Edit Session"
        size="lg"
      >
        <div className="px-6 pb-6">
          {editSession && (
            <SessionForm
              categories={categories}
              defaultValues={{
                title: editSession.title,
                description: editSession.description ?? undefined,
                externalUrl: editSession.externalUrl,
                platform: editSession.platform as CreateSessionInput['platform'],
                thumbnailUrl: editSession.thumbnailUrl ?? undefined,
                categoryId: editSession.categoryId?._id ?? '',
                status: editSession.status as CreateSessionInput['status'],
                scheduledAt: editSession.scheduledAt
                  ? new Date(editSession.scheduledAt)
                  : undefined,
              }}
              onSubmit={handleEditSession}
              serverError={serverError}
              onCancel={() => setEditSession(null)}
              submitLabel="Save Changes"
            />
          )}
        </div>
      </Modal>

      {/* ── Quick action dialogs ── */}
      <GoLiveDialog
        session={goLiveSession}
        isOpen={!!goLiveSession}
        onClose={() => setGoLiveSession(null)}
        onConfirm={handleGoLive}
        isLoading={goLiveMutation.isPending}
      />

      <EndSessionDialog
        session={endSession}
        isOpen={!!endSession}
        onClose={() => setEndSession(null)}
        onConfirm={handleEndSession}
        isLoading={endMutation.isPending}
      />

      <DeleteSessionDialog
        session={deleteSession}
        isOpen={!!deleteSession}
        onClose={() => setDeleteSession(null)}
        onConfirm={handleDeleteSession}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
