/**
 * @jest-environment node
 */

/**
 * Unit tests for GET /api/categories and GET /api/categories/[slug]
 */

// ── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('@/lib/db/mongoose', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/models/Category', () => ({
  __esModule: true,
  default: { find: jest.fn(), findOne: jest.fn() },
}));

jest.mock('@/models/LiveSession', () => ({
  __esModule: true,
  default: { countDocuments: jest.fn() },
}));

jest.mock('@/models/Creator', () => ({
  __esModule: true,
  default: { countDocuments: jest.fn() },
}));

jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn().mockReturnValue(null),
  RATE_LIMIT_PRESETS: { read: {} },
}));

import { GET as getCategories } from '@/app/api/categories/route';
import { GET as getCategoryBySlug } from '@/app/api/categories/[slug]/route';
import Category from '@/models/Category';
import LiveSession from '@/models/LiveSession';
import Creator from '@/models/Creator';

const mockCategoryFind = Category.find as jest.Mock;
const mockCategoryFindOne = Category.findOne as jest.Mock;
const mockLiveSessionCountDocuments = LiveSession.countDocuments as jest.Mock;
const mockCreatorCountDocuments = Creator.countDocuments as jest.Mock;

// ── Tests: GET /api/categories ──────────────────────────────────────────────

describe('GET /api/categories', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns all categories', async () => {
    const categories = [
      { _id: '1', name: 'Tech', slug: 'tech-gadgets' },
      { _id: '2', name: 'Beauty', slug: 'beauty-personal-care' },
    ];
    mockCategoryFind.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(categories),
      }),
    });

    const res = await getCategories(new Request('http://localhost:3000/api/categories'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toHaveLength(2);
    expect(json.count).toBe(2);
  });

  it('filters by featured=true', async () => {
    mockCategoryFind.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([{ _id: '1', name: 'Tech', isFeatured: true }]),
      }),
    });

    const res = await getCategories(
      new Request('http://localhost:3000/api/categories?featured=true')
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(1);
    expect(mockCategoryFind).toHaveBeenCalledWith({ isFeatured: true });
  });

  it('returns 500 on DB error', async () => {
    mockCategoryFind.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockRejectedValue(new Error('DB fail')),
      }),
    });

    const res = await getCategories(new Request('http://localhost:3000/api/categories'));
    expect(res.status).toBe(500);
  });
});

// ── Tests: GET /api/categories/[slug] ───────────────────────────────────────

describe('GET /api/categories/[slug]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns category with stats', async () => {
    const category = { _id: 'cat1', name: 'Tech', slug: 'tech-gadgets' };
    mockCategoryFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(category) });
    mockLiveSessionCountDocuments
      .mockResolvedValueOnce(5) // live
      .mockResolvedValueOnce(3) // scheduled
      .mockResolvedValueOnce(20); // total
    mockCreatorCountDocuments.mockResolvedValue(8);

    const res = await getCategoryBySlug(
      new Request('http://localhost:3000/api/categories/tech-gadgets'),
      { params: { slug: 'tech-gadgets' } }
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.name).toBe('Tech');
    expect(json.data.stats.liveSessionCount).toBe(5);
    expect(json.data.stats.creatorCount).toBe(8);
  });

  it('returns 404 for unknown slug', async () => {
    mockCategoryFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

    const res = await getCategoryBySlug(
      new Request('http://localhost:3000/api/categories/nonexistent'),
      { params: { slug: 'nonexistent' } }
    );
    expect(res.status).toBe(404);
  });
});
