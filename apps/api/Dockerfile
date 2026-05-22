FROM node:22-alpine AS builder

RUN corepack enable

WORKDIR /app

# Root workspace manifest files (layer-cache friendly)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.base.json .npmrc .pnpmfile.cjs ./

# All workspace package manifests — pnpm needs the full workspace graph
COPY packages/types/package.json packages/types/
COPY packages/db/package.json packages/db/
COPY packages/services/package.json packages/services/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY apps/widget/package.json apps/widget/

RUN pnpm install --frozen-lockfile

# Only copy source needed to build the API and its workspace dependencies
COPY packages/ packages/
COPY apps/api/ apps/api/

RUN pnpm --filter=@smart-cs/types build && \
    pnpm --filter=@smart-cs/db build && \
    pnpm --filter=@smart-cs/services build && \
    pnpm --filter=@smart-cs/api build

# Produce a self-contained production bundle (resolves workspace: deps)
RUN pnpm deploy --filter=@smart-cs/api --prod /deploy

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /deploy .

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/index.js"]
