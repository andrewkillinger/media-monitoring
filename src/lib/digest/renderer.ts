import type { DigestData, DigestSection, DigestSubsection, DigestItem } from "./types";
import { formatArticleDate, formatDigestDate } from "../utils/dates";

function toDateString(date: Date | string | null | undefined): string {
  if (!date) return "";
  return typeof date === "string" ? date : date.toISOString();
}

function toPublishedAtString(publishedAt: Date | string | null | undefined): string {
  if (!publishedAt) return "";
  return typeof publishedAt === "string" ? publishedAt : publishedAt.toISOString();
}

// ─── HTML renderer ────────────────────────────────────────────────────────────

/**
 * Render a digest as a complete, email-safe HTML document.
 *
 * Uses inline styles throughout for maximum email client compatibility.
 * Safe for use with SendGrid, Outlook, Gmail, etc.
 */
export function renderDigestHtml(digest: DigestData): string {
  const sectionLinks = digest.sections
    .filter((s) => s.hasItems)
    .map(
      (s) =>
        `<a href="#section-${s.section.slug}" style="color:#0066CC;text-decoration:none;margin-right:16px;">${escapeHtml(s.section.name)}</a>`
    )
    .join("");

  const sectionsHtml = digest.sections.map(renderSectionHtml).join("\n");

  const overviewHtml = digest.overview
    ? `<p style="font-family:Arial,sans-serif;font-size:14px;color:#333333;line-height:1.6;margin:0 0 24px 0;">${escapeHtml(digest.overview)}</p>`
    : "";

  const digestDateStr = toDateString(digest.date);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Acadia Media Monitor – ${escapeHtml(formatDigestDate(digestDateStr))}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <!-- Container -->
        <table role="presentation" width="680" cellpadding="0" cellspacing="0" style="max-width:680px;width:100%;background-color:#ffffff;border-radius:4px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#1a2b4a;padding:24px 32px;">
              <h1 style="margin:0;font-family:Arial,sans-serif;font-size:22px;font-weight:bold;color:#ffffff;">
                Acadia Media Monitor
              </h1>
              <p style="margin:8px 0 0 0;font-family:Arial,sans-serif;font-size:14px;color:#aabbcc;">
                Media Monitoring Digest &mdash; ${escapeHtml(formatDigestDate(digestDateStr))}
              </p>
            </td>
          </tr>

          <!-- Jump links -->
          ${sectionLinks ? `
          <tr>
            <td style="background-color:#f0f4f8;padding:12px 32px;border-bottom:1px solid #e0e0e0;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#555555;">
                Jump to: ${sectionLinks}
              </p>
            </td>
          </tr>` : ""}

          <!-- Overview -->
          ${overviewHtml ? `<tr><td style="padding:24px 32px 0;">${overviewHtml}</td></tr>` : ""}

          <!-- Sections -->
          <tr>
            <td style="padding:16px 32px 32px;">
              ${sectionsHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f0f4f8;padding:16px 32px;border-top:1px solid #e0e0e0;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#888888;">
                Coverage: ${escapeHtml(formatArticleDate(toDateString(digest.coverageStart)))} &ndash; ${escapeHtml(formatArticleDate(toDateString(digest.coverageEnd)))}
                &nbsp;&bull;&nbsp; ${digest.totalItems} articles
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderSectionHtml(section: DigestSection): string {
  const slug = section.section.slug;
  const sectionName = escapeHtml(section.section.name);

  const itemsHtml = (section.items ?? []).map(renderItemHtml).join("\n");

  const subsectionsHtml = section.subsections
    .map((sub) => renderSubsectionHtml(sub))
    .join("\n");

  const emptyHtml =
    !section.hasItems
      ? `<p style="font-family:Arial,sans-serif;font-size:13px;color:#999999;font-style:italic;margin:0 0 8px 0;">No relevant news to report.</p>`
      : "";

  return `
<!-- Section: ${sectionName} -->
<div id="section-${slug}" style="margin-top:28px;">
  <h2 style="font-family:Arial,sans-serif;font-size:16px;font-weight:bold;color:#1a2b4a;margin:0 0 4px 0;padding-bottom:8px;border-bottom:2px solid #1a2b4a;">
    ${sectionName}
  </h2>
  ${emptyHtml}
  ${itemsHtml}
  ${subsectionsHtml}
</div>`;
}

function renderSubsectionHtml(sub: DigestSubsection): string {
  if (!sub.subsection) return "";
  const name = escapeHtml(sub.subsection.name);
  const itemsHtml = sub.items.map(renderItemHtml).join("\n");

  const emptyHtml =
    sub.items.length === 0
      ? `<p style="font-family:Arial,sans-serif;font-size:13px;color:#999999;font-style:italic;margin:0 0 4px 0;">No relevant news to report.</p>`
      : "";

  return `
  <div style="margin-top:16px;padding-left:12px;border-left:3px solid #e0e0e0;">
    <h3 style="font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:#444444;margin:0 0 8px 0;">
      ${name}
    </h3>
    ${emptyHtml}
    ${itemsHtml}
  </div>`;
}

function renderItemHtml(item: DigestItem): string {
  const outlet = escapeHtml(item.outletName);
  const date = item.publishedAt ? escapeHtml(formatArticleDate(toPublishedAtString(item.publishedAt))) : "";
  const headline = escapeHtml(item.headline);
  const snippet = item.snippet ? escapeHtml(item.snippet) : "";

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
    <tr>
      <td style="padding:10px 12px;background-color:#f9f9f9;border-left:3px solid #0066CC;border-radius:2px;">
        <p style="margin:0 0 4px 0;font-family:Arial,sans-serif;font-size:12px;color:#777777;">
          ${outlet}${date ? ` &bull; ${date}` : ""}
        </p>
        <p style="margin:0 0 4px 0;">
          <a href="${escapeHtml(item.url)}" style="font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:#0066CC;text-decoration:none;">
            ${headline}
          </a>
        </p>
        ${snippet ? `<p style="margin:4px 0 0 0;font-family:Arial,sans-serif;font-size:12px;color:#555555;line-height:1.5;">${snippet}</p>` : ""}
      </td>
    </tr>
  </table>`;
}

// ─── Markdown renderer ────────────────────────────────────────────────────────

/**
 * Render a digest as a Markdown string.
 * Useful for Slack notifications, internal wikis, or plain-text email fallback.
 */
export function renderDigestMarkdown(digest: DigestData): string {
  const lines: string[] = [];
  const digestDateStr = toDateString(digest.date);

  lines.push(`# Acadia Media Monitor — ${formatDigestDate(digestDateStr)}`);
  lines.push("");
  lines.push(
    `> Coverage: ${formatArticleDate(toDateString(digest.coverageStart))} – ${formatArticleDate(toDateString(digest.coverageEnd))} | ${digest.totalItems} articles`
  );
  lines.push("");

  if (digest.overview) {
    lines.push(digest.overview);
    lines.push("");
  }

  // Table of contents
  const tocSections = digest.sections.filter((s: DigestSection) => s.hasItems);
  if (tocSections.length > 0) {
    lines.push("## Contents");
    lines.push("");
    for (const s of tocSections) {
      lines.push(`- [${s.section.name}](#${s.section.slug})`);
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  for (const section of digest.sections) {
    lines.push(`## ${section.section.name}`);
    lines.push("");

    if (!section.hasItems) {
      lines.push("_No relevant news to report._");
      lines.push("");
      continue;
    }

    // Direct items
    for (const item of (section.items ?? [])) {
      lines.push(renderItemMarkdown(item));
    }

    // Subsections
    for (const sub of section.subsections) {
      lines.push(`### ${sub.subsection?.name ?? ""}`);
      lines.push("");

      if (sub.items.length === 0) {
        lines.push("_No relevant news to report._");
        lines.push("");
        continue;
      }

      for (const item of sub.items) {
        lines.push(renderItemMarkdown(item));
      }
    }
  }

  return lines.join("\n").trimEnd();
}

function renderItemMarkdown(item: DigestItem): string {
  const outlet = item.outletName;
  const date = item.publishedAt ? formatArticleDate(toPublishedAtString(item.publishedAt)) : "";
  const meta = [outlet, date].filter(Boolean).join(" · ");

  // Use snippet as the linked anchor text; if absent, derive from the
  // last few words of the headline so the link text is concise.
  const linkText = item.snippet ?? extractHeadlineTail(item.headline);

  const lines = [
    `**${item.headline}**`,
    `[${linkText}](${item.url})`,
    meta ? `_${meta}_` : "",
    "",
  ];

  return lines.filter((l) => l !== undefined).join("  \n") + "\n";
}

/**
 * Extract the last meaningful phrase from a headline for use as a short link
 * anchor text (≈ last 2 words).
 */
function extractHeadlineTail(headline: string): string {
  const words = headline.trim().split(/\s+/);
  return words.slice(-2).join(" ");
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
