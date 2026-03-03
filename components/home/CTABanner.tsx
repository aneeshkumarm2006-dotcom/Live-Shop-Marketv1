import React from 'react';
import Link from 'next/link';

/* ─────────────────────────────────────────────────────────────────────
   CTABanner — DESIGN.md §7.1
   Deep blue banner with lifestyle-photography feel.
   "Never Miss a Live Moment" headline + sign-up CTA.
   ───────────────────────────────────────────────────────────────────── */

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-deep-navy">
      {/* Decorative gradient overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-deep-navy via-[#1A1A6E]/80 to-[#2563EB]/40"
      />

      {/* Floating shapes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-6 right-[10%] h-28 w-28 rounded-full bg-neon-green/10 blur-2xl" />
        <div className="absolute bottom-4 left-[8%] h-20 w-20 rounded-full bg-[#FF6B3D]/10 blur-xl" />
        <div className="absolute top-1/2 right-[35%] h-16 w-16 rounded-full bg-white/5 blur-lg" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-container flex-col items-center gap-4u px-3u py-12 text-center sm:py-16 lg:flex-row lg:gap-8u lg:py-20 lg:text-left">
        {/* Text content */}
        <div className="flex-1">
          <h2 className="text-banner-title text-white lg:text-page-title">
            Never Miss a Live Moment
          </h2>
          <p className="mt-2u max-w-lg text-lg leading-relaxed text-white/70 lg:text-xl">
            Sign up to get notified when your favorite creators go live. Discover the best deals
            across platforms — all in one place.
          </p>
        </div>

        {/* CTA button */}
        <Link
          href="/register"
          className="inline-flex shrink-0 items-center rounded-button bg-neon-green px-8 py-3.5 text-button-text font-bold text-deep-navy shadow-lg transition-all duration-button hover:brightness-90 hover:shadow-xl"
        >
          Sign Up for Free
        </Link>
      </div>
    </section>
  );
}
