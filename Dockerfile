
# ---------- BUILDER ----------
FROM node:24-alpine AS builder
WORKDIR /app

# Use prebuilt native binaries instead of compiling Sharp
RUN apk add --no-cache libc6-compat

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Install pnpm and configure dependency layout
RUN npm install -g pnpm@12.18.0 --allow-scripts=pnpm && \
    echo "node-linker=hoisted" > .npmrc && \
    pnpm approve-builds sharp unrs-resolver && \
    pnpm install

COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN pnpm run build


# ---------- RUNNER ----------
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
