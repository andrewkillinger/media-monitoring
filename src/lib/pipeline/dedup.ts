import type { ArticleRow } from "../supabase/types";
import { normalizeTitle } from "./normalize";

/**
 * Normalize text for deduplication comparison.
 * Alias for normalizeTitle — exported separately so tests can import it directly.
 */
export function normalizeForDedup(text: string): string {
  return normalizeTitle(text);
}

// ─── URL deduplication ────────────────────────────────────────────────────────

/**
 * Check whether a URL hash already exists in the provided set.
 * The URL hash is a SHA-256 hex digest computed by the database; this
 * function compares pre-computed hashes.
 */
export function isDuplicateByUrl(
  urlHash: string,
  existingHashes: Set<string>
): boolean {
  return existingHashes.has(urlHash);
}

// ─── Title similarity ─────────────────────────────────────────────────────────

/**
 * Compute Jaccard similarity between two strings, tokenised into word sets.
 *
 * Jaccard = |intersection| / |union|
 * Returns a value between 0 (completely different) and 1 (identical).
 */
export function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(tokenize(a));
  const setB = new Set(tokenize(b));

  if (setA.size === 0 && setB.size === 0) return 1;
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const word of setA) {
    if (setB.has(word)) intersection++;
  }

  const union = setA.size + setB.size - intersection;
  return intersection / union;
}

/**
 * Check whether two article titles are similar enough to be considered
 * syndicated copies of the same story.
 *
 * @param title1    First article title (already normalized recommended)
 * @param title2    Second article title
 * @param threshold Minimum Jaccard similarity (default 0.7)
 */
export function isSimilarTitle(
  title1: string,
  title2: string,
  threshold: number = 0.7
): boolean {
  const n1 = normalizeTitle(title1);
  const n2 = normalizeTitle(title2);

  // Exact match
  if (n1 === n2) return true;

  // Short titles are unreliable for fuzzy matching
  if (n1.length < 15 || n2.length < 15) return n1 === n2;

  return jaccardSimilarity(n1, n2) >= threshold;
}

// ─── Cluster detection ────────────────────────────────────────────────────────

export interface ClusterCandidate {
  id: string;
  cluster_id: string | null;
  title: string;
  title_normalized: string | null;
  published_at: string | null;
  outlet_name_raw: string | null;
}

export interface ClusterMatch {
  clusterId: string | null;
  primaryArticleId: string;
  similarity: number;
}

/**
 * Find the best cluster match for a new article among existing articles.
 *
 * A cluster is considered a match when:
 * 1. Title similarity ≥ threshold, AND
 * 2. Articles were published within the time window (default 72h)
 *
 * Returns the closest matching cluster, or null if no match found.
 */
export function findCluster(
  article: Pick<ArticleRow, "title" | "title_normalized" | "published_at">,
  existingArticles: ClusterCandidate[],
  options: {
    similarityThreshold?: number;
    maxAgeHours?: number;
  } = {}
): ClusterMatch | null {
  const {
    similarityThreshold = 0.7,
    maxAgeHours = 72,
  } = options;

  const candidateTitle =
    article.title_normalized ?? normalizeTitle(article.title);
  const articleDate = article.published_at
    ? new Date(article.published_at)
    : null;

  let best: ClusterMatch | null = null;

  for (const existing of existingArticles) {
    const existingTitle =
      existing.title_normalized ?? normalizeTitle(existing.title);

    const similarity = jaccardSimilarity(candidateTitle, existingTitle);
    if (similarity < similarityThreshold) continue;

    // Check time proximity if both have publish dates
    if (articleDate && existing.published_at) {
      const existingDate = new Date(existing.published_at);
      const diffHours =
        Math.abs(articleDate.getTime() - existingDate.getTime()) / 3_600_000;
      if (diffHours > maxAgeHours) continue;
    }

    if (!best || similarity > best.similarity) {
      best = {
        clusterId: existing.cluster_id,
        primaryArticleId: existing.id,
        similarity,
      };
    }
  }

  return best;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Tokenize text into lowercase words, removing stop words and short tokens.
 */
const STOP_WORDS = new Set([
  "a", "an", "the", "in", "on", "at", "to", "of", "for", "and", "or",
  "but", "is", "are", "was", "were", "be", "been", "has", "have", "had",
  "it", "its", "this", "that", "by", "with", "as", "from",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}
