import dbConnect from '@/lib/db/mongoose';
import Category from '@/models/Category';
import LiveSession from '@/models/LiveSession';
import Creator from '@/models/Creator';

import HeroSection from '@/components/home/HeroSection';
import LiveFeaturedSessions from '@/components/home/LiveFeaturedSessions';
import CategoryRow from '@/components/home/CategoryRow';
import CTABanner from '@/components/home/CTABanner';
import LiveNotificationPoller from '@/components/home/LiveNotificationPoller';

import type { FeaturedSession } from '@/components/home/FeaturedLiveSessions';
import type { CategoryRowCreator, CategoryRowSession } from '@/components/home/CategoryRow';

import type { Platform, SessionStatus } from '@/types/liveSession';

/* ─────────────────────────────────────────────────────────────────────
   Homepage — DESIGN.md §7.1  /  TODO §8.1
   Server Component with ISR: revalidates every 30 s so live sessions
   stay fresh while keeping build-time performance.
   ───────────────────────────────────────────────────────────────────── */

export const revalidate = 30; // ISR — regenerate every 30 seconds

// ─── Data helpers (server only) ─────────────────────────────────────

interface PopulatedCreator {
  displayName: string;
  profileImage?: string;
}

interface PopulatedSession {
  _id: unknown;
  title: string;
  status: SessionStatus;
  platform: Platform;
  externalUrl?: string;
  thumbnailUrl?: string;
  scheduledAt?: Date;
  creatorId?: PopulatedCreator;
}

interface CategoryWithSessions {
  _id: string;
  name: string;
  slug: string;
  creators: CategoryRowCreator[];
  sessions: CategoryRowSession[];
}

function extractCreatorName(doc: { creatorId?: unknown }): string | undefined {
  const c = doc.creatorId;
  if (c && typeof c === 'object' && 'displayName' in c) {
    return (c as PopulatedCreator).displayName;
  }
  return undefined;
}

async function getHomepageData() {
  await dbConnect();

  // 1. Featured live / upcoming sessions (max 6)
  const featuredRaw = (await LiveSession.find({
    status: { $in: ['live', 'scheduled'] },
  })
    .sort({ status: 1, scheduledAt: 1, createdAt: -1 })
    .limit(6)
    .populate('creatorId', 'displayName profileImage')
    .populate('categoryId', 'name slug')
    .lean()) as unknown as PopulatedSession[];

  const featuredSessions: FeaturedSession[] = featuredRaw.map((s) => ({
    _id: String(s._id),
    title: s.title,
    status: s.status,
    platform: s.platform,
    externalUrl: s.externalUrl ?? undefined,
    thumbnailUrl: s.thumbnailUrl ?? undefined,
    scheduledAt: s.scheduledAt ? new Date(s.scheduledAt).toISOString() : undefined,
    creator: extractCreatorName(s) ? { displayName: extractCreatorName(s)! } : undefined,
  }));

  // 2. Categories (sorted by sortOrder)
  const categories = (await Category.find().sort({ sortOrder: 1 }).lean()) as unknown as Array<{
    _id: string;
    name: string;
    slug: string;
  }>;

  // 3. For each category, fetch a handful of creators + recent sessions
  const categoryRows: CategoryWithSessions[] = await Promise.all(
    categories.map(async (cat) => {
      const catId = cat._id;

      const [creators, sessions] = await Promise.all([
        Creator.find({ categories: catId })
          .sort({ followerCount: -1 })
          .limit(8)
          .lean() as unknown as Promise<
          Array<{
            _id: unknown;
            displayName: string;
            profileImage?: string;
          }>
        >,
        LiveSession.find({
          categoryId: catId,
          status: { $in: ['live', 'scheduled'] },
        })
          .sort({ status: 1, scheduledAt: 1 })
          .limit(4)
          .populate('creatorId', 'displayName')
          .lean() as unknown as Promise<PopulatedSession[]>,
      ]);

      return {
        _id: String(catId),
        name: cat.name,
        slug: cat.slug,
        creators: creators.map((c) => ({
          _id: String(c._id),
          displayName: c.displayName,
          profileImage: c.profileImage ?? undefined,
        })),
        sessions: sessions.map((s) => ({
          _id: String(s._id),
          title: s.title,
          status: s.status,
          platform: s.platform,
          externalUrl: s.externalUrl ?? undefined,
          thumbnailUrl: s.thumbnailUrl ?? undefined,
          scheduledAt: s.scheduledAt ? new Date(s.scheduledAt).toISOString() : undefined,
          creator: extractCreatorName(s) ? { displayName: extractCreatorName(s)! } : undefined,
        })),
      };
    })
  );

  // 4. Latest live session for the bottom notification banner
  const latestLive = (await LiveSession.findOne({ status: 'live' })
    .sort({ startedAt: -1 })
    .populate('creatorId', 'displayName')
    .lean()) as unknown as PopulatedSession | null;

  const liveNotification = latestLive
    ? {
        brandName: extractCreatorName(latestLive) ?? 'A creator',
        platform: latestLive.platform,
        externalUrl: latestLive.externalUrl ?? '',
        sessionId: String(latestLive._id),
      }
    : null;

  return { featuredSessions, categoryRows, liveNotification };
}

// ─── Page component ─────────────────────────────────────────────────

export default async function Home() {
  const { featuredSessions, categoryRows, liveNotification } = await getHomepageData();

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Featured live & upcoming sessions (polls every 30 s) ── */}
      <LiveFeaturedSessions initialSessions={featuredSessions} />

      {/* ── Category rows (horizontal scrollable) ── */}
      {categoryRows.map((cat) => (
        <CategoryRow
          key={cat._id}
          title={cat.name}
          href={`/categories/${cat.slug}`}
          creators={cat.creators}
          sessions={cat.sessions}
        />
      ))}

      {/* ── CTA banner ── */}
      <CTABanner />

      {/* ── Live notification banner (bottom, polls every 30 s) ── */}
      <LiveNotificationPoller initialNotification={liveNotification} />
    </div>
  );
}
