import type { SourceAdapter, AdapterConfig, FetchResult, RawItem, ValidationResult } from "./types";
import { AdapterError } from "./types";

/**
 * File upload adapter.
 *
 * This adapter handles the metadata side of file uploads. Actual file storage
 * is managed by Supabase Storage; this adapter creates a RawItem record that
 * references the uploaded file via its storage path.
 *
 * Expected settings:
 *   - storagePath:  string  — path in Supabase Storage bucket
 *   - fileName:     string  — original file name
 *   - fileType:     string  — MIME type, e.g. "application/pdf"
 *   - fileSizeBytes: number — byte size of the uploaded file
 *   - articleTitle: string  — title to assign to the article
 *   - outletName:   string  — outlet / publication name
 *   - publishedAt:  string  — ISO 8601 publish date
 *   - author:       string  — author name
 *   - language:     string  — BCP-47 language code (default "en")
 *   - region:       string  — geographic region
 *   - isFullText:   boolean — whether this file contains the full article text
 *   - bodyText:     string  — extracted/pasted text content (optional)
 */
export class FileUploadAdapter implements SourceAdapter {
  readonly type = "file_upload" as const;
  readonly displayName = "File Upload";

  async fetch(config: AdapterConfig, _cursor?: string): Promise<FetchResult> {
    const startedAt = Date.now();

    const errs = this.validate(config);
    if (errs.length > 0) {
      throw new AdapterError(errs.join("; "), this.type);
    }

    const storagePath = config.settings.storagePath as string;
    const fileName = config.settings.fileName as string;
    const fileType = (config.settings.fileType as string | undefined) ?? null;
    const fileSizeBytes =
      (config.settings.fileSizeBytes as number | undefined) ?? null;
    const articleTitle =
      (config.settings.articleTitle as string | undefined) ?? fileName;
    const outletName =
      (config.settings.outletName as string | undefined) ?? null;
    const publishedAt =
      (config.settings.publishedAt as string | undefined) ?? null;
    const author = (config.settings.author as string | undefined) ?? null;
    const language =
      (config.settings.language as string | undefined) ?? "en";
    const region = (config.settings.region as string | undefined) ?? null;
    const isFullText =
      (config.settings.isFullText as boolean | undefined) ?? false;
    const bodyText =
      (config.settings.bodyText as string | undefined) ?? null;

    // Use storagePath as the external ID to prevent duplicate imports
    const externalId = `file-upload:${storagePath}`;

    // Build a pseudo-URL pointing at the Supabase Storage object
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const url = supabaseUrl
      ? `${supabaseUrl}/storage/v1/object/public/attachments/${storagePath}`
      : `file-upload://${storagePath}`;

    const item: RawItem = {
      externalId,
      url,
      title: articleTitle,
      author,
      outletName,
      publishedAt,
      bodyText,
      bodyHtml: null,
      language,
      region,
      mediaType: deriveMediaType(fileType),
      metadata: {
        storagePath,
        fileName,
        fileType,
        fileSizeBytes,
        isFullText,
        uploadedViaAdapter: true,
      },
    };

    return {
      items: [item],
      cursor: null,
      metadata: {
        fetchedAt: new Date(startedAt).toISOString(),
        durationMs: Date.now() - startedAt,
      },
    };
  }

  validate(config: AdapterConfig): ValidationResult {
    const errs: string[] = [];

    if (
      !config.settings.storagePath ||
      typeof config.settings.storagePath !== "string"
    ) {
      errs.push("settings.storagePath is required");
    }

    if (
      !config.settings.fileName ||
      typeof config.settings.fileName !== "string"
    ) {
      errs.push("settings.fileName is required");
    }

    if (
      config.settings.publishedAt &&
      isNaN(Date.parse(config.settings.publishedAt as string))
    ) {
      errs.push("settings.publishedAt must be a valid date string");
    }

    return { valid: errs.length === 0, errors: errs.length > 0 ? errs : undefined };
  }
}

function deriveMediaType(mimeType: string | null | undefined): string {
  if (!mimeType) return "document";

  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("text/")) return "document";
  if (mimeType.includes("word") || mimeType.includes("document"))
    return "document";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
    return "spreadsheet";

  return "document";
}
