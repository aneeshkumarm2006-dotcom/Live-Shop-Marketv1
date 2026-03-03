'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { z } from 'zod';
import { registerSchema, type RegisterInput } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

type RegisterFormValues = z.input<typeof registerSchema>;

/* ─────────────────────────────────────────────────
   SignUpForm — DESIGN.md §7.5
   Split-layout sign-up with email, password, name,
   and role selection. Uses registerSchema from the
   Zod validators for full client-side validation.
   ───────────────────────────────────────────────── */

export interface SignUpFormProps {
  /** Called with validated form data on submit */
  onSubmit: (data: RegisterInput) => Promise<void> | void;
  /** External error message (e.g. "Email already exists") */
  serverError?: string;
  /** Replaces the default button label */
  submitLabel?: string;
  /** Switch to login handler */
  onSwitchToLogin?: () => void;
}

export default function SignUpForm({
  onSubmit,
  serverError,
  submitLabel = 'Create My Account',
  onSwitchToLogin,
}: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues, unknown, RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'buyer',
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

      {/* ── Name ── */}
      <Input
        label="Full Name"
        placeholder="John Doe"
        autoComplete="name"
        {...register('name')}
        error={errors.name?.message}
      />

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

      {/* ── Role selection ── */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-small font-medium text-charcoal mb-1">I want to…</legend>
        <div className="grid grid-cols-2 gap-3">
          <label className="relative cursor-pointer">
            <input type="radio" value="buyer" {...register('role')} className="peer sr-only" />
            <div className="flex items-center justify-center gap-2 rounded-button-secondary border border-neutral-gray py-3 px-4 text-sm font-semibold text-charcoal transition-all peer-checked:border-neon-green peer-checked:bg-neon-green/10 peer-checked:text-deep-navy peer-focus-visible:ring-2 peer-focus-visible:ring-neon-green/50">
              Shop Live
            </div>
          </label>

          <label className="relative cursor-pointer">
            <input type="radio" value="creator" {...register('role')} className="peer sr-only" />
            <div className="flex items-center justify-center gap-2 rounded-button-secondary border border-neutral-gray py-3 px-4 text-sm font-semibold text-charcoal transition-all peer-checked:border-neon-green peer-checked:bg-neon-green/10 peer-checked:text-deep-navy peer-focus-visible:ring-2 peer-focus-visible:ring-neon-green/50">
              Go Live
            </div>
          </label>
        </div>
        {errors.role && (
          <p className="text-sm text-red-600" role="alert">
            {errors.role.message}
          </p>
        )}
      </fieldset>

      {/* ── Submit ── */}
      <Button type="submit" fullWidth isLoading={isSubmitting} size="lg">
        <UserPlus className="h-5 w-5" aria-hidden />
        {submitLabel}
      </Button>

      {/* ── Switch to login ── */}
      {onSwitchToLogin && (
        <p className="text-center text-sm text-charcoal">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-deep-navy underline underline-offset-2 hover:text-neon-green transition-colors"
          >
            Log In
          </button>
        </p>
      )}
    </form>
  );
}
