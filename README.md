# Acadia Media Monitor

Internal media and social media monitoring platform for Acadia Pharmaceuticals. Tracks Acadia mentions, product news, disease-state coverage, competitor activity, and industry developments across traditional media, broadcast, and social channels.

## Features

- **Executive Dashboard** — KPI cards, trend charts, top outlets, competitor tracking, region distribution
- **Coverage Feed** — Advanced filterable table with sorting, pagination, and drilldown to article details
- **Daily Digest** — Newsletter-style view matching the current email format, with HTML/Markdown export
- **Alerts & Flags** — Real-time issue tracking with severity levels, catch-and-correct workflow
- **Rule Engine** — Deterministic classification with entity matching, outlet rules, section assignment
- **Source Adapters** — Pluggable architecture for RSS, Google News, manual imports, and licensed vendor connectors
- **Reports** — Quarterly and annual analytics with trend charts, top outlets, and CSV/HTML export
- **Admin** — CRUD for rules, entities, outlets, sections, schedules, and user roles

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui primitives |
| Database | PostgreSQL (local) |
| Tables | TanStack Table |
| Charts | Recharts |
| Validation | Zod |
| Dates | date-fns |
| Testing | Vitest + Playwright |
| Package Manager | pnpm |
| CI/CD | GitHub Actions |

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+
- PostgreSQL 14+ installed and running locally

### 1. Clone and install

```bash
git clone https://github.com/andrewkillinger/media-monitoring.git
cd media-monitoring
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your local PostgreSQL connection:

```
DATABASE_URL=postgresql://acadia:acadia@localhost:5432/media_monitoring
CRON_SECRET=any-secret-string-for-cron-auth
```

### 3. Set up the database

Run the setup script to create the database, apply all migrations, and seed demo data:

```bash
pnpm db:setup
```

This will:
- Create the `media_monitoring` database and `acadia` user
- Apply all 32 migration files (schema, indexes, functions)
- Seed entities, competitors, outlets, rules, schedules, and demo articles

> **Note:** The script uses `psql` and connects as the `postgres` superuser to create the database. If your PostgreSQL is configured differently, set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` environment variables.

### 4. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in.

## Source Adapters

### Working in MVP

| Adapter | Status | Description |
|---------|--------|-------------|
| RSS Feed | Working | Fetches and parses any RSS/Atom feed |
| Google News RSS | Working | Queries Google News RSS endpoint by keyword |
| Manual URL Import | Working | Paste a URL to import article metadata |
| CSV/JSON Import | Working | Upload structured data files |
| Twitter/X Manual Entry | Working | Manual entry form for social posts |
| File Upload | Working | Attach full-text documents to articles |

### Stubbed (Awaiting Credentials)

| Adapter | Status | What's Needed |
|---------|--------|---------------|
| Meltwater | Stubbed | Meltwater API key and search configuration |
| Factiva | Stubbed | Factiva API credentials or export format spec |
| Talkwalker | Stubbed | Talkwalker API key and project ID |
| TV Eyes | Stubbed | TV Eyes API credentials |

Stubbed adapters implement the full interface and will activate when credentials are provided via environment variables or the admin configuration screen.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login, auth callback
│   ├── (app)/              # Authenticated pages
│   │   ├── dashboard/      # Executive overview
│   │   ├── feed/           # Coverage feed + article detail
│   │   ├── digest/         # Daily digest preview + export
│   │   ├── alerts/         # Alerts & flags management
│   │   ├── reports/        # Quarterly/annual reports
│   │   ├── rules/          # Rules & taxonomy admin
│   │   ├── sources/        # Source adapter management
│   │   └── admin/          # System administration
│   └── api/                # API routes (ingest, digest, cron)
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   └── layout/             # App shell, sidebar, topbar
├── lib/
│   ├── supabase/           # Supabase clients (browser, server, admin)
│   ├── adapters/           # Source adapter implementations
│   │   └── stubs/          # Licensed vendor stubs
│   ├── rules/              # Rule engine and matchers
│   │   └── matchers/       # Keyword, entity, outlet, region matchers
│   ├── pipeline/           # Ingestion pipeline (ingest, normalize, dedup, classify)
│   ├── digest/             # Digest builder and renderers
│   ├── validators/         # Zod schemas
│   └── utils/              # Date, text, and general utilities
└── middleware.ts            # Auth middleware

supabase/
├── migrations/             # 32 numbered SQL migration files
└── seed/                   # 11 seed data files

tests/
├── unit/                   # Vitest unit tests
└── e2e/                    # Playwright E2E tests

.github/workflows/
├── ci.yml                  # Lint + test + build
└── scheduled-ingestion.yml # Cron-triggered ingestion and digest generation
```

## Database Schema

The schema includes 27 tables organized around these concepts:

- **Core**: articles, story_clusters, article_entities, article_sections
- **Classification**: rules, rule_conditions, rule_actions, item_flags, item_overrides
- **Reference**: entities, entity_aliases, disease_states, sections, subsections, outlets, outlet_lists
- **Ingestion**: source_adapters, ingestion_runs
- **Output**: digest_runs, digest_items, schedules, alert_recipients
- **System**: profiles (auth), attachments, audit_log

No authentication is required — the app is open access for internal use.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `CRON_SECRET` | Yes | Secret for authenticating cron/ingestion API calls |
| `OPENAI_API_KEY` | No | Enables AI summarization and classification assistance |
| `AI_MODEL` | No | AI model to use (default: gpt-4o-mini) |
| `SMTP_HOST` | No | SMTP server for email delivery |
| `SMTP_PORT` | No | SMTP port (default: 587) |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password |
| `RESEND_API_KEY` | No | Alternative to SMTP for email delivery |
| `TRANSLATION_API_KEY` | No | Enables machine translation for non-English content |

## Testing

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# E2E tests (requires running dev server)
pnpm test:e2e

# Lint
pnpm lint
```

## Scheduled Jobs

The GitHub Actions workflow `scheduled-ingestion.yml` handles:

1. **Ingestion** — Runs every 30 minutes during business hours (ET), hourly off-hours
2. **Digest generation** — Triggers at 8:00 AM PT on weekdays

Configure these secrets in your GitHub repository:
- `APP_URL` — Your deployed application URL
- `CRON_SECRET` — Matches your `.env.local` CRON_SECRET

## TODOs Requiring Human Access

- [ ] Meltwater API integration — requires vendor contract and API key
- [ ] Factiva API integration — requires Dow Jones/Factiva license
- [ ] Talkwalker API integration — requires vendor contract
- [ ] TV Eyes broadcast monitoring — requires vendor contract
- [ ] SMTP/email configuration for digest delivery
- [ ] AI summarization setup (OpenAI or Anthropic API key)
- [ ] Translation provider configuration
- [ ] Production Supabase project with proper backup/scaling
- [ ] Custom domain and SSL for production deployment
- [ ] Legal review of data retention and storage policies for licensed content

## License

Internal use only — Acadia Pharmaceuticals.
