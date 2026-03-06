import type { Metadata } from 'next';
import dbConnect from '@/lib/db/mongoose';
import Category from '@/models/Category';
import CategoryPageClient from './CategoryPageClient';

/* ─────────────────────────────────────────────────────────────────────
   Single Category Page — DESIGN.md §7.3 / TODO §8.3 / TODO §11
   Server wrapper for generateMetadata + ISR (60s revalidate).
   Client interactivity (filters, search, sort) delegated to
   CategoryPageClient.
   ───────────────────────────────────────────────────────────────────── */

export const revalidate = 60; // ISR — regenerate every 60 seconds

interface PageProps {
  params: { slug: string };
}

// Map slug → human-friendly category name for OG/title fallback
const SLUG_LABELS: Record<string, string> = {
  'tech-gadgets': 'Tech & Gadgets',
  'beauty-personal-care': 'Beauty & Personal Care',
  wellness: 'Wellness',
  'sports-fitness': 'Sports & Fitness',
  fashion: 'Fashion',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;

  let categoryName =
    SLUG_LABELS[slug] ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  let categoryDescription = `Discover live shopping streams in ${categoryName} — browse live creators, scheduled sessions, and more.`;

  try {
    await dbConnect();
    const cat = await Category.findOne({ slug }).lean();
    if (cat) {
      const data = cat as unknown as Record<string, unknown>;
      categoryName = String(data.name ?? categoryName);
      const desc = data.description as string | undefined;
      if (desc) categoryDescription = desc;
    }
  } catch {
    // fall through to defaults
  }

  return {
    title: categoryName,
    description: categoryDescription,
    openGraph: {
      title: `${categoryName} — Live Shopping Streams | LiveShopMarket`,
      description: categoryDescription,
      images: [
        {
          url: `/images/og-category-${slug}.png`,
          width: 1200,
          height: 630,
          alt: `${categoryName} live shopping streams`,
        },
      ],
    },
  };
}

export default function SingleCategoryPage({ params }: PageProps) {
  return <CategoryPageClient slug={params.slug} />;
}
