'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Plus } from 'lucide-react';
import { z } from 'zod';
import { createSessionSchema, type CreateSessionInput } from '@/lib/validators';
import { Input, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { Platform, SessionStatus } from '@/types';

type SessionFormValues = z.input<typeof createSessionSchema>;

/* ─────────────────────────────────────────────────
   SessionForm — TODO §8.6 / DESIGN.md §7.4
   Create or edit a live session. Uses createSessionSchema
   for new sessions; pre-populates for edits. Category
   list must be passed in so the component stays pure.
   ───────────────────────────────────────────────── */

// ── Platform display labels ──

const platformOptions: { value: Platform; label: string }[] = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'other', label: 'Other' },
];

const statusOptions: { value: SessionStatus; label: string }[] = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'live', label: 'Live Now' },
  { value: 'ended', label: 'Ended' },
];

// ── Category option type ──

export interface CategoryOption {
  _id: string;
  name: string;
}

export interface SessionFormProps {
  /** Called with validated session data */
  onSubmit: (data: CreateSessionInput) => Promise<void> | void;
  /** Available categories for the dropdown */
  categories: CategoryOption[];
  /** When provided the form enters "edit" mode and pre-fills fields */
  defaultValues?: Partial<CreateSessionInput>;
  /** External error (e.g. API failure) */
  serverError?: string;
  /** Cancel handler (e.g. close modal) */
  onCancel?: () => void;
  /** Custom submit label override */
  submitLabel?: string;
}

// Helper to format a Date to datetime-local string
function toDatetimeLocal(date: Date | string | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  // datetime-local expects YYYY-MM-DDTHH:mm
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function SessionForm({
  onSubmit,
  categories,
  defaultValues,
  serverError,
  onCancel,
  submitLabel,
}: SessionFormProps) {
  const isEditMode = Boolean(defaultValues);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SessionFormValues, unknown, CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      title: '',
      description: '',
      externalUrl: '',
      platform: 'youtube',
      thumbnailUrl: '',
      categoryId: '',
      status: 'scheduled',
      scheduledAt: undefined,
      ...defaultValues,
    },
  });

  const watchedStatus = watch('status');
  const watchedPlatform = watch('platform');

  // Focus the title field on mount
  useEffect(() => {
    const el = document.getElementById('session-title');
    el?.focus();
  }, []);

  const label = submitLabel ?? (isEditMode ? 'Save Changes' : 'Create Session');

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await onSubmit(data);
      })}
      noValidate
      className="flex flex-col gap-6"
    >
      {/* ── Server error ── */}
      {serverError && (
        <div
          className="rounded-card-sm bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {serverError}
        </div>
      )}

      {/* ── Title ── */}
      <Input
        id="session-title"
        label="Session Title"
        placeholder="e.g. Spring Fashion Haul"
        {...register('title')}
        error={errors.title?.message}
      />

      {/* ── Description ── */}
      <Textarea
        label="Description"
        placeholder="What will you be showcasing in this session?"
        rows={4}
        {...register('description')}
        error={errors.description?.message}
      />

      {/* ── Platform + External URL ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Platform select */}
        <div className="flex flex-col gap-1">
          <label htmlFor="session-platform" className="text-small font-medium text-charcoal">
            Platform
          </label>
          <select
            id="session-platform"
            {...register('platform')}
            className="w-full rounded-card-sm border border-neutral-gray bg-white py-2.5 px-4 text-body text-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green"
          >
            {platformOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.platform && (
            <p className="text-sm text-red-600" role="alert">
              {errors.platform.message}
            </p>
          )}
        </div>

        {/* External URL */}
        <Input
          label="Stream URL"
          type="url"
          placeholder={
            watchedPlatform === 'youtube'
              ? 'https://youtube.com/watch?v=…'
              : watchedPlatform === 'instagram'
                ? 'https://instagram.com/…'
                : watchedPlatform === 'tiktok'
                  ? 'https://tiktok.com/@…'
                  : watchedPlatform === 'facebook'
                    ? 'https://facebook.com/…'
                    : 'https://example.com/stream'
          }
          {...register('externalUrl')}
          error={errors.externalUrl?.message}
        />
      </div>

      {/* ── Category ── */}
      <div className="flex flex-col gap-1">
        <label htmlFor="session-category" className="text-small font-medium text-charcoal">
          Category
        </label>
        <select
          id="session-category"
          {...register('categoryId')}
          className="w-full rounded-card-sm border border-neutral-gray bg-white py-2.5 px-4 text-body text-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green"
        >
          <option value="">Select a category…</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-sm text-red-600" role="alert">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {/* ── Status ── */}
      <div className="flex flex-col gap-1">
        <label htmlFor="session-status" className="text-small font-medium text-charcoal">
          Status
        </label>
        <select
          id="session-status"
          {...register('status')}
          className="w-full rounded-card-sm border border-neutral-gray bg-white py-2.5 px-4 text-body text-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="text-sm text-red-600" role="alert">
            {errors.status.message}
          </p>
        )}
      </div>

      {/* ── Scheduled At (shown when status is "scheduled") ── */}
      {watchedStatus === 'scheduled' && (
        <Controller
          control={control}
          name="scheduledAt"
          render={({ field }) => (
            <div className="flex flex-col gap-1">
              <label
                htmlFor="session-scheduled-at"
                className="text-small font-medium text-charcoal"
              >
                Scheduled Date &amp; Time
              </label>
              <input
                id="session-scheduled-at"
                type="datetime-local"
                value={toDatetimeLocal(field.value as Date | string | undefined)}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value ? new Date(value) : undefined);
                }}
                onBlur={field.onBlur}
                min={toDatetimeLocal(new Date())}
                className="w-full rounded-card-sm border border-neutral-gray bg-white py-2.5 px-4 text-body text-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green"
              />
              {errors.scheduledAt && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.scheduledAt.message}
                </p>
              )}
            </div>
          )}
        />
      )}

      {/* ── Thumbnail URL ── */}
      <Input
        label="Thumbnail URL (optional)"
        type="url"
        placeholder="https://example.com/image.jpg"
        {...register('thumbnailUrl')}
        error={errors.thumbnailUrl?.message}
      />

      {/* ── Actions ── */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting} size="lg">
          {isEditMode ? (
            <Save className="h-5 w-5" aria-hidden />
          ) : (
            <Plus className="h-5 w-5" aria-hidden />
          )}
          {label}
        </Button>

        {onCancel && (
          <Button type="button" variant="secondary" size="lg" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
