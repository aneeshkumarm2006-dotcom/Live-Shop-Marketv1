'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Megaphone, ShoppingBag, Tv, Sparkles } from 'lucide-react';
import SignUpForm from '@/components/forms/SignUpForm';
import type { RegisterInput } from '@/lib/validators';
import apiClient from '@/lib/api-client';

/* ─────────────────────────────────────────────────
   Sign-Up Page — DESIGN.md §7.5
   Split layout: left form panel, right decorative
   panel with neon-green gradient and messaging.
   Mobile: single-column, decorator on top.
   ───────────────────────────────────────────────── */

export default function SignUpPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  async function handleSignUp(data: RegisterInput) {
    setServerError('');
    try {
      // 1. Register the user
      await apiClient.post('/auth/register', data);

      // 2. Auto-sign-in after registration
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setServerError('Account created but auto-login failed. Please log in manually.');
        router.push('/login');
        return;
      }

      // 3. Redirect based on role
      router.push(data.role === 'creator' ? '/dashboard/creator' : '/dashboard/buyer');
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setServerError(message);
    }
  }

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-card bg-white shadow-card-hover">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* ── Right decorative panel (shows first on mobile) ── */}
        <div className="relative flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-neon-green via-neon-green/90 to-neon-green/70 px-8 py-10 text-deep-navy md:order-2 md:py-16">
          {/* Decorative floating icons */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <Tv className="absolute left-6 top-8 h-8 w-8 rotate-[-12deg] opacity-20" />
            <ShoppingBag className="absolute bottom-12 right-8 h-10 w-10 rotate-[8deg] opacity-20" />
            <Sparkles className="absolute right-12 top-16 h-6 w-6 opacity-25" />
          </div>

          {/* Main messaging */}
          <div className="relative z-10 text-center">
            <Megaphone className="mx-auto mb-4 h-12 w-12" aria-hidden />
            <h2 className="text-section-heading text-deep-navy">Never Miss a Live Moment</h2>
            <p className="mt-3 max-w-xs text-body text-deep-navy/80">
              Get notified when your favorite creators go live. Discover deals and shop in real time
              across all your favorite platforms.
            </p>
          </div>

          {/* Feature highlights */}
          <ul className="relative z-10 mt-2 space-y-2 text-sm font-medium text-deep-navy/70">
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-deep-navy/10 text-xs">
                ✓
              </span>
              Follow your favorite live-shopping creators
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-deep-navy/10 text-xs">
                ✓
              </span>
              Instant notifications when they go live
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-deep-navy/10 text-xs">
                ✓
              </span>
              Multi-platform — Instagram, TikTok, YouTube &amp; more
            </li>
          </ul>
        </div>

        {/* ── Left form panel ── */}
        <div className="flex flex-col justify-center px-8 py-10 md:order-1 md:px-10 md:py-16">
          <h1 className="mb-2 text-page-title text-deep-navy">Create Account</h1>
          <p className="mb-8 text-body text-charcoal/70">
            Join LiveShopMarket and start discovering live shopping streams.
          </p>

          <SignUpForm
            onSubmit={handleSignUp}
            serverError={serverError}
            onSwitchToLogin={() => router.push('/login')}
          />

          {/* ── OAuth divider ── */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-gray" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-charcoal/50">or continue with</span>
            </div>
          </div>

          {/* ── Google OAuth ── */}
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/dashboard/buyer' })}
            className="flex w-full items-center justify-center gap-3 rounded-button-secondary border border-neutral-gray px-4 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-neutral-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
