import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import dbConnect from '@/lib/db/mongoose';
import Category from '@/models/Category';
import CategoryCard from '@/components/cards/CategoryCard';
import { CATEGORY_BANNERS } from '@/lib/assets';

/* ─────────────────────────────────────────────────────────────────────
   All Categories Page — DESIGN.md §7.2 / TODO §8.2
   Server component with ISR (60s revalidate).
   Light gray header with breadcrumb, centered title, 3-column grid
   of full category cards with gradients + illustrations.
   ───────────────────────────────────────────────────────────────────── */

export const revalidate = 60; // ISR — regenerate every 60 seconds

export const metadata: Metadata = {
  title: 'All Categories',
  description:
    'Browse live shopping streams across every category — Tech & Gadgets, Beauty, Wellness, Sports & Fitness, Fashion, and more.',
  openGraph: {
    title: 'All Categories | LiveShopMarket',
    description:
      'Browse live shopping streams across every category — Tech & Gadgets, Beauty, Wellness, Sports & Fitness, Fashion, and more.',
    images: [
      {
        url: '/images/og-categories.png',
        width: 1200,
        height: 630,
        alt: 'LiveShopMarket Categories',
      },
    ],
  },
};

// Placeholder cards to fill gaps for future categories
const PLACEHOLDER_COUNT = 2;

interface CategoryDoc {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  sessionCount?: number;
}

async function getCategories(): Promise<CategoryDoc[]> {
  await dbConnect();
  const raw = await Category.find().sort({ sortOrder: 1 }).lean();
  return raw.map((cat) => {
    const c = cat as unknown as Record<string, unknown>;
    return {
      _id: String(c._id),
      name: String(c.name),
      slug: String(c.slug),
      description: c.description as string | undefined,
      sessionCount: typeof c.sessionCount === 'number' ? c.sessionCount : undefined,
    };
  });
}

export default async function AllCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header / Breadcrumb (DESIGN.md §7.2) ── */}
      <section className="bg-neutral-gray/40 py-6u">
        <div className="mx-auto max-w-container px-3u">
          {/* Breadcrumb */}
          <nav
            className="mb-3u flex items-center gap-2 text-small text-charcoal/60"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-charcoal">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="text-charcoal font-medium">All Categories</span>
          </nav>

          {/* Title */}
          <h1 className="text-center text-page-title text-deep-navy">All Categories</h1>
          <p className="mt-2u text-center text-body text-charcoal/70">
            Browse live shopping streams across every category
          </p>
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section className="mx-auto max-w-container px-3u py-8u">
        <div className="grid grid-cols-1 gap-4u sm:grid-cols-2 lg:grid-cols-3">
          {/* Real category cards */}
          {categories.map((cat) => (
            <CategoryCard
              key={cat._id}
              name={cat.name}
              slug={cat.slug}
              description={cat.description}
              sessionCount={cat.sessionCount}
              bannerSrc={CATEGORY_BANNERS[cat.slug]}
            />
          ))}

          {/* Gray placeholder cards for future categories (DESIGN.md §7.2) */}
          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <div
              key={`placeholder-${i}`}
              className="flex aspect-[3/2] items-center justify-center rounded-card bg-neutral-gray/60"
            >
              <span className="text-body text-charcoal/40">Coming Soon</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
