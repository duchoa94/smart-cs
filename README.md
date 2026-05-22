# Smart CS — AI-Powered Customer Service Platform

A multi-tenant SaaS platform that lets businesses deploy AI agents for customer service across web chat, Zalo, and WhatsApp — with a human handoff system, knowledge base management, and real-time analytics.

## Architecture

```
smart-cs/
├── apps/
│   ├── api/        ExpressJS REST + Socket.IO backend
│   ├── web/        NextJS 15 admin dashboard
│   └── widget/     Embeddable JS chat widget
└── packages/
    ├── types/      Shared Zod schemas + inferred TypeScript types
    ├── db/         Drizzle ORM schema, repositories, migrations
    └── services/   Domain services, cache (Redis), vector (Milvus), AI (RAG pipeline)
```

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | TypeScript, Express 5, Socket.IO 4 |
| Database | PostgreSQL 16 via Drizzle ORM |
| Cache / Queues | Redis 7, BullMQ |
| Vector DB | Milvus 2.4 (RAG knowledge base) |
| AI | Anthropic Claude, OpenAI (embeddings) |
| Frontend | Next.js 15, Tailwind CSS 4, Zustand |
| Monorepo | pnpm workspaces, Turborepo |

## Supported Channels

- **Web** — embeddable JS widget (`SmartCS.init({ agentId, tenantId })`)
- **Zalo** — Official Account webhook integration
- **WhatsApp** — Meta Cloud API webhook integration

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm >= 10
- Docker + Docker Compose

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL, Redis, Milvus (with etcd + MinIO), all with health checks.

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your API keys and secrets
```

### 4. Run database migrations

```bash
pnpm db:generate   # generate migration files from Drizzle schema
pnpm db:migrate    # apply migrations to PostgreSQL
```

### 5. Start development servers

```bash
pnpm dev           # starts all apps in parallel via Turborepo
```

| Service | URL |
|---|---|
| API | http://localhost:4000 |
| Web dashboard | http://localhost:3000 |
| Drizzle Studio | http://localhost:4983 |

## Package Dependency Graph

```
apps/api    -> @smart-cs/services -> @smart-cs/db -> @smart-cs/types
apps/web    ->                                        @smart-cs/types
apps/widget ->                                        (standalone)
```

Frontend apps only import `@smart-cs/types` — never `@smart-cs/db` or `@smart-cs/services`.

## AI Agent Flow (RAG)

```
User message
  -> Embed query (OpenAI text-embedding-3-small)
  -> Semantic search in Milvus (top-5 chunks, score > 0.7)
  -> Augment system prompt with retrieved context
  -> Call Claude (claude-sonnet-4-6 default)
  -> Estimate confidence from Milvus scores
  -> Handoff check (confidence < threshold || keywords || > 10 turns)
  -> Persist message + RAG context to PostgreSQL
  -> Emit response over Socket.IO
```

## Project Scripts

```bash
pnpm build         # build all packages and apps
pnpm dev           # start all in watch mode
pnpm typecheck     # type-check everything
pnpm lint          # lint everything
pnpm db:generate   # generate Drizzle migrations
pnpm db:migrate    # run migrations
pnpm db:studio     # open Drizzle Studio
pnpm clean         # remove all build artifacts
```

## Environment Variables

See [`.env.example`](.env.example) for the full list with descriptions.

Key variables:
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string
- `MILVUS_ADDRESS` — Milvus gRPC address (`host:port`)
- `ANTHROPIC_API_KEY` — Claude API key
- `OPENAI_API_KEY` — OpenAI API key (for embeddings)
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — min 32 characters each
- `ENCRYPTION_KEY` — 64-char hex string for AES-256-GCM (channel credentials)
