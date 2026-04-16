// Demo data for the Acadia Media Monitor UI
// Used when no Supabase connection is available

export interface DemoArticle {
  id: string;
  title: string;
  outlet: string;
  section: string;
  subsection: string | null;
  date: string;
  status: string;
  channel: string;
  region: string;
  language: string;
  url: string;
  priority: number;
  entities: string[];
  sentiment: string;
  reviewStatus?: string;
  isPaywalled?: boolean;
  flagType?: string;
  flagSeverity?: string;
  exclusionReason?: string;
  socialMeta?: { handle: string; displayName: string; followers: number; likes: number; retweets: number };
}

export const demoArticles: DemoArticle[] = [
  { id: "f001", title: "Rett syndrome study highlights potential for personalized treatments", outlet: "FirstWord Pharma", section: "Rett Syndrome", subsection: "Therapeutic", date: "2025-04-15", status: "published", channel: "online", region: "US", language: "en", url: "https://firstwordpharma.com/rett-personalized", priority: 65, entities: ["Rett Syndrome"], sentiment: "neutral" },
  { id: "f002", title: "New Study Reveals Diverse Effects of MECP2 Mutations", outlet: "Life Technology", section: "Rett Syndrome", subsection: "Therapeutic", date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "https://lifetechnology.com/mecp2", priority: 55, entities: ["Rett Syndrome", "MECP2"], sentiment: "neutral" },
  { id: "f003", title: "Minibrains Reveal Personalized Paths for Rett Syndrome", outlet: "Neuroscience News", section: "Rett Syndrome", subsection: "Therapeutic", date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "https://neurosciencenews.com/minibrains-rett", priority: 60, entities: ["Rett Syndrome"], sentiment: "positive" },
  { id: "f004", title: "Amneal Pharmaceuticals donates $2M to support Parkinson's disease patients", outlet: "Business in New Jersey Everyday", section: "Parkinson's Disease", subsection: "Competitor", date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "https://businessnj.com/amneal-parkinsons", priority: 45, entities: ["Amneal Pharmaceuticals", "Parkinson's Disease"], sentiment: "positive" },
  { id: "f005", title: "Tests Show Promise for Diagnosing Parkinson's and Dementia with Lewy Bodies", outlet: "Parkinson's Foundation", section: "Parkinson's Disease", subsection: "Therapeutic", date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "https://parkinson.org/diagnostic-tests", priority: 50, entities: ["Parkinson's Disease"], sentiment: "positive" },
  { id: "f006", title: "Alzheimer's Blood Tests: Most Patients Are Not Afraid to Know", outlet: "MedPage Today", section: "Alzheimer's Disease", subsection: "Therapeutic", date: "2025-04-15", status: "published", channel: "online", region: "US", language: "en", url: "https://medpagetoday.com/alzheimers-blood-tests", priority: 55, entities: ["Alzheimer's Disease"], sentiment: "neutral" },
  { id: "f007", title: "Ulixacaltamide NDA Accepted for Essential Tremor; PDUFA Date Set", outlet: "Neurology Advisor", section: "Essential Tremor", subsection: "Competitor", date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "https://neurologyadvisor.com/essential-tremor-nda", priority: 60, entities: ["Essential Tremor"], sentiment: "neutral" },
  { id: "f008", title: "Praxis Precision Medicines Shares Rise After FDA Accepts New Drug Application", outlet: "Market Screener", section: "Essential Tremor", subsection: "Competitor", date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "https://marketscreener.com/praxis-fda", priority: 50, entities: ["Essential Tremor", "Praxis Precision Medicine"], sentiment: "positive" },
  { id: "f009", title: "Novartis CEO joins Anthropic's board", outlet: "STAT News", section: "News of Interest", subsection: null, date: "2025-04-15", status: "published", channel: "online", region: "US", language: "en", url: "https://statnews.com/novartis-anthropic", priority: 70, entities: ["Novartis"], sentiment: "neutral" },
  { id: "f010", title: "Bill would force payers to apply DTC drug purchases to patient deductibles", outlet: "Fierce Healthcare", section: "News of Interest", subsection: null, date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "https://fiercehealthcare.com/dtc-deductibles", priority: 60, entities: [], sentiment: "neutral" },
  { id: "f011", title: "Congress returns to a packed health care agenda", outlet: "STAT News", section: "News of Interest", subsection: null, date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "https://statnews.com/congress-healthcare", priority: 55, entities: [], sentiment: "neutral" },
  { id: "f012", title: "FDA bolsters bespoke therapy framework with new draft safety guidelines", outlet: "BioSpace", section: "News of Interest", subsection: null, date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "https://biospace.com/fda-bespoke-therapy", priority: 50, entities: ["FDA"], sentiment: "neutral" },
  { id: "f014", title: "Acadia Pharmaceuticals reports strong Q1 2025 results with DAYBUE uptake exceeding expectations", outlet: "X / Twitter", section: "Acadia Corporate and Product News", subsection: null, date: "2025-04-15", status: "published", channel: "social", region: "US", language: "en", url: "https://x.com/pharma_analyst/status/123", priority: 40, entities: ["Acadia Pharmaceuticals", "DAYBUE"], sentiment: "positive", socialMeta: { handle: "@pharma_analyst", displayName: "Pharma Analyst", followers: 12500, likes: 45, retweets: 12 } },
  { id: "f015", title: "MECP2 Protein Folding in Rett Syndrome: A Structural Analysis", outlet: "Nature", section: "Rett Syndrome", subsection: "Therapeutic", date: "2025-04-13", status: "excluded", channel: "online", region: "US", language: "en", url: "https://nature.com/mecp2-folding", priority: 80, entities: ["Rett Syndrome"], sentiment: "neutral", exclusionReason: "Journal publication excluded per editorial policy" },
  { id: "f016", title: "Patient groups raise concerns about NUPLAZID side effect reporting", outlet: "Reuters", section: "Acadia Corporate and Product News", subsection: null, date: "2025-04-15", status: "reviewed", channel: "wire", region: "US", language: "en", url: "https://reuters.com/nuplazid-concerns", priority: 95, entities: ["Acadia Pharmaceuticals", "NUPLAZID"], sentiment: "negative", flagType: "negative_product", flagSeverity: "high" },
  { id: "f017", title: "Inside Acadia's Strategy for Rare Disease Dominance", outlet: "The Wall Street Journal", section: "Acadia Corporate and Product News", subsection: null, date: "2025-04-14", status: "reviewed", channel: "print", region: "US", language: "en", url: "https://wsj.com/acadia-rare-disease", priority: 85, entities: ["Acadia Pharmaceuticals"], sentiment: "positive", isPaywalled: true },
  { id: "f018", title: "New gene therapy approach shows early promise for Rett syndrome", outlet: "Endpoints News", section: "Rett Syndrome", subsection: "Therapeutic", date: "2025-04-15", status: "classified", channel: "online", region: "US", language: "en", url: "https://endpointsnews.com/gene-therapy-rett", priority: 70, entities: ["Rett Syndrome"], sentiment: "positive", reviewStatus: "needs_review" },
  { id: "f019", title: "CNBC discusses Acadia Pharmaceuticals pipeline potential", outlet: "CNBC", section: "Acadia Corporate and Product News", subsection: null, date: "2025-04-14", status: "published", channel: "broadcast", region: "US", language: "en", url: "https://cnbc.com/acadia-pipeline", priority: 75, entities: ["Acadia Pharmaceuticals", "DAYBUE", "NUPLAZID"], sentiment: "positive" },
  { id: "f020", title: "Rett syndrome families in Ontario advocate for expanded access", outlet: "The Globe and Mail", section: "Rett Syndrome", subsection: "Therapeutic", date: "2025-04-13", status: "published", channel: "print", region: "Canada", language: "en", url: "https://theglobeandmail.com/rett-ontario", priority: 55, entities: ["Rett Syndrome"], sentiment: "neutral" },
];

export const demoSections = [
  { name: "Overview / Summary", slug: "overview", active: true },
  { name: "Acadia Corporate and Product News", slug: "acadia-corporate", active: true },
  { name: "Rett Syndrome", slug: "rett-syndrome", active: true },
  { name: "Parkinson's Disease", slug: "parkinsons-disease", active: true },
  { name: "Schizophrenia", slug: "schizophrenia", active: true },
  { name: "Prader-Willi Syndrome", slug: "prader-willi-syndrome", active: true },
  { name: "Alzheimer's Disease", slug: "alzheimers-disease", active: true },
  { name: "Fragile X Syndrome", slug: "fragile-x-syndrome", active: true },
  { name: "News of Interest", slug: "news-of-interest", active: true },
  { name: "Lewy Body Dementia", slug: "lewy-body-dementia", active: false },
  { name: "Essential Tremor", slug: "essential-tremor", active: false },
  { name: "Major Depressive Disorder", slug: "major-depressive-disorder", active: false },
  { name: "Treatment-Resistant Depression", slug: "treatment-resistant-depression", active: false },
];

export const demoKpis = {
  totalItems: 142, included: 98, flagged: 7, acadiaMentions: 23,
  competitorItems: 31, socialItems: 8, broadcastItems: 4, pendingReview: 12,
};

export const demoVolumeData = Array.from({ length: 14 }, (_, i) => {
  const d = new Date("2025-04-02");
  d.setDate(d.getDate() + i);
  return {
    date: d.toISOString().split("T")[0],
    total: Math.floor(Math.random() * 15) + 5,
    acadia: Math.floor(Math.random() * 4),
    competitor: Math.floor(Math.random() * 6) + 1,
  };
});

export const demoSectionDistribution = [
  { section: "Rett Syndrome", count: 24 },
  { section: "Parkinson's", count: 18 },
  { section: "Alzheimer's", count: 15 },
  { section: "News of Interest", count: 22 },
  { section: "Acadia Corporate", count: 12 },
  { section: "Schizophrenia", count: 9 },
  { section: "Prader-Willi", count: 6 },
  { section: "Fragile X", count: 4 },
];

export const demoTopOutlets = [
  { name: "STAT News", count: 14, tier: "tier1" },
  { name: "Reuters", count: 11, tier: "tier1" },
  { name: "FiercePharma", count: 9, tier: "tier1" },
  { name: "Endpoints News", count: 8, tier: "tier1" },
  { name: "MedPage Today", count: 7, tier: "trade" },
  { name: "BioSpace", count: 6, tier: "trade" },
  { name: "Bloomberg", count: 5, tier: "tier1" },
  { name: "CNBC", count: 4, tier: "tier1" },
];

export const demoTopCompetitors = [
  { name: "Biogen", mentions: 8, disease: "Alzheimer's" },
  { name: "Bristol Myers Squibb", mentions: 7, disease: "Schizophrenia" },
  { name: "Neuren Pharmaceuticals", mentions: 5, disease: "Rett Syndrome" },
  { name: "Amneal Pharmaceuticals", mentions: 4, disease: "Parkinson's" },
  { name: "Soleno Therapeutics", mentions: 3, disease: "Prader-Willi" },
];

export const demoFlags = [
  { id: "fl1", articleId: "f016", title: "Negative NUPLAZID coverage from Reuters", headline: "Patient groups raise concerns about NUPLAZID side effect reporting", outlet: "Reuters", type: "negative_product", severity: "high" as const, status: "reviewing" as const, date: "2025-04-15", holdFromNewsletter: true, notes: "Patient groups raising safety concerns. Monitor for follow-up coverage." },
  { id: "fl2", articleId: "f007", title: "Essential Tremor NDA acceptance", headline: "Ulixacaltamide NDA Accepted for Essential Tremor; PDUFA Date Set", outlet: "Neurology Advisor", type: "competitor_milestone", severity: "medium" as const, status: "sent" as const, date: "2025-04-14", holdFromNewsletter: false, notes: "Competitive intelligence: ulixacaltamide NDA accepted by FDA." },
  { id: "fl3", articleId: "f019", title: "CNBC Acadia pipeline discussion", headline: "CNBC discusses Acadia Pharmaceuticals pipeline potential", outlet: "CNBC", type: "acadia_earned", severity: "low" as const, status: "resolved" as const, date: "2025-04-14", holdFromNewsletter: false, notes: "Positive broadcast coverage." },
  { id: "fl4", articleId: "f017", title: "WSJ Acadia rare disease strategy", headline: "Inside Acadia's Strategy for Rare Disease Dominance", outlet: "The Wall Street Journal", type: "acadia_earned", severity: "medium" as const, status: "sent" as const, date: "2025-04-14", holdFromNewsletter: false, notes: "Positive feature coverage in top-tier outlet." },
];

export const demoRules = [
  { id: "r1", name: "Exclude Journal Publications", type: "exclusion", priority: 10, active: true, conditions: "Outlet in Academic Journals list", actions: "Exclude" },
  { id: "r2", name: "Acadia Corporate Mention", type: "assignment", priority: 20, active: true, conditions: "Entity = Acadia Pharmaceuticals", actions: "Assign to Acadia Corporate" },
  { id: "r3", name: "Financial Without Product Mentions", type: "exclusion", priority: 15, active: true, conditions: "Title contains financial keywords AND NOT product entity", actions: "Exclude" },
  { id: "r4", name: "Rett Syndrome - Therapeutic", type: "assignment", priority: 50, active: true, conditions: "Disease = Rett Syndrome AND NOT competitor", actions: "Assign to Rett Syndrome / Therapeutic" },
  { id: "r5", name: "Rett Syndrome - Competitor", type: "assignment", priority: 50, active: true, conditions: "Disease = Rett Syndrome AND competitor entity", actions: "Assign to Rett Syndrome / Competitor" },
  { id: "r6", name: "Parkinson's - Therapeutic", type: "assignment", priority: 50, active: true, conditions: "Disease = Parkinson's AND NOT competitor", actions: "Assign to Parkinson's / Therapeutic" },
  { id: "r7", name: "Parkinson's - Competitor", type: "assignment", priority: 50, active: true, conditions: "Disease = Parkinson's AND competitor entity", actions: "Assign to Parkinson's / Competitor" },
  { id: "r8", name: "Parkinson's - Exclude Movement Only", type: "exclusion", priority: 25, active: true, conditions: "Disease = Parkinson's AND contains 'movement disorder' AND NOT Acadia", actions: "Exclude" },
  { id: "r9", name: "Tier 1 Acadia - High Priority", type: "alert", priority: 5, active: true, conditions: "Tier 1 outlet AND Acadia entity", actions: "Alert (high) + Set priority" },
  { id: "r10", name: "Negative Product Commentary", type: "alert", priority: 5, active: true, conditions: "Contains negative product keywords", actions: "Alert (high)" },
  { id: "r11", name: "Exclude Retweets", type: "exclusion", priority: 10, active: true, conditions: "Channel = social AND starts with RT @", actions: "Exclude" },
  { id: "r12", name: "News of Interest", type: "assignment", priority: 80, active: true, conditions: "Tier 1 outlet AND NOT Acadia entity", actions: "Assign to News of Interest" },
];

export const demoSourceAdapters = [
  { id: "s1", name: "Google News - Acadia", type: "google_news", active: true, lastFetch: "2025-04-15T14:30:00Z", itemCount: 34, status: "ok" },
  { id: "s2", name: "Google News - Rett Syndrome", type: "google_news", active: true, lastFetch: "2025-04-15T14:00:00Z", itemCount: 18, status: "ok" },
  { id: "s3", name: "Google News - Parkinson's", type: "google_news", active: true, lastFetch: "2025-04-15T14:00:00Z", itemCount: 22, status: "ok" },
  { id: "s4", name: "STAT News RSS", type: "rss", active: true, lastFetch: "2025-04-15T14:15:00Z", itemCount: 45, status: "ok" },
  { id: "s5", name: "FiercePharma RSS", type: "rss", active: true, lastFetch: "2025-04-15T14:15:00Z", itemCount: 38, status: "ok" },
  { id: "s6", name: "BioPharma Dive RSS", type: "rss", active: true, lastFetch: "2025-04-15T14:15:00Z", itemCount: 29, status: "ok" },
  { id: "s7", name: "Manual URL Import", type: "manual_url", active: true, lastFetch: null, itemCount: 5, status: "ok" },
  { id: "s8", name: "CSV/JSON Import", type: "csv_import", active: true, lastFetch: null, itemCount: 12, status: "ok" },
  { id: "s9", name: "Twitter/X Manual Entry", type: "twitter_manual", active: true, lastFetch: null, itemCount: 8, status: "ok" },
  { id: "s10", name: "Meltwater", type: "meltwater", active: false, lastFetch: null, itemCount: 0, status: "not_configured" },
  { id: "s11", name: "Factiva", type: "factiva", active: false, lastFetch: null, itemCount: 0, status: "not_configured" },
  { id: "s12", name: "Talkwalker", type: "talkwalker", active: false, lastFetch: null, itemCount: 0, status: "not_configured" },
  { id: "s13", name: "TV Eyes", type: "tveyes", active: false, lastFetch: null, itemCount: 0, status: "not_configured" },
];

export const demoSchedules = [
  { id: "sch1", name: "Daily Newsletter", type: "daily_newsletter", cron: "Mon-Fri 8:00 AM PT", active: true, lastRun: "2025-04-15T15:00:00Z" },
  { id: "sch2", name: "Milestone EOD Report", type: "milestone_eod", cron: "3:30 PM PT (on demand)", active: true, lastRun: null },
  { id: "sch3", name: "Milestone Morning Report", type: "milestone_morning", cron: "7:30 AM PT (on demand)", active: true, lastRun: null },
  { id: "sch4", name: "Ad Hoc Flag", type: "ad_hoc", cron: "Real-time", active: true, lastRun: "2025-04-15T16:00:00Z" },
  { id: "sch5", name: "Quarterly Report", type: "quarterly", cron: "End of quarter", active: true, lastRun: "2025-03-31T12:00:00Z" },
  { id: "sch6", name: "Annual Report", type: "annual", cron: "Jan 15", active: true, lastRun: "2025-01-15T12:00:00Z" },
];

export const demoAuditLog = [
  { id: "al1", action: "article.review", user: "Sarah Chen", resource: "Patient groups raise concerns...", date: "2025-04-15T16:30:00Z" },
  { id: "al2", action: "flag.create", user: "System", resource: "Negative NUPLAZID coverage from Reuters", date: "2025-04-15T16:05:00Z" },
  { id: "al3", action: "digest.generate", user: "Michael Park", resource: "Daily Newsletter - Apr 15, 2025", date: "2025-04-15T15:00:00Z" },
  { id: "al4", action: "rule.update", user: "Sarah Chen", resource: "Exclude Journal Publications", date: "2025-04-14T09:00:00Z" },
  { id: "al5", action: "article.import", user: "System", resource: "Batch import: 12 articles via CSV", date: "2025-04-14T08:00:00Z" },
];
