# PDTIC/AEB — Gestão MoSCoW

Sistema de gestão do Plano Diretor de Tecnologia da Informação e Comunicação (PDTIC 2024-2026) da Agência Espacial Brasileira (AEB), usando a metodologia MoSCoW para priorização de necessidades de TIC.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/pdtic-moscow run dev` — run the frontend (random port)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + Recharts
- API: Express 5 (port 8080, path prefix `/api`)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec → React Query hooks + Zod schemas)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle ORM table definitions (necessidades, okrs, kpis)
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not edit manually)
- `lib/api-zod/src/generated/` — generated Zod validation schemas (do not edit manually)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/pdtic-moscow/src/pages/` — React pages (Dashboard, Necessidades, OKRs, KPIs)
- `artifacts/pdtic-moscow/src/components/layout.tsx` — sidebar navigation layout
- `artifacts/pdtic-moscow/src/lib/moscow.ts` — MoSCoW/status label and color helpers

## Architecture decisions

- **Contract-first API**: OpenAPI spec in `lib/api-spec` drives both the Express routes (via Zod schemas) and the React Query hooks (via Orval codegen). Change the spec, run `codegen`, and types propagate everywhere.
- **Numeric budgets as Postgres NUMERIC**: Orcamento fields use `numeric(15,2)` to avoid floating-point errors. They come back as strings from Drizzle; use `parseFloat()` before math.
- **Semaphore-based KPI status**: KPIs use a `semaforo` field (verde/amarelo/vermelho) as a simple visual traffic-light system, avoiding complex computed thresholds.
- **MoSCoW stored as enum string**: `classificacao_moscow` stores lowercase keys (`must`, `should`, `could`, `wont`); display labels live in `moscow.ts` helpers to keep the DB clean.

## Product

- **Dashboard Executivo**: KPI cards, MoSCoW pie chart, status pie chart, eixo bar chart, budget execution bar, OKR and KPI semaphore summary.
- **Necessidades de TIC**: Filterable/searchable table of all 53 PDTIC needs with MoSCoW classification, status, budget. CRUD with inline create dialog and detail edit page.
- **OKRs**: 3 OKRs with expandable Key Results, progress bars, inline edit of values and status.
- **KPIs**: 9 KPIs grouped by category, semaphore indicators, trend arrows, inline edit.

## Seeded Data (real PDTIC/AEB 2024-2026)

- 53 necessidades across 4 eixos: Infraestrutura, Sistemas, Dados/Inovação/Segurança, Governança
- 3 OKRs with 9 Key Results (Data Center modernization, delivery transparency, strategic partnership)
- 9 KPIs with semaphore indicators (uptime, security patching, NPS, budget execution, on-time delivery, etc.)

## User preferences

- Portuguese (pt-BR) UI — all labels, headings, and messages in Portuguese
- No emojis in UI
- Institutional navy color palette (`--primary: 217 91% 30%`)
- Real PDTIC/AEB data — no mocked placeholders

## Gotchas

- Do NOT call `pnpm run dev` at workspace root — use workflow restart or individual `--filter` commands.
- After changing `openapi.yaml`, always run `pnpm --filter @workspace/api-spec run codegen` to regenerate hooks and schemas.
- Orcamento values from DB are strings (Drizzle NUMERIC behavior) — always `parseFloat()` before arithmetic.
- Wouter's `<Link>` renders as `<a>` — never nest an `<a>` inside a `<Link>` (causes HTML hydration warnings).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
