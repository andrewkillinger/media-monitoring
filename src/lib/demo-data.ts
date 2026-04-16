// Demo data for the Acadia Media Monitor UI
// All URLs are demo placeholders — real URLs come from the ingestion pipeline.

export interface DemoArticle {
  id: string;
  title: string;
  summary: string;
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
  isDemoUrl?: boolean;
  socialMeta?: { handle: string; displayName: string; followers: number; likes: number; retweets: number };
}

export const demoArticles: DemoArticle[] = [
  {
    id: "f001", title: "Rett syndrome study highlights potential for personalized treatments",
    summary: "A multi-center study has identified distinct molecular subtypes within Rett syndrome patients, suggesting that personalized therapeutic strategies based on individual MECP2 mutation profiles could significantly improve treatment outcomes.",
    outlet: "FirstWord Pharma", section: "Rett Syndrome", subsection: "Therapeutic", date: "2025-04-15", status: "published", channel: "online", region: "US", language: "en", url: "#demo", priority: 65, entities: ["Rett Syndrome"], sentiment: "neutral", isDemoUrl: true,
  },
  {
    id: "f002", title: "New Study Reveals Diverse Effects of MECP2 Mutations",
    summary: "Researchers at Stanford have discovered that different MECP2 mutations produce a wider range of cellular effects than previously understood, with some variants affecting neuronal communication while others primarily impact protein regulation.",
    outlet: "Life Technology", section: "Rett Syndrome", subsection: "Therapeutic", date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "#demo", priority: 55, entities: ["Rett Syndrome", "MECP2"], sentiment: "neutral", isDemoUrl: true,
  },
  {
    id: "f003", title: "Minibrains Reveal Personalized Paths for Rett Syndrome",
    summary: "Using brain organoids derived from patient stem cells, scientists have mapped distinct molecular pathways affected in individual Rett syndrome cases. The approach could enable clinicians to test drug responses before prescribing.",
    outlet: "Neuroscience News", section: "Rett Syndrome", subsection: "Therapeutic", date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "#demo", priority: 60, entities: ["Rett Syndrome"], sentiment: "positive", isDemoUrl: true,
  },
  {
    id: "f004", title: "Amneal Pharmaceuticals donates $2M to support Parkinson\u2019s disease patients",
    summary: "Amneal Pharmaceuticals has pledged $2 million to the Michael J. Fox Foundation and three regional care organizations serving Parkinson\u2019s disease patients and their caregivers.",
    outlet: "Business in New Jersey Everyday", section: "Parkinson\u2019s Disease", subsection: "Competitor", date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "#demo", priority: 45, entities: ["Amneal Pharmaceuticals", "Parkinson\u2019s Disease"], sentiment: "positive", isDemoUrl: true,
  },
  {
    id: "f005", title: "Tests Show Promise for Diagnosing Parkinson\u2019s and Dementia with Lewy Bodies",
    summary: "Two novel blood-based biomarker tests demonstrated over 90% accuracy in distinguishing Parkinson\u2019s disease from healthy controls in a 1,200-patient validation study, potentially enabling diagnosis years before motor symptoms appear.",
    outlet: "Parkinson\u2019s Foundation", section: "Parkinson\u2019s Disease", subsection: "Therapeutic", date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "#demo", priority: 50, entities: ["Parkinson\u2019s Disease"], sentiment: "positive", isDemoUrl: true,
  },
  {
    id: "f006", title: "Alzheimer\u2019s Blood Tests: Most Patients Are Not Afraid to Know",
    summary: "A survey of 3,400 patients undergoing Alzheimer\u2019s blood testing found that 87% were not anxious about receiving their results, challenging assumptions that early detection creates undue psychological burden.",
    outlet: "MedPage Today", section: "Alzheimer\u2019s Disease", subsection: "Therapeutic", date: "2025-04-15", status: "published", channel: "online", region: "US", language: "en", url: "#demo", priority: 55, entities: ["Alzheimer\u2019s Disease"], sentiment: "neutral", isDemoUrl: true,
  },
  {
    id: "f007", title: "Ulixacaltamide NDA Accepted for Essential Tremor; PDUFA Date Set",
    summary: "The FDA has accepted the NDA for Praxis Precision Medicine\u2019s ulixacaltamide for essential tremor, with a PDUFA target action date of October 2025. The drug would be the first new mechanism of action approved for the condition in decades.",
    outlet: "Neurology Advisor", section: "Essential Tremor", subsection: "Competitor", date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "#demo", priority: 60, entities: ["Essential Tremor"], sentiment: "neutral", isDemoUrl: true,
  },
  {
    id: "f008", title: "Praxis Precision Medicines Shares Rise After FDA Accepts New Drug Application",
    summary: "Shares of Praxis Precision Medicine rose 14% in pre-market trading following the FDA\u2019s acceptance of its essential tremor NDA, bringing the company\u2019s market cap above $2 billion for the first time.",
    outlet: "Market Screener", section: "Essential Tremor", subsection: "Competitor", date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "#demo", priority: 50, entities: ["Essential Tremor", "Praxis Precision Medicine"], sentiment: "positive", isDemoUrl: true,
  },
  {
    id: "f009", title: "Novartis CEO joins Anthropic\u2019s board",
    summary: "Novartis CEO Vas Narasimhan has been appointed to the board of AI company Anthropic, signaling deepening ties between the pharmaceutical industry and artificial intelligence developers focused on drug discovery and clinical operations.",
    outlet: "STAT News", section: "News of Interest", subsection: null, date: "2025-04-15", status: "published", channel: "online", region: "US", language: "en", url: "#demo", priority: 70, entities: ["Novartis"], sentiment: "neutral", isDemoUrl: true,
  },
  {
    id: "f010", title: "Bill would force payers to apply DTC drug purchases to patient deductibles",
    summary: "Bipartisan legislation introduced in Congress would require insurers to count direct-to-consumer drug purchases toward patient deductibles and out-of-pocket maximums, a move that could reshape specialty pharma distribution.",
    outlet: "Fierce Healthcare", section: "News of Interest", subsection: null, date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "#demo", priority: 60, entities: [], sentiment: "neutral", isDemoUrl: true,
  },
  {
    id: "f011", title: "Congress returns to a packed health care agenda",
    summary: "Lawmakers face a crowded health policy calendar including drug pricing reform, FDA modernization, and rare disease legislation. Senate leaders signaled that orphan drug tax credits and accelerated approval pathway updates are priorities.",
    outlet: "STAT News", section: "News of Interest", subsection: null, date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "#demo", priority: 55, entities: [], sentiment: "neutral", isDemoUrl: true,
  },
  {
    id: "f012", title: "FDA bolsters bespoke therapy framework with new draft safety guidelines",
    summary: "The FDA released new draft guidelines aimed at streamlining safety requirements for individualized therapies, including gene therapies for rare diseases. The framework could reduce development timelines by 12\u201318 months.",
    outlet: "BioSpace", section: "News of Interest", subsection: null, date: "2025-04-14", status: "published", channel: "online", region: "US", language: "en", url: "#demo", priority: 50, entities: ["FDA"], sentiment: "neutral", isDemoUrl: true,
  },
  {
    id: "f014", title: "Acadia Pharmaceuticals reports strong Q1 2025 results with DAYBUE uptake exceeding expectations",
    summary: "Acadia\u2019s Q1 revenue of $247M beat consensus estimates by 8%, driven primarily by accelerating DAYBUE prescriptions among newly diagnosed Rett syndrome patients. Management raised full-year guidance.",
    outlet: "X / Twitter", section: "Acadia Corporate and Product News", subsection: null, date: "2025-04-15", status: "published", channel: "social", region: "US", language: "en", url: "#demo", priority: 40, entities: ["Acadia Pharmaceuticals", "DAYBUE"], sentiment: "positive", isDemoUrl: true,
    socialMeta: { handle: "@pharma_analyst", displayName: "Pharma Analyst", followers: 12500, likes: 45, retweets: 12 },
  },
  {
    id: "f015", title: "MECP2 Protein Folding in Rett Syndrome: A Structural Analysis",
    summary: "This peer-reviewed study presents a comprehensive structural analysis of MECP2 protein folding patterns, identifying three previously unknown conformational states that may explain phenotypic variability in Rett syndrome.",
    outlet: "Nature", section: "Rett Syndrome", subsection: "Therapeutic", date: "2025-04-13", status: "excluded", channel: "online", region: "US", language: "en", url: "#demo", priority: 80, entities: ["Rett Syndrome"], sentiment: "neutral", isDemoUrl: true,
    exclusionReason: "Journal publication excluded per editorial policy",
  },
  {
    id: "f016", title: "Patient groups raise concerns about NUPLAZID side effect reporting",
    summary: "Three patient advocacy organizations have formally requested that the FDA review post-marketing safety data for NUPLAZID, citing what they describe as inconsistencies in adverse event documentation. Acadia has stated it is cooperating fully with regulators.",
    outlet: "Reuters", section: "Acadia Corporate and Product News", subsection: null, date: "2025-04-15", status: "reviewed", channel: "wire", region: "US", language: "en", url: "#demo", priority: 95, entities: ["Acadia Pharmaceuticals", "NUPLAZID"], sentiment: "negative", isDemoUrl: true,
    flagType: "negative_product", flagSeverity: "high",
  },
  {
    id: "f017", title: "Inside Acadia\u2019s Strategy for Rare Disease Dominance",
    summary: "An in-depth feature examining Acadia\u2019s strategic pivot toward rare neurological diseases, exploring how the company\u2019s pipeline of four clinical-stage candidates positions it as a potential leader in the underserved rare disease space.",
    outlet: "The Wall Street Journal", section: "Acadia Corporate and Product News", subsection: null, date: "2025-04-14", status: "reviewed", channel: "print", region: "US", language: "en", url: "#demo", priority: 85, entities: ["Acadia Pharmaceuticals"], sentiment: "positive", isDemoUrl: true,
    isPaywalled: true,
  },
  {
    id: "f018", title: "New gene therapy approach shows early promise for Rett syndrome",
    summary: "A Phase 1 trial of a novel AAV-based gene therapy for Rett syndrome has shown encouraging preliminary safety and efficacy signals in six patients, with measurable improvements in hand function and communication at the 12-week mark.",
    outlet: "Endpoints News", section: "Rett Syndrome", subsection: "Therapeutic", date: "2025-04-15", status: "classified", channel: "online", region: "US", language: "en", url: "#demo", priority: 70, entities: ["Rett Syndrome"], sentiment: "positive", isDemoUrl: true,
    reviewStatus: "needs_review",
  },
  {
    id: "f019", title: "CNBC discusses Acadia Pharmaceuticals pipeline potential",
    summary: "CNBC analysts highlighted Acadia\u2019s expanding pipeline during a segment on rare disease investment opportunities, noting strong DAYBUE growth trajectory and upcoming Phase 3 readouts for NUPLAZID in new indications.",
    outlet: "CNBC", section: "Acadia Corporate and Product News", subsection: null, date: "2025-04-14", status: "published", channel: "broadcast", region: "US", language: "en", url: "#demo", priority: 75, entities: ["Acadia Pharmaceuticals", "DAYBUE", "NUPLAZID"], sentiment: "positive", isDemoUrl: true,
  },
  {
    id: "f020", title: "Rett syndrome families in Ontario advocate for expanded access",
    summary: "A coalition of Ontario families affected by Rett syndrome has launched a formal petition to Health Canada requesting expanded access to emerging therapies currently available only through clinical trials in the United States.",
    outlet: "The Globe and Mail", section: "Rett Syndrome", subsection: "Therapeutic", date: "2025-04-13", status: "published", channel: "print", region: "Canada", language: "en", url: "#demo", priority: 55, entities: ["Rett Syndrome"], sentiment: "neutral", isDemoUrl: true,
  },
];

export const demoSections = [
  { name: "Overview / Summary", slug: "overview", active: true },
  { name: "Acadia Corporate and Product News", slug: "acadia-corporate", active: true },
  { name: "Rett Syndrome", slug: "rett-syndrome", active: true },
  { name: "Parkinson\u2019s Disease", slug: "parkinsons-disease", active: true },
  { name: "Schizophrenia", slug: "schizophrenia", active: true },
  { name: "Prader-Willi Syndrome", slug: "prader-willi-syndrome", active: true },
  { name: "Alzheimer\u2019s Disease", slug: "alzheimers-disease", active: true },
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

export const demoVolumeData = [
  { date: "Apr 2", total: 8, acadia: 2, competitor: 3 },
  { date: "Apr 3", total: 12, acadia: 1, competitor: 4 },
  { date: "Apr 4", total: 10, acadia: 3, competitor: 2 },
  { date: "Apr 5", total: 6, acadia: 0, competitor: 3 },
  { date: "Apr 6", total: 4, acadia: 0, competitor: 1 },
  { date: "Apr 7", total: 14, acadia: 2, competitor: 5 },
  { date: "Apr 8", total: 11, acadia: 1, competitor: 4 },
  { date: "Apr 9", total: 9, acadia: 3, competitor: 3 },
  { date: "Apr 10", total: 15, acadia: 4, competitor: 6 },
  { date: "Apr 11", total: 13, acadia: 2, competitor: 5 },
  { date: "Apr 12", total: 7, acadia: 1, competitor: 2 },
  { date: "Apr 13", total: 5, acadia: 0, competitor: 2 },
  { date: "Apr 14", total: 18, acadia: 3, competitor: 7 },
  { date: "Apr 15", total: 16, acadia: 5, competitor: 4 },
];

export const demoSectionDistribution = [
  { section: "Rett Syndrome", count: 24 },
  { section: "Parkinson\u2019s", count: 18 },
  { section: "Alzheimer\u2019s", count: 15 },
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
  { name: "Biogen", mentions: 8, disease: "Alzheimer\u2019s" },
  { name: "Bristol Myers Squibb", mentions: 7, disease: "Schizophrenia" },
  { name: "Neuren Pharmaceuticals", mentions: 5, disease: "Rett Syndrome" },
  { name: "Amneal Pharmaceuticals", mentions: 4, disease: "Parkinson\u2019s" },
  { name: "Soleno Therapeutics", mentions: 3, disease: "Prader-Willi" },
];

export const demoFlags = [
  { id: "fl1", articleId: "f016", title: "Negative NUPLAZID coverage from Reuters", headline: "Patient groups raise concerns about NUPLAZID side effect reporting", outlet: "Reuters", type: "negative_product", severity: "high" as const, status: "reviewing" as const, date: "2025-04-15", holdFromNewsletter: true, notes: "Patient groups raising safety concerns. Monitor for follow-up coverage." },
  { id: "fl2", articleId: "f007", title: "Essential Tremor NDA acceptance", headline: "Ulixacaltamide NDA Accepted for Essential Tremor; PDUFA Date Set", outlet: "Neurology Advisor", type: "competitor_milestone", severity: "medium" as const, status: "sent" as const, date: "2025-04-14", holdFromNewsletter: false, notes: "Competitive intelligence: ulixacaltamide NDA accepted by FDA." },
  { id: "fl3", articleId: "f019", title: "CNBC Acadia pipeline discussion", headline: "CNBC discusses Acadia Pharmaceuticals pipeline potential", outlet: "CNBC", type: "acadia_earned", severity: "low" as const, status: "resolved" as const, date: "2025-04-14", holdFromNewsletter: false, notes: "Positive broadcast coverage." },
  { id: "fl4", articleId: "f017", title: "WSJ Acadia rare disease strategy", headline: "Inside Acadia\u2019s Strategy for Rare Disease Dominance", outlet: "The Wall Street Journal", type: "acadia_earned", severity: "medium" as const, status: "sent" as const, date: "2025-04-14", holdFromNewsletter: false, notes: "Positive feature coverage in top-tier outlet." },
];

export const demoRules = [
  { id: "r1", name: "Exclude Journal Publications", type: "exclusion", priority: 10, active: true, conditions: "Outlet in Academic Journals list", actions: "Exclude" },
  { id: "r2", name: "Acadia Corporate Mention", type: "assignment", priority: 20, active: true, conditions: "Entity = Acadia Pharmaceuticals", actions: "Assign to Acadia Corporate" },
  { id: "r3", name: "Financial Without Product Mentions", type: "exclusion", priority: 15, active: true, conditions: "Title contains financial keywords AND NOT product entity", actions: "Exclude" },
  { id: "r4", name: "Rett Syndrome - Therapeutic", type: "assignment", priority: 50, active: true, conditions: "Disease = Rett Syndrome AND NOT competitor", actions: "Assign to Rett Syndrome / Therapeutic" },
  { id: "r5", name: "Rett Syndrome - Competitor", type: "assignment", priority: 50, active: true, conditions: "Disease = Rett Syndrome AND competitor entity", actions: "Assign to Rett Syndrome / Competitor" },
  { id: "r6", name: "Parkinson\u2019s - Therapeutic", type: "assignment", priority: 50, active: true, conditions: "Disease = Parkinson\u2019s AND NOT competitor", actions: "Assign to Parkinson\u2019s / Therapeutic" },
  { id: "r7", name: "Parkinson\u2019s - Competitor", type: "assignment", priority: 50, active: true, conditions: "Disease = Parkinson\u2019s AND competitor entity", actions: "Assign to Parkinson\u2019s / Competitor" },
  { id: "r8", name: "Parkinson\u2019s - Exclude Movement Only", type: "exclusion", priority: 25, active: true, conditions: "Disease = Parkinson\u2019s AND contains 'movement disorder' AND NOT Acadia", actions: "Exclude" },
  { id: "r9", name: "Tier 1 Acadia - High Priority", type: "alert", priority: 5, active: true, conditions: "Tier 1 outlet AND Acadia entity", actions: "Alert (high) + Set priority" },
  { id: "r10", name: "Negative Product Commentary", type: "alert", priority: 5, active: true, conditions: "Contains negative product keywords", actions: "Alert (high)" },
  { id: "r11", name: "Exclude Retweets", type: "exclusion", priority: 10, active: true, conditions: "Channel = social AND starts with RT @", actions: "Exclude" },
  { id: "r12", name: "News of Interest", type: "assignment", priority: 80, active: true, conditions: "Tier 1 outlet AND NOT Acadia entity", actions: "Assign to News of Interest" },
];

export const demoSourceAdapters = [
  { id: "s1", name: "Google News - Acadia", type: "google_news", active: true, lastFetch: "2025-04-15T14:30:00Z", itemCount: 34, status: "ok" },
  { id: "s2", name: "Google News - Rett Syndrome", type: "google_news", active: true, lastFetch: "2025-04-15T14:00:00Z", itemCount: 18, status: "ok" },
  { id: "s3", name: "Google News - Parkinson\u2019s", type: "google_news", active: true, lastFetch: "2025-04-15T14:00:00Z", itemCount: 22, status: "ok" },
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
