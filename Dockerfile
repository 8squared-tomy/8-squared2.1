# TanStack Start app: vite builds a Nitro server. The default Nitro preset is
# cloudflare-module, so the Node server preset is pinned for this container.
FROM node:22-alpine AS build
WORKDIR /app
ENV NITRO_PRESET=node-server

# Optional build-time values: the browser bundle reads VITE_* variables.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY

RUN apk upgrade --no-cache
# package-lock.json keeps the image build deterministic: resolving fresh from
# package.json alone crashes npm's arborist ("Cannot read properties of null").
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

RUN apk upgrade --no-cache
COPY --from=build /app/.output ./.output

EXPOSE 3000
USER node
CMD ["node", ".output/server/index.mjs"]
