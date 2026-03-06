// ─── Input Sanitizer — XSS Protection ──────────────────────────────────────
//
// Strips dangerous HTML / script content from user-supplied strings.
// React already escapes output, but this adds defence-in-depth for data
// stored in the database (e.g. creator bios, session titles/descriptions).
//
// Zero-dependency implementation — no external library required.
// ────────────────────────────────────────────────────────────────────────────

// ─── Dangerous Patterns ─────────────────────────────────────────────────────

/** Matches `<script …>…</script>` blocks (including multiline) */
const SCRIPT_TAG_RE = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

/** Matches inline event handlers like `onerror="…"`, `onload='…'` */
const EVENT_HANDLER_RE = /\s*on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;

/** Matches `javascript:` protocol in attributes */
const JS_PROTOCOL_RE = /javascript\s*:/gi;

/** Matches `data:` URIs that could execute scripts (text/html, etc.) */
const DATA_URI_RE = /data\s*:\s*(?:text\/html|application\/xhtml)/gi;

/** Matches HTML tags entirely (used for full strip mode) */
const HTML_TAG_RE = /<\/?[^>]+(>|$)/g;

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Sanitize a single string by removing dangerous HTML and script content.
 *
 * This strips:
 * - `<script>` tags and content
 * - Inline event handlers (`onclick`, `onerror`, etc.)
 * - `javascript:` protocol URIs
 * - Dangerous `data:` URIs
 * - All remaining HTML tags
 *
 * @param input - The raw user input string
 * @returns A cleaned string safe for storage and rendering
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return input;

  let cleaned = input;

  // 1. Remove <script> blocks
  cleaned = cleaned.replace(SCRIPT_TAG_RE, '');

  // 2. Remove event handler attributes
  cleaned = cleaned.replace(EVENT_HANDLER_RE, '');

  // 3. Remove javascript: protocol
  cleaned = cleaned.replace(JS_PROTOCOL_RE, '');

  // 4. Remove dangerous data: URIs
  cleaned = cleaned.replace(DATA_URI_RE, '');

  // 5. Strip all remaining HTML tags
  cleaned = cleaned.replace(HTML_TAG_RE, '');

  // 6. Trim whitespace
  cleaned = cleaned.trim();

  return cleaned;
}

/**
 * Recursively sanitize all string values in an object or array.
 *
 * - Strings → sanitized
 * - Numbers, booleans, null, undefined → returned as-is
 * - Arrays → each element sanitized recursively
 * - Objects → each value sanitized recursively
 *
 * @param data - The data to sanitize (typically a parsed JSON body)
 * @returns A new object with all string values sanitized
 */
export function sanitizeInput<T>(data: T): T {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    return sanitizeString(data) as unknown as T;
  }

  if (typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeInput(item)) as unknown as T;
  }

  if (typeof data === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized as T;
  }

  return data;
}

/**
 * Convenience: sanitize a parsed request body (JSON).
 *
 * Usage in API routes:
 * ```ts
 * import { sanitizeBody } from '@/lib/sanitize';
 *
 * export async function POST(req: Request) {
 *   const body = sanitizeBody(await req.json());
 *   // body is now safe to validate & store
 * }
 * ```
 */
export function sanitizeBody<T extends Record<string, unknown>>(body: T): T {
  return sanitizeInput(body);
}
