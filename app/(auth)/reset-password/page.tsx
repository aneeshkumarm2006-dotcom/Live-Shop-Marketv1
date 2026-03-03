'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, KeyRound, CheckCircle2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import apiClient from '@/lib/api-client';

/* ─────────────────────────────────────────────────
   Reset Password Page — TODO §8.5
   Accepts the token from the URL query param and
   lets the user set a new password via
   POST /api/auth/reset-password.
   ───────────────────────────────────────────────── */

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md rounded-card bg-white p-8 shadow-card-hover md:p-10 text-center">
          Loading…
        </div>
      }
    >
      <ResetPasswordPageInner />
    </Suspense>
  );
}

function ResetPasswordPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: '', confirmPassword: '' },
  });

  async function onSubmit(data: ResetPasswordInput) {
    setServerError('');
    try {
      await apiClient.post('/auth/reset-password', data);
      setIsSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setServerError(message);
    }
  }

  /* ── Missing token ── */
  if (!token) {
    return (
      <div className="w-full max-w-md overflow-hidden rounded-card bg-white p-8 shadow-card-hover md:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="mb-2 text-section-heading text-deep-navy">Invalid Link</h1>
          <p className="mb-6 text-body text-charcoal/70">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Button variant="secondary" onClick={() => router.push('/forgot-password')}>
            Request New Link
          </Button>
        </div>
      </div>
    );
  }

  /* ── Success state ── */
  if (isSuccess) {
    return (
      <div className="w-full max-w-md overflow-hidden rounded-card bg-white p-8 shadow-card-hover md:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon-green/20">
            <CheckCircle2 className="h-8 w-8 text-deep-navy" />
          </div>
          <h1 className="mb-2 text-section-heading text-deep-navy">Password Reset!</h1>
          <p className="mb-6 text-body text-charcoal/70">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <Button onClick={() => router.push('/login')}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  /* ── Form state ── */
  return (
    <div className="w-full max-w-md overflow-hidden rounded-card bg-white p-8 shadow-card-hover md:p-10">
      <h1 className="mb-2 text-center text-page-title text-deep-navy">Reset Password</h1>
      <p className="mb-8 text-center text-body text-charcoal/70">Enter your new password below.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        {/* ── Server error ── */}
        {serverError && (
          <div
            className="rounded-card-sm bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {serverError}
          </div>
        )}

        {/* Hidden token field */}
        <input type="hidden" {...register('token')} />

        {/* ── New Password ── */}
        <div className="relative">
          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            {...register('password')}
            error={errors.password?.message}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-[38px] text-neutral-gray hover:text-charcoal transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {/* ── Password requirements hint ── */}
        <ul className="text-xs text-neutral-500 -mt-4 ml-1 space-y-0.5">
          <li>At least 8 characters</li>
          <li>One uppercase, one lowercase, and one number</li>
        </ul>

        {/* ── Confirm Password ── */}
        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Re-enter your new password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            className="absolute right-3 top-[38px] text-neutral-gray hover:text-charcoal transition-colors"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {/* ── Submit ── */}
        <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
          <KeyRound className="h-5 w-5" aria-hidden />
          Reset Password
        </Button>

        {/* ── Back to login ── */}
        <p className="text-center text-sm text-charcoal">
          Remember your password?{' '}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="font-semibold text-deep-navy underline underline-offset-2 hover:text-neon-green transition-colors"
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  );
}
