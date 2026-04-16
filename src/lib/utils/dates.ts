import {
  format,
  formatDistanceToNow,
  parseISO,
  isValid,
  addBusinessDays,
  addDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  subHours,
  differenceInMinutes,
} from "date-fns";

// ─── Date formatting ──────────────────────────────────────────────────────────

/**
 * Format a date as a short article timestamp.
 * Example: "Apr 16, 2026" or "Apr 16, 2026, 2:30 PM"
 */
export function formatArticleDate(
  date: string | Date | null | undefined,
  includeTime = false
): string {
  if (!date) return "";

  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return typeof date === "string" ? date : "";

  return includeTime ? format(d, "MMM d, yyyy, h:mm aa") : format(d, "MMM d, yyyy");
}

/**
 * Format a date for digest headers.
 * Example: "Thursday, April 16, 2026"
 */
export function formatDigestDate(
  date: string | Date | null | undefined
): string {
  if (!date) return "";

  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return typeof date === "string" ? date : "";

  return format(d, "EEEE, MMMM d, yyyy");
}

/**
 * Return a human-readable relative time string.
 * Example: "2 hours ago", "3 days ago"
 */
export function formatRelativeDate(
  date: string | Date | null | undefined
): string {
  if (!date) return "";

  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "";

  return formatDistanceToNow(d, { addSuffix: true });
}

// ─── Time window checks ───────────────────────────────────────────────────────

/**
 * Check whether an article's publish date falls within the cutoff window.
 *
 * @param publishedAt    ISO 8601 timestamp or Date
 * @param cutoffMinutes  Maximum age in minutes
 * @returns true if the article is within the cutoff window
 */
export function isWithinCutoff(
  publishedAt: string | Date | null | undefined,
  cutoffMinutes: number
): boolean {
  if (!publishedAt) return false;

  const d = typeof publishedAt === "string" ? parseISO(publishedAt) : publishedAt;
  if (!isValid(d)) return false;

  const ageMinutes = differenceInMinutes(new Date(), d);
  return ageMinutes <= cutoffMinutes;
}

// ─── Business day calculation ─────────────────────────────────────────────────

/**
 * Return the next business day (Mon–Fri) after the given date.
 * If date is Friday, returns Monday. Weekends are skipped.
 */
export function getNextBusinessDay(date: Date | string): Date {
  const d = typeof date === "string" ? parseISO(date) : new Date(date);
  // addBusinessDays(date, 1) skips weekends
  return addBusinessDays(d, 1);
}

// ─── Coverage window calculation ─────────────────────────────────────────────

export interface CoverageWindow {
  start: Date;
  end: Date;
}

/**
 * Calculate the coverage window for a given schedule type and reference date.
 *
 * Schedule types:
 *   - "daily_newsletter"    : previous calendar day (midnight to midnight)
 *   - "milestone_eod"       : same calendar day
 *   - "milestone_morning"   : same calendar day up to now
 *   - "ad_hoc"              : rolling 24-hour window ending now
 *   - "quarterly"           : current calendar quarter
 *   - "annual"              : current calendar year
 */
export function getCoverageWindow(
  scheduleType: string,
  date: Date | string = new Date()
): CoverageWindow {
  const ref = typeof date === "string" ? parseISO(date) : new Date(date);

  switch (scheduleType) {
    case "daily_newsletter": {
      const yesterday = subDays(ref, 1);
      return {
        start: startOfDay(yesterday),
        end: endOfDay(yesterday),
      };
    }

    case "milestone_eod": {
      return {
        start: startOfDay(ref),
        end: endOfDay(ref),
      };
    }

    case "milestone_morning": {
      return {
        start: startOfDay(ref),
        end: ref,
      };
    }

    case "ad_hoc": {
      return {
        start: subHours(ref, 24),
        end: ref,
      };
    }

    case "quarterly": {
      const month = ref.getMonth();
      const quarterStartMonth = Math.floor(month / 3) * 3;
      const quarterStart = new Date(ref.getFullYear(), quarterStartMonth, 1);
      const quarterEnd = new Date(ref.getFullYear(), quarterStartMonth + 3, 0);
      return {
        start: startOfDay(quarterStart),
        end: endOfDay(quarterEnd),
      };
    }

    case "annual": {
      const yearStart = new Date(ref.getFullYear(), 0, 1);
      const yearEnd = new Date(ref.getFullYear(), 11, 31);
      return {
        start: startOfDay(yearStart),
        end: endOfDay(yearEnd),
      };
    }

    default: {
      // Default to current day
      return {
        start: startOfDay(ref),
        end: endOfDay(ref),
      };
    }
  }
}

// ─── Misc helpers ─────────────────────────────────────────────────────────────

/**
 * Parse a date string safely; returns null if invalid.
 */
export function parseDateSafe(
  value: string | null | undefined
): Date | null {
  if (!value) return null;
  const d = parseISO(value);
  return isValid(d) ? d : null;
}

/**
 * Convert a Date to an ISO date string (YYYY-MM-DD) in UTC.
 */
export function toIsoDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
