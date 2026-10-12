# PulseIQ — SaaS Business Analytics Dashboard

A production-quality business analytics dashboard: dark-first premium design, animated KPI cards, interactive revenue/sales charts, realtime transaction feed, PDF/CSV report generation, and full CRUD for customers, products, sales, and reports.

Website Link : https://data-shine-center.lovable.app
## Tech stack

- **Framework:** TanStack Start v1 (React 19, SSR, server functions) + Vite
- **Styling:** Tailwind CSS v4, shadcn-style UI components, Framer Motion animations
- **State:** Zustand + TanStack Query
- **Backend:** Lovable Cloud (Supabase) — auth (email/password + Google), database, realtime, storage for report PDFs
- **Charts:** Recharts · **Icons:** Lucide React · **PDF:** jsPDF

## Prerequisites

- Node.js 20+ (or Bun 1.1+)
- npm (or pnpm/bun)

## Environment

The included `.env` already contains the required variables:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
```

These are the app's public (publishable) keys. The database, auth providers, and storage are already configured — no extra setup needed.

## Run locally

```bash
npm install        # or: bun install
npm run dev        # or: bun run dev
```

Open http://localhost:8080 — you'll land on the public introduction page, then sign in (create an account with email/password; new sign-ups receive a confirmation email, or continue with Google).

## Build for production

```bash
npm run build
npm run preview    # serve the production build locally
```

## Deploying

**Option 1 — Lovable (recommended):** open the project in Lovable and click **Publish**. The frontend and connected backend go live together; you can also attach a custom domain in Project Settings → Domains.

**Option 2 — Self-hosting:** run `npm run build` and deploy the output per the self-hosting guide at https://docs.lovable.dev/tips-tricks/self-hosting (Cloudflare Workers-style edge hosting is the build target). Host the frontend anywhere that supports Node-based builds.

## Project structure

```
src/
├── routes/                  # TanStack file-based routes
│   ├── index.tsx            # Public introduction page
│   ├── auth.tsx             # Sign-in / sign-up
│   └── _authenticated/      # All app pages (require sign-in)
│       ├── index.tsx        # Dashboard
│       ├── analytics/ customers/ products/ sales/ reports/ settings/
├── components/
│   ├── layout/              # Sidebar, top nav, background overlay, app shell
│   └── ui/                  # shadcn-style primitives
├── features/
│   ├── dashboard/           # KPI grid, charts, data panels
│   ├── data/                # Query hooks, realtime updates, CRUD mutations
│   ├── records/             # Customers/products/sales CRUD pages
│   ├── reports/             # PDF/CSV generation + history
│   ├── tour/                # Guided dashboard walkthrough
│   └── search/              # Command palette (⌘K / Ctrl+K)
├── store/                   # Zustand stores (theme, data mode, chart range)
├── lib/                     # Business data aggregation, INR formatting, mock/demo data
└── integrations/supabase/   # Generated Supabase clients (do not edit)
```

## Feature notes

- **Demo vs live data:** Settings → "Use my business data" toggles between sample figures and your real records; an empty workspace offers "Load starter data".
- **Realtime:** the dashboard updates automatically as new transactions are saved (Supabase realtime subscriptions).
- **Reports:** "Generate Report" builds a real PDF from your data and stores it in report history; "Export CSV" downloads all transactions.
- **Auth:** email/password with confirmation email, or Google OAuth. Sign out from the top bar or sidebar.
- **Theme:** dark (default) / light, persisted in localStorage.
- **Responsive:** full sidebar on desktop, compact on tablet, slide-in drawer with backdrop on mobile; KPI cards adapt 4/2/1 columns.

## Security note

If you plan to store real customer data, add row-level restrictions beyond the current public CRUD policies (sign-in currently gates the pages, not the data). See AGENTS.md for project conventions.
