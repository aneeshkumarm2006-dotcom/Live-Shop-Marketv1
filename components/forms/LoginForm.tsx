'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { loginSchema, type LoginInput } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

/* ─────────────────────────────────────────────────
   LoginForm — DESIGN.md §7.5 / TODO §8.5
   Clean login form with email + password + remember me.
   ───────────────────────────────────────────────── */

export interface LoginFormProps {
  /** Called with validated credentials on submit */
  onSubmit: (data: LoginInput) => Promise<void> | void;
  /** External error message (e.g. "Invalid credentials") */
  serverError?: string;
  /** Navigate to sign-up */
  onSwitchToSignUp?: () => void;
  /** Navigate to forgot password */
  onForgotPassword?: () => void;
}

export default function LoginForm({
  onSubmit,
  serverError,
  onSwitchToSignUp,
  onForgotPassword,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

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

      {/* ── Email ── */}
      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        {...register('email')}
        error={errors.email?.message}
      />

      {/* ── Password ── */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          autoComplete="current-password"
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

      {/* ── Forgot password link ── */}
      {onForgotPassword && (
        <div className="-mt-3 text-right">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-neutral-500 hover:text-deep-navy transition-colors underline underline-offset-2"
          >
            Forgot password?
          </button>
        </div>
      )}

      {/* ── Submit ── */}
      <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
        <LogIn className="h-5 w-5" aria-hidden />
        Log In
      </Button>

      {/* ── Switch to sign-up ── */}
      {onSwitchToSignUp && (
        <p className="text-center text-sm text-charcoal">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="font-semibold text-deep-navy underline underline-offset-2 hover:text-neon-green transition-colors"
          >
            Sign Up
          </button>
        </p>
      )}
    </form>
  );
}
