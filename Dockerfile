# FabLab website deploy pattern (fablab/docs/website-deploy-pattern.md). Built only on web-staging by deploy.sh.
# Build stage: installs and builds the commit deploy.sh checked out.
FROM node:22.22.1-alpine AS build
WORKDIR /app
# Pinned to the pnpm the old prod box used (10.18.3). Without a pin, corepack fetches the newest pnpm.
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# Same heap cap the old in-place build used.
RUN NODE_OPTIONS=--max-old-space-size=1024 pnpm build

# Runtime: `next start`, same as the old systemd unit (Node 22). Pages read content/ and private-assets/ at runtime, so both ship.
FROM node:22.22.1-alpine
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY --from=build /app/content ./content
COPY --from=build /app/private-assets ./private-assets
COPY --from=build /app/data ./data
COPY --from=build /app/package.json /app/next.config.mjs ./
# .next is owned by node: /loop uses ISR (revalidate 3600), and Next writes regenerated pages into .next/server at runtime.
COPY --from=build --chown=node:node /app/.next ./.next
# Runtime state, each covered by a named volume in compose.yaml. Created here owned by node so new volumes inherit it.
#   /app/data                       tetris high scores (data/tetris-highscores.json; cwd-relative in the route)
#   /app/public/pf                  private Pebble podcast feed (gitignored; written by scripts/add-pebble-episode.sh)
#   /app/public/uploads             legacy Easter 2026 upload that sits in public/
#   /home/node/easter2026-uploads   Easter 2026 photo uploads ($HOME-relative in the route)
#   /home/node/print-requests       /print requests (PRINT_REQUESTS_DIR)
RUN mkdir -p public/pf public/uploads /home/node/easter2026-uploads /home/node/print-requests \
 && chown -R node:node data public/pf public/uploads /home/node/easter2026-uploads /home/node/print-requests \
 && chmod 700 /home/node/print-requests
USER node
ENV PORT=8104
CMD ["sh", "-c", "exec node_modules/.bin/next start -p $PORT"]
