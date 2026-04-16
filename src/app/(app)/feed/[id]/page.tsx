"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { demoArticles } from "@/lib/demo-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
  Lock,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  XCircle,
  MessageCircle,
} from "lucide-react";

const channelColors: Record<string, string> = {
  online: "bg-sky-100 text-sky-700 border-sky-200",
  social: "bg-violet-100 text-violet-700 border-violet-200",
  print: "bg-amber-100 text-amber-700 border-amber-200",
  broadcast: "bg-orange-100 text-orange-700 border-orange-200",
  wire: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const sentimentColors: Record<string, string> = {
  positive: "bg-emerald-100 text-emerald-700 border-emerald-200",
  negative: "bg-red-100 text-red-700 border-red-200",
  neutral: "bg-gray-100 text-gray-600 border-gray-200",
};

const flagSeverityColors: Record<string, string> = {
  high: "bg-red-50 border-red-300 text-red-800",
  medium: "bg-amber-50 border-amber-300 text-amber-800",
  low: "bg-blue-50 border-blue-300 text-blue-800",
};

const priorityBarColor = (p: number) => {
  if (p >= 80) return "bg-red-500";
  if (p >= 60) return "bg-amber-500";
  if (p >= 40) return "bg-sky-500";
  return "bg-gray-300";
};

function InlineTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const article = demoArticles.find((a) => a.id === id);

  const [reviewNote, setReviewNote] = useState("");
  const [reviewAction, setReviewAction] = useState<"approved" | "rejected" | null>(null);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-lg font-semibold text-[var(--foreground)]">Article not found</p>
        <p className="text-sm text-[var(--muted-foreground)]">
          No article with ID &quot;{id}&quot; exists in the coverage feed.
        </p>
        <Link href="/feed">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Feed
          </Button>
        </Link>
      </div>
    );
  }

  const handleReview = (action: "approved" | "rejected") => {
    setReviewAction(action);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/feed"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Coverage Feed
      </Link>

      {/* Main article card */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Paywall indicator */}
          {article.isPaywalled && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              <Lock className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Paywalled content — full text may not be available without subscription.</span>
            </div>
          )}

          {/* Headline */}
          <div>
            <h1 className="text-xl font-bold leading-snug text-[var(--foreground)]">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-[var(--muted-foreground)]">
              <span className="font-medium text-[var(--foreground)]">{article.outlet}</span>
              <span>·</span>
              <span>{article.date}</span>
              <span>·</span>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[var(--primary)] hover:underline"
              >
                View Source
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            <InlineTag className={channelColors[article.channel] ?? "bg-gray-100 text-gray-600 border-gray-200"}>
              {article.channel}
            </InlineTag>
            <InlineTag className="bg-[var(--muted)] text-[var(--foreground)] border-[var(--border)]">
              {article.region}
            </InlineTag>
            <InlineTag className="bg-[var(--muted)] text-[var(--foreground)] border-[var(--border)]">
              {article.language.toUpperCase()}
            </InlineTag>
            <InlineTag
              className={
                article.status === "published"
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                  : article.status === "reviewed"
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : article.status === "classified"
                  ? "bg-purple-100 text-purple-700 border-purple-200"
                  : article.status === "excluded"
                  ? "bg-red-100 text-red-700 border-red-200"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }
            >
              {article.status}
            </InlineTag>
            <InlineTag className={sentimentColors[article.sentiment] ?? "bg-gray-100 text-gray-600 border-gray-200"}>
              {article.sentiment}
            </InlineTag>
          </div>

          {/* Section */}
          <div className="text-sm">
            <span className="font-medium text-[var(--muted-foreground)] uppercase tracking-wider text-xs">
              Section
            </span>
            <p className="mt-0.5 text-[var(--foreground)]">
              {article.section}
              {article.subsection && (
                <span className="text-[var(--muted-foreground)]"> / {article.subsection}</span>
              )}
            </p>
          </div>

          {/* Entities */}
          {article.entities.length > 0 && (
            <div>
              <span className="font-medium text-[var(--muted-foreground)] uppercase tracking-wider text-xs">
                Entities
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {article.entities.map((entity) => (
                  <Badge key={entity} variant="secondary" className="text-xs">
                    {entity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Priority score */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-[var(--muted-foreground)] uppercase tracking-wider text-xs">
                Priority Score
              </span>
              <span
                className={cn(
                  "text-sm font-bold tabular-nums",
                  article.priority >= 80
                    ? "text-red-600"
                    : article.priority >= 60
                    ? "text-amber-600"
                    : "text-[var(--muted-foreground)]"
                )}
              >
                {article.priority}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--muted)] overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", priorityBarColor(article.priority))}
                style={{ width: `${article.priority}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flag alert box */}
      {article.flagType && article.flagSeverity && (
        <div
          className={cn(
            "flex gap-3 rounded-[var(--radius-lg)] border p-4",
            flagSeverityColors[article.flagSeverity] ?? "bg-gray-50 border-gray-200 text-gray-800"
          )}
        >
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">
              Flag:{" "}
              {article.flagType
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
              <span className="text-xs font-normal opacity-70">
                (severity: {article.flagSeverity})
              </span>
            </p>
            <p className="text-xs opacity-80">
              This article has been flagged for immediate attention. Review and resolve
              before the next newsletter cycle.
            </p>
          </div>
        </div>
      )}

      {/* Exclusion reason */}
      {article.exclusionReason && (
        <div className="flex gap-3 rounded-[var(--radius-lg)] border border-red-200 bg-red-50 p-4 text-red-800">
          <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">Excluded</p>
            <p className="text-xs mt-0.5 opacity-80">{article.exclusionReason}</p>
          </div>
        </div>
      )}

      {/* Social metadata */}
      {article.socialMeta && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-sky-500" />
              Social Metadata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-medium">
                  Handle
                </p>
                <p className="mt-0.5 font-medium">{article.socialMeta.handle}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-medium">
                  Display Name
                </p>
                <p className="mt-0.5">{article.socialMeta.displayName}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-medium">
                  Followers
                </p>
                <p className="mt-0.5 tabular-nums font-semibold">
                  {article.socialMeta.followers.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-medium">
                  Engagement
                </p>
                <p className="mt-0.5 tabular-nums">
                  <span className="text-rose-600 font-medium">{article.socialMeta.likes} likes</span>
                  {" · "}
                  <span className="text-sky-600 font-medium">{article.socialMeta.retweets} RT</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review panel */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Review Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reviewAction ? (
            <div
              className={cn(
                "flex items-center gap-3 rounded-md border p-3 text-sm font-medium",
                reviewAction === "approved"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              )}
            >
              {reviewAction === "approved" ? (
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 flex-shrink-0" />
              )}
              Article marked as{" "}
              <span className="capitalize font-bold">{reviewAction}</span>.
              {reviewNote && (
                <span className="text-xs opacity-70 ml-1">Note saved.</span>
              )}
              <button
                onClick={() => setReviewAction(null)}
                className="ml-auto text-xs underline opacity-60 hover:opacity-100"
              >
                Undo
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                  Review Notes
                </label>
                <Textarea
                  className="mt-1.5"
                  placeholder="Add notes about this article's coverage, sensitivity, or follow-up actions..."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleReview("approved")}
                  className="gap-1.5"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleReview("rejected")}
                  className="gap-1.5"
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                  Reject
                </Button>
                <span className="text-xs text-[var(--muted-foreground)] ml-auto">
                  {article.reviewStatus === "needs_review" && (
                    <span className="text-orange-600 font-medium">Needs review</span>
                  )}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
