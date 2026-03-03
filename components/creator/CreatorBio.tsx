'use client';

import React from 'react';
import Image from 'next/image';
import type { SocialLinks } from '@/types';

/* ─────────────────────────────────────────────────────────────────────
   CreatorBio — DESIGN.md §7.4
   Multi-line bio + social media icon links (TikTok, Instagram, etc.)
   ───────────────────────────────────────────────────────────────────── */

const SOCIAL_META: Record<keyof SocialLinks, { label: string; icon: string; color: string }> = {
  instagram: { label: 'Instagram', icon: '/icons/instagram.svg', color: '#E1306C' },
  tiktok: { label: 'TikTok', icon: '/icons/tiktok.svg', color: '#000000' },
  youtube: { label: 'YouTube', icon: '/icons/youtube.svg', color: '#FF0000' },
  facebook: { label: 'Facebook', icon: '/icons/facebook.svg', color: '#1877F2' },
};

export interface CreatorBioProps {
  bio?: string;
  socialLinks?: SocialLinks;
}

export default function CreatorBio({ bio, socialLinks }: CreatorBioProps) {
  const activeSocials = socialLinks
    ? (Object.entries(socialLinks) as [keyof SocialLinks, string | undefined][]).filter(
        ([, url]) => !!url
      )
    : [];

  if (!bio && activeSocials.length === 0) return null;

  return (
    <section className="mx-auto max-w-container px-3u py-6u">
      {/* ── Bio ── */}
      {bio && (
        <div className="mb-4u max-w-3xl">
          <h2 className="mb-2u text-section-heading text-deep-navy">About</h2>
          <p className="whitespace-pre-line text-body text-charcoal/80 leading-relaxed">{bio}</p>
        </div>
      )}

      {/* ── Social Links ── */}
      {activeSocials.length > 0 && (
        <div>
          <h3 className="mb-2u text-card-title text-deep-navy">Find us on</h3>
          <div className="flex flex-wrap items-center gap-3u">
            {activeSocials.map(([platform, url]) => {
              const meta = SOCIAL_META[platform];
              if (!meta || !url) return null;
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-button-secondary border border-neutral-gray bg-white px-4u py-2 text-small font-semibold text-charcoal transition-all duration-hover hover:bg-neutral-50 hover:shadow-card"
                  aria-label={`Visit ${meta.label}`}
                >
                  <Image
                    src={meta.icon}
                    alt={meta.label}
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                  {meta.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
