/**
 * Tests for lib/validators/url.ts
 */

import {
  youtubeUrlSchema,
  instagramUrlSchema,
  tiktokUrlSchema,
  facebookUrlSchema,
  externalUrlSchema,
  getUrlSchemaForPlatform,
  socialLinksSchema,
  detectPlatform,
  isLikelyLiveStreamUrl,
  sanitizeUrl,
  liveStreamUrlSchema,
} from '@/lib/validators/url';

// ── Per-platform URL schemas ───────────────────────────────────────────────

describe('youtubeUrlSchema', () => {
  it.each([
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtube.com/live/abc',
    'https://youtu.be/abc123',
  ])('accepts valid YouTube URL: %s', (url) => {
    expect(youtubeUrlSchema.safeParse(url).success).toBe(true);
  });

  it.each(['https://www.instagram.com/user', 'not-a-url', ''])(
    'rejects invalid YouTube URL: %s',
    (url) => {
      expect(youtubeUrlSchema.safeParse(url).success).toBe(false);
    }
  );
});

describe('instagramUrlSchema', () => {
  it('accepts valid Instagram URL', () => {
    expect(instagramUrlSchema.safeParse('https://www.instagram.com/user123').success).toBe(true);
  });
  it('rejects non-Instagram URL', () => {
    expect(instagramUrlSchema.safeParse('https://youtube.com/abc').success).toBe(false);
  });
});

describe('tiktokUrlSchema', () => {
  it('accepts valid TikTok URL', () => {
    expect(tiktokUrlSchema.safeParse('https://www.tiktok.com/@user/video/123').success).toBe(true);
  });
  it('accepts vm.tiktok.com short link', () => {
    expect(tiktokUrlSchema.safeParse('https://vm.tiktok.com/abc').success).toBe(true);
  });
});

describe('facebookUrlSchema', () => {
  it('accepts valid Facebook URL', () => {
    expect(facebookUrlSchema.safeParse('https://www.facebook.com/page/posts/123').success).toBe(
      true
    );
  });
  it('accepts fb.watch short link', () => {
    expect(facebookUrlSchema.safeParse('https://fb.watch/abc').success).toBe(true);
  });
});

describe('externalUrlSchema', () => {
  it('accepts any http(s) URL', () => {
    expect(externalUrlSchema.safeParse('https://myshop.com/live').success).toBe(true);
  });
  it('rejects non-http URL', () => {
    expect(externalUrlSchema.safeParse('ftp://files.com/a').success).toBe(false);
  });
});

// ── getUrlSchemaForPlatform ────────────────────────────────────────────────

describe('getUrlSchemaForPlatform', () => {
  it('returns youtube schema for youtube', () => {
    const schema = getUrlSchemaForPlatform('youtube');
    expect(schema.safeParse('https://youtube.com/watch?v=1').success).toBe(true);
  });
  it('returns external schema for other', () => {
    const schema = getUrlSchemaForPlatform('other');
    expect(schema.safeParse('https://custom-stream.com/live').success).toBe(true);
  });
});

// ── socialLinksSchema ──────────────────────────────────────────────────────

describe('socialLinksSchema', () => {
  it('accepts valid partial social links', () => {
    const data = {
      instagram: 'https://www.instagram.com/user',
      youtube: 'https://youtube.com/channel/abc',
    };
    expect(socialLinksSchema.safeParse(data).success).toBe(true);
  });

  it('accepts empty strings (optional fields)', () => {
    const data = { instagram: '', tiktok: '' };
    expect(socialLinksSchema.safeParse(data).success).toBe(true);
  });

  it('rejects mismatched platform URLs', () => {
    const data = { instagram: 'https://youtube.com/video' };
    expect(socialLinksSchema.safeParse(data).success).toBe(false);
  });
});

// ── detectPlatform ─────────────────────────────────────────────────────────

describe('detectPlatform', () => {
  it.each<[string, string]>([
    ['https://youtube.com/watch?v=abc', 'youtube'],
    ['https://www.instagram.com/user', 'instagram'],
    ['https://tiktok.com/@user/live', 'tiktok'],
    ['https://facebook.com/video/123', 'facebook'],
    ['https://myshop.com/stream', 'other'],
  ])('detects %s as %s', (url, expected) => {
    expect(detectPlatform(url)).toBe(expected);
  });
});

// ── isLikelyLiveStreamUrl ──────────────────────────────────────────────────

describe('isLikelyLiveStreamUrl', () => {
  it.each([
    'https://youtube.com/live/abc',
    'https://youtube.com/watch?v=abc',
    'https://www.instagram.com/creator/live',
    'https://tiktok.com/@user/live',
    'https://facebook.com/page/videos/123',
    'https://fb.watch/abc',
  ])('recognises live stream URL: %s', (url) => {
    expect(isLikelyLiveStreamUrl(url)).toBe(true);
  });

  it.each(['https://example.com/page', 'https://twitter.com/user'])(
    'returns false for non-live URL: %s',
    (url) => {
      expect(isLikelyLiveStreamUrl(url)).toBe(false);
    }
  );
});

// ── sanitizeUrl ────────────────────────────────────────────────────────────

describe('sanitizeUrl', () => {
  it('returns the URL unchanged when valid', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
  });

  it('prepends https:// when scheme is missing', () => {
    expect(sanitizeUrl('example.com/page')).toBe('https://example.com/page');
  });

  it('trims whitespace', () => {
    expect(sanitizeUrl('  https://a.com  ')).toBe('https://a.com');
  });

  it('blocks javascript: URIs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
  });

  it('blocks data: URIs', () => {
    expect(sanitizeUrl('data:text/html,<h1>hi</h1>')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(sanitizeUrl('')).toBeNull();
  });

  it('returns null for structurally invalid URL', () => {
    expect(sanitizeUrl('://not-valid')).toBeNull();
  });
});

// ── liveStreamUrlSchema ────────────────────────────────────────────────────

describe('liveStreamUrlSchema', () => {
  it('accepts a YouTube live URL', () => {
    expect(liveStreamUrlSchema.safeParse('https://youtube.com/live/abc').success).toBe(true);
  });

  it('accepts any HTTPS URL (e.g. QVC)', () => {
    expect(liveStreamUrlSchema.safeParse('https://qvc.com/live/show123').success).toBe(true);
  });

  it('rejects plain HTTP for non-platform URLs', () => {
    // http:// without a known platform pattern should fail the refine
    const result = liveStreamUrlSchema.safeParse('http://random-site.com/stream');
    // http:// youtube/ig/tiktok/fb passes, but generic http does not
    expect(result.success).toBe(false);
  });
});
