'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────
   HeroSection — DESIGN.md §7.1 / §5.6
   Vibrant blue gradient background with floating video-frame elements,
   large "LiveShopMarket" title, tagline, and centered search bar.
   ───────────────────────────────────────────────────────────────────── */

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        router.push(`/categories?search=${encodeURIComponent(trimmed)}`);
      }
    },
    [query, router]
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#2563EB] via-[#1A1A6E] to-[#06B6D4]">
      {/* ── Decorative floating elements ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Video frame 1 */}
        <div className="absolute -top-8 -left-12 h-40 w-56 rotate-[-12deg] rounded-2xl border-4 border-white/10 bg-white/5 backdrop-blur-sm" />
        {/* Video frame 2 */}
        <div className="absolute top-12 right-[8%] h-32 w-48 rotate-[8deg] rounded-2xl border-4 border-white/10 bg-white/5 backdrop-blur-sm" />
        {/* Video frame 3 */}
        <div className="absolute bottom-6 left-[15%] h-28 w-44 rotate-[-6deg] rounded-2xl border-4 border-white/10 bg-white/5 backdrop-blur-sm" />
        {/* Floating circles */}
        <div className="absolute top-1/4 right-[20%] h-20 w-20 rounded-full bg-neon-green/10 blur-xl" />
        <div className="absolute bottom-1/3 left-[10%] h-16 w-16 rounded-full bg-[#FF6B3D]/15 blur-xl" />
        <div className="absolute top-[60%] right-[40%] h-24 w-24 rounded-full bg-[#D4FF00]/8 blur-2xl" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex max-w-container flex-col items-center px-3u py-16 text-center sm:py-20 lg:py-28">
        {/* Announcement pill */}
        <span className="mb-4u inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-small font-medium text-white/90 backdrop-blur-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-neon-green animate-live-pulse" />
          Live streams happening now
        </span>

        {/* Title */}
        <h1 className="text-hero-heading text-white drop-shadow-lg sm:text-[56px] md:text-[64px]">
          LiveShopMarket
        </h1>

        {/* Tagline */}
        <p className="mt-3u max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">
          Discover and join live shopping streams from your favorite creators across YouTube,
          Instagram, TikTok, and more.
        </p>

        {/* ── Search bar (DESIGN.md §5.6) ── */}
        <form
          onSubmit={handleSearch}
          className="mt-6u flex w-full max-w-lg items-center overflow-hidden rounded-search bg-white shadow-lg"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you searching for?"
            className="flex-1 bg-transparent px-6 py-3.5 text-body text-charcoal outline-none placeholder:text-charcoal/40"
          />
          <button
            type="submit"
            aria-label="Search"
            className="mr-1.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neon-green text-deep-navy transition-all duration-button hover:brightness-90"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>

        {/* Quick category pills */}
        <div className="mt-4u flex flex-wrap items-center justify-center gap-2">
          {['Fashion', 'Tech & Gadgets', 'Beauty', 'Wellness', 'Sports'].map((cat) => (
            <span
              key={cat}
              className="cursor-pointer rounded-full border border-white/20 px-3.5 py-1 text-small text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
