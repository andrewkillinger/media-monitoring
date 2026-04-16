/**
 * Article normalization utilities for the ingestion pipeline.
 */

// ─── Title normalization ──────────────────────────────────────────────────────

/**
 * Normalize an article title for indexing and comparison.
 * - Lowercases
 * - Strips leading/trailing whitespace
 * - Collapses multiple whitespace characters to a single space
 * - Removes common title suffixes like " | Outlet Name" or " - Source"
 */
export function normalizeTitle(title: string): string {
  if (!title) return "";

  let normalized = title.toLowerCase().trim();

  // Collapse whitespace
  normalized = normalized.replace(/\s+/g, " ");

  // Remove trailing " | X" or " - X" source attribution suffixes
  // (keep it simple: only strip if suffix > 3 chars to avoid false positives)
  const pipeIdx = normalized.lastIndexOf(" | ");
  if (pipeIdx > 0 && normalized.length - pipeIdx > 5) {
    normalized = normalized.slice(0, pipeIdx).trim();
  }

  return normalized;
}

// ─── URL normalization ────────────────────────────────────────────────────────

/** Known tracking query parameters to remove */
const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "fbclid",
  "gclid",
  "msclkid",
  "yclid",
  "_ga",
  "_gl",
  "ref",
  "referrer",
  "mc_cid",
  "mc_eid",
  "igshid",
  "s_cid",
  "ncid",
  "cmpid",
  "WT.mc_id",
  "ocid",
]);

/**
 * Normalize a URL by:
 * - Lowercasing the scheme and hostname
 * - Removing common tracking query parameters
 * - Removing trailing slashes from paths (except root)
 * - Removing the fragment/hash
 *
 * Note: Does not follow redirects (that would require a network call).
 */
export function normalizeUrl(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    // Not a valid URL — return as-is
    return url;
  }

  // Lowercase scheme + host
  parsed.protocol = parsed.protocol.toLowerCase();
  parsed.hostname = parsed.hostname.toLowerCase();

  // Remove tracking params
  for (const key of TRACKING_PARAMS) {
    parsed.searchParams.delete(key);
  }

  // Remove fragment
  parsed.hash = "";

  // Normalize path: remove trailing slash unless it's the root
  if (parsed.pathname.length > 1 && parsed.pathname.endsWith("/")) {
    parsed.pathname = parsed.pathname.slice(0, -1);
  }

  return parsed.toString();
}

// ─── Snippet extraction ───────────────────────────────────────────────────────

/**
 * Extract a leading snippet from a text string.
 * Tries to break at a sentence boundary (period, !, ?) within the last 20%
 * of the max length to avoid cutting mid-sentence.
 */
export function extractSnippet(text: string, maxLength: number = 500): string {
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;

  const hard = trimmed.slice(0, maxLength);

  // Try to find a sentence boundary in the last quarter
  const searchFrom = Math.floor(maxLength * 0.75);
  const sentenceEnd = hard.search(/[.!?]\s+\S/);
  if (sentenceEnd >= searchFrom) {
    return hard.slice(0, sentenceEnd + 1).trim();
  }

  // Fall back to word boundary
  const lastSpace = hard.lastIndexOf(" ");
  return lastSpace > searchFrom
    ? hard.slice(0, lastSpace).trim() + "…"
    : hard.trim() + "…";
}

// ─── Language detection ───────────────────────────────────────────────────────

/**
 * Basic heuristic language detection based on common high-frequency words.
 *
 * This is intentionally simple and only covers a handful of languages.
 * For production-quality detection, integrate a library like `franc` or
 * a cloud language detection API.
 *
 * Returns a BCP-47 language code or "und" (undetermined) if not confident.
 */
export function detectLanguage(text: string): string {
  if (!text || text.trim().length < 20) return "und";

  const lower = text.toLowerCase();
  const words = lower.match(/\b[a-zàâäèêëîïôùûüæœç]+\b/g) ?? [];
  const total = words.length;
  if (total === 0) return "und";

  // Common stopwords per language
  const profiles: Array<{ code: string; words: string[] }> = [
    {
      code: "en",
      words: ["the", "and", "of", "to", "in", "is", "it", "that", "was", "for"],
    },
    {
      code: "fr",
      words: ["le", "la", "les", "de", "du", "des", "et", "en", "un", "une"],
    },
    {
      code: "de",
      words: ["der", "die", "das", "und", "ist", "in", "zu", "den", "mit", "von"],
    },
    {
      code: "es",
      words: ["el", "la", "los", "de", "que", "en", "un", "con", "una", "por"],
    },
    {
      code: "pt",
      words: ["de", "do", "da", "que", "em", "para", "com", "uma", "um", "no"],
    },
    {
      code: "it",
      words: ["il", "di", "che", "la", "un", "del", "le", "si", "una", "per"],
    },
  ];

  const wordSet = new Set(words);
  const scores = profiles.map(({ code, words: stopwords }) => {
    const hits = stopwords.filter((w) => wordSet.has(w)).length;
    return { code, score: hits / stopwords.length };
  });

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];

  // Require at least 30% stopword coverage to be confident
  return best.score >= 0.3 ? best.code : "und";
}
