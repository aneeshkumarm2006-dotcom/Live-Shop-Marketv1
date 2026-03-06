import type { Metadata } from 'next';
import dbConnect from '@/lib/db/mongoose';
import Creator from '@/models/Creator';
import CreatorPageClient from './CreatorPageClient';

/* ─────────────────────────────────────────────────────────────────────
   Creator / Brand Profile Page — DESIGN.md §7.4 / TODO §8.4 / §11
   Server wrapper for generateMetadata. Client interactivity is
   delegated to CreatorPageClient.
   ───────────────────────────────────────────────────────────────────── */

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;

  let creatorName = 'Creator Profile';
  let creatorBio =
    "View this creator's profile, upcoming live shopping streams, and past sessions on LiveShopMarket.";
  let profileImage: string | undefined;

  try {
    await dbConnect();
    const creator = await Creator.findById(id).lean();
    if (creator) {
      const data = creator as unknown as Record<string, unknown>;
      creatorName = String(data.displayName ?? creatorName);
      if (data.bio && typeof data.bio === 'string') {
        creatorBio = data.bio.length > 160 ? data.bio.slice(0, 157) + '...' : data.bio;
      }
      profileImage = data.profileImage as string | undefined;
    }
  } catch {
    // fall through to defaults
  }

  return {
    title: creatorName,
    description: creatorBio,
    openGraph: {
      title: `${creatorName} | LiveShopMarket`,
      description: creatorBio,
      type: 'profile',
      ...(profileImage && {
        images: [{ url: profileImage, width: 400, height: 400, alt: creatorName }],
      }),
    },
  };
}

export default function CreatorProfilePage({ params }: PageProps) {
  return <CreatorPageClient creatorId={params.id} />;
}
