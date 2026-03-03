'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Instagram, Youtube, Facebook } from 'lucide-react';
import { updateCreatorProfileSchema, type UpdateCreatorProfileInput } from '@/lib/validators';
import { Input, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { CategoryOption } from './SessionForm';

/* ─────────────────────────────────────────────────
   CreatorProfileForm — TODO §8.6 / DESIGN.md §7.4
   Edit creator display-name, bio, social links, and
   category associations. Uses updateCreatorProfileSchema.
   ───────────────────────────────────────────────── */

export interface CreatorProfileFormProps {
  /** Called with validated profile data */
  onSubmit: (data: UpdateCreatorProfileInput) => Promise<void> | void;
  /** Available categories for multi-select */
  categories: CategoryOption[];
  /** Pre-fill existing profile data */
  defaultValues?: Partial<UpdateCreatorProfileInput>;
  /** External error */
  serverError?: string;
  /** Cancel handler */
  onCancel?: () => void;
}

export default function CreatorProfileForm({
  onSubmit,
  categories,
  defaultValues,
  serverError,
  onCancel,
}: CreatorProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateCreatorProfileInput>({
    resolver: zodResolver(updateCreatorProfileSchema),
    defaultValues: {
      displayName: '',
      bio: '',
      profileImage: '',
      socialLinks: {
        instagram: '',
        tiktok: '',
        youtube: '',
        facebook: '',
      },
      categories: [],
      ...defaultValues,
    },
  });

  // Flatten nested social-link errors for convenience
  const socialErrors = errors.socialLinks as Record<string, { message?: string }> | undefined;

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        // Strip empty strings from socialLinks so the API receives null/undefined
        if (data.socialLinks) {
          const cleaned = { ...data.socialLinks };
          (Object.keys(cleaned) as (keyof typeof cleaned)[]).forEach((key) => {
            if (cleaned[key] === '') {
              cleaned[key] = undefined;
            }
          });
          data.socialLinks = cleaned;
        }
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

      {/* ── Display Name ── */}
      <Input
        label="Display Name"
        placeholder="Your brand or creator name"
        autoComplete="organization"
        {...register('displayName')}
        error={errors.displayName?.message}
      />

      {/* ── Bio ── */}
      <Textarea
        label="Bio"
        placeholder="Tell viewers about yourself and what you stream…"
        rows={4}
        {...register('bio')}
        error={errors.bio?.message}
      />

      {/* ── Profile Image URL ── */}
      <Input
        label="Profile Image URL (optional)"
        type="url"
        placeholder="https://example.com/avatar.jpg"
        {...register('profileImage')}
        error={errors.profileImage?.message}
      />

      {/* ── Social Links ── */}
      <fieldset className="flex flex-col gap-4">
        <legend className="text-small font-medium text-charcoal mb-1">Social Links</legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Instagram */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-small font-medium text-charcoal">
              <Instagram className="h-4 w-4 text-pink-500" aria-hidden />
              Instagram
            </div>
            <input
              type="url"
              placeholder="https://instagram.com/you"
              {...register('socialLinks.instagram')}
              className="w-full rounded-card-sm border border-neutral-gray bg-white py-2.5 px-4 text-body text-charcoal placeholder:text-neutral-gray transition-colors focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green"
            />
            {socialErrors?.instagram?.message && (
              <p className="text-sm text-red-600" role="alert">
                {socialErrors.instagram.message}
              </p>
            )}
          </div>

          {/* TikTok */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-small font-medium text-charcoal">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.84 2.84 0 0 1 .84.13v-3.5a6.37 6.37 0 0 0-.84-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 10.86 4.42 6.29 6.29 0 0 0 1.86-4.48V8.74a8.24 8.24 0 0 0 4.81 1.54V6.84a4.79 4.79 0 0 1-1.09-.15z" />
              </svg>
              TikTok
            </div>
            <input
              type="url"
              placeholder="https://tiktok.com/@you"
              {...register('socialLinks.tiktok')}
              className="w-full rounded-card-sm border border-neutral-gray bg-white py-2.5 px-4 text-body text-charcoal placeholder:text-neutral-gray transition-colors focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green"
            />
            {socialErrors?.tiktok?.message && (
              <p className="text-sm text-red-600" role="alert">
                {socialErrors.tiktok.message}
              </p>
            )}
          </div>

          {/* YouTube */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-small font-medium text-charcoal">
              <Youtube className="h-4 w-4 text-red-600" aria-hidden />
              YouTube
            </div>
            <input
              type="url"
              placeholder="https://youtube.com/@you"
              {...register('socialLinks.youtube')}
              className="w-full rounded-card-sm border border-neutral-gray bg-white py-2.5 px-4 text-body text-charcoal placeholder:text-neutral-gray transition-colors focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green"
            />
            {socialErrors?.youtube?.message && (
              <p className="text-sm text-red-600" role="alert">
                {socialErrors.youtube.message}
              </p>
            )}
          </div>

          {/* Facebook */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-small font-medium text-charcoal">
              <Facebook className="h-4 w-4 text-blue-600" aria-hidden />
              Facebook
            </div>
            <input
              type="url"
              placeholder="https://facebook.com/you"
              {...register('socialLinks.facebook')}
              className="w-full rounded-card-sm border border-neutral-gray bg-white py-2.5 px-4 text-body text-charcoal placeholder:text-neutral-gray transition-colors focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green"
            />
            {socialErrors?.facebook?.message && (
              <p className="text-sm text-red-600" role="alert">
                {socialErrors.facebook.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* ── Categories (multi-select via checkboxes) ── */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-small font-medium text-charcoal mb-1">
          Categories <span className="text-neutral-500 font-normal">(up to 10)</span>
        </legend>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto rounded-card-sm border border-neutral-gray p-3">
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                value={cat._id}
                {...register('categories')}
                className="h-4 w-4 rounded border-neutral-gray text-neon-green accent-neon-green focus:ring-neon-green/50"
              />
              {cat.name}
            </label>
          ))}
          {categories.length === 0 && (
            <p className="col-span-full text-sm text-neutral-500 italic">No categories available</p>
          )}
        </div>

        {errors.categories && (
          <p className="text-sm text-red-600" role="alert">
            {errors.categories.message}
          </p>
        )}
      </fieldset>

      {/* ── Actions ── */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting} disabled={!isDirty} size="lg">
          <Save className="h-5 w-5" aria-hidden />
          Save Profile
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
