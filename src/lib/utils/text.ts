// ─── HTML stripping ───────────────────────────────────────────────────────────

/**
 * Strip all HTML tags from a string, converting common HTML entities
 * and collapsing whitespace.
 */
export function stripHtml(html: string): string {
  if (!html) return "";

  return html
    // Remove <style> and <script> blocks entirely
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    // Convert <br>, <p>, <div>, <li> to newlines for readability
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|div|li|tr|blockquote|h[1-6])[^>]*>/gi, "\n")
    // Strip all remaining tags
    .replace(/<[^>]+>/g, "")
    // Decode common HTML entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) =>
      String.fromCharCode(parseInt(code, 10))
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    // Normalize whitespace
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ─── Truncation ───────────────────────────────────────────────────────────────

/**
 * Truncate a string to the specified maximum length, appending an ellipsis
 * if truncation occurs.
 *
 * By default, breaks at a word boundary to avoid cutting mid-word.
 */
export function truncate(
  text: string,
  maxLength: number,
  options: { ellipsis?: string; wordBoundary?: boolean } = {}
): string {
  const { ellipsis = "…", wordBoundary = true } = options;

  if (!text || text.length <= maxLength) return text;

  const cutPoint = maxLength - ellipsis.length;
  if (cutPoint <= 0) return ellipsis.slice(0, maxLength);

  let cut = text.slice(0, cutPoint);

  if (wordBoundary) {
    const lastSpace = cut.lastIndexOf(" ");
    if (lastSpace > cutPoint * 0.75) {
      cut = cut.slice(0, lastSpace);
    }
  }

  return cut + ellipsis;
}

// ─── Regex escaping ───────────────────────────────────────────────────────────

/**
 * Escape all regex special characters in a string so it can be safely used
 * as a literal pattern inside a RegExp constructor.
 *
 * Escapes: \ ^ $ . | ? * + ( ) [ ] { }
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── Whitespace normalization ─────────────────────────────────────────────────

/**
 * Normalize all whitespace in a string:
 * - Convert tabs, form feeds, and non-breaking spaces to regular spaces
 * - Collapse multiple spaces to a single space
 * - Trim leading and trailing whitespace
 */
export function normalizeWhitespace(str: string): string {
  if (!str) return "";

  return str
    .replace(/[\t\f\r\u00a0\u2000-\u200b\u202f\u205f\u3000]/g, " ")
    .replace(/ {2,}/g, " ")
    .trim();
}

// ─── Slug generation ──────────────────────────────────────────────────────────

/**
 * Generate a URL-safe slug from a text string.
 *
 * - Converts to lowercase
 * - Replaces accented characters with ASCII equivalents
 * - Replaces non-alphanumeric characters with hyphens
 * - Collapses multiple hyphens
 * - Trims leading/trailing hyphens
 *
 * @example
 * generateSlug("Alzheimer's Disease & Related") // "alzheimers-disease-related"
 */
export function generateSlug(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    // Decompose accented characters (NFD) then strip combining marks
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Replace apostrophes / special quote characters
    .replace(/[''`]/g, "")
    // Replace non-alphanumeric with hyphens
    .replace(/[^a-z0-9]+/g, "-")
    // Collapse multiple hyphens
    .replace(/-{2,}/g, "-")
    // Trim hyphens from start/end
    .replace(/^-+|-+$/g, "");
}

// ─── Misc helpers ─────────────────────────────────────────────────────────────

/**
 * Count the number of words in a string.
 */
export function wordCount(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Convert a string to title case.
 * Lowercases common articles and prepositions.
 */
export function toTitleCase(str: string): string {
  const lower = new Set([
    "a", "an", "the", "and", "but", "or", "for", "nor", "on", "at",
    "to", "by", "in", "of", "up", "as", "is", "vs", "via",
  ]);

  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word, i) => {
      if (i === 0 || !lower.has(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(" ");
}

/**
 * Remove a UTF-8 BOM from the start of a string (common in CSV files).
 */
export function stripBom(str: string): string {
  return str.startsWith("\uFEFF") ? str.slice(1) : str;
}
