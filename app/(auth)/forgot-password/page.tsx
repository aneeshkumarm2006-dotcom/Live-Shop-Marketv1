'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import apiClient from '@/lib/api-client';

/* ─────────────────────────────────────────────────
   Forgot Password Page — TODO §8.5
   Collects user email and triggers a password reset
   email via POST /api/auth/forgot-password.
   ───────────────────────────────────────────────── */

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setServerError('');
    try {
      await apiClient.post('/auth/forgot-password', data);
      setIsSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setServerError(message);
    }
  }

  /* ── Success state ── */
  if (isSuccess) {
    return (
      <div className="w-full max-w-md overflow-hidden rounded-card bg-white p-8 shadow-card-hover md:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon-green/20">
            <CheckCircle2 className="h-8 w-8 text-deep-navy" />
          </div>
          <h1 className="mb-2 text-section-heading text-deep-navy">Check Your Email</h1>
          <p className="mb-6 text-body text-charcoal/70">
            If an account with that email exists, we&apos;ve sent a password reset link. Please
            check your inbox and spam folder.
          </p>
          <Button variant="secondary" onClick={() => router.push('/login')}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  /* ── Form state ── */
  return (
    <div className="w-full max-w-md overflow-hidden rounded-card bg-white p-8 shadow-card-hover md:p-10">
      <h1 className="mb-2 text-center text-page-title text-deep-navy">Forgot Password</h1>
      <p className="mb-8 text-center text-body text-charcoal/70">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

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

        {/* ── Email ── */}
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />

        {/* ── Submit ── */}
        <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
          <Mail className="h-5 w-5" aria-hidden />
          Send Reset Link
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
