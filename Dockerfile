 ########################
 #         DEPS         #
 ########################

 # Install dependencies only when needed
 # TODO: re-evaluate if emulation is still necessary on arm64 after moving to node 18
 FROM --platform=linux/amd64 node:16-alpine AS deps
 # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
 RUN apk add --no-cache libc6-compat openssl
 WORKDIR /app

 # Install Prisma Client - remove if not using Prisma
 COPY prisma ./

 # Install dependencies based on the preferred package manager
 COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
 RUN \
   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
   elif [ -f package-lock.json ]; then npm ci; \
   elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
   else echo "Lockfile not found." && exit 1; \
   fi

 ########################
 #        BUILDER       #
 ########################

 # Rebuild the source code only when needed
 # TODO: re-evaluate if emulation is still necessary on arm64 after moving to node 18
 FROM --platform=linux/amd64 node:16-alpine AS builder

 ARG DATABASE_URL
 ARG NEXT_PUBLIC_CLIENTVAR

 WORKDIR /app
 COPY --from=deps /app/node_modules ./node_modules
 COPY . .

 # Next.js collects completely anonymous telemetry data about general usage.
 # Learn more here: https://nextjs.org/telemetry
 # Uncomment the following line in case you want to disable telemetry during the build.
 # ENV NEXT_TELEMETRY_DISABLED 1

 RUN \
   if [ -f yarn.lock ]; then yarn build; \
   elif [ -f package-lock.json ]; then npm run build; \
   elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm run build; \
   else echo "Lockfile not found." && exit 1; \
   fi

 ########################
 #        RUNNER        #
 ########################

 # Production image, copy all the files and run next
 # TODO: re-evaluate if emulation is still necessary after moving to node 18
 FROM --platform=linux/amd64 node:16-alpine AS runner
 # WORKDIR /usr/app
 WORKDIR /app

 ENV NODE_ENV production
 # Uncomment the following line in case you want to disable telemetry during runtime.
 # ENV NEXT_TELEMETRY_DISABLED 1

 RUN addgroup --system --gid 1001 nodejs
 RUN adduser --system --uid 1001 nextjs

 COPY --from=builder /app/next.config.mjs ./
 COPY --from=builder /app/public ./public
 COPY --from=builder /app/package.json ./package.json

 # Automatically leverage output traces to reduce image size
 # https://nextjs.org/docs/advanced-features/output-file-tracing
 COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
 COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

 USER nextjs

 EXPOSE 3000

 ENV PORT 3000

 CMD ["node", "server.js"]
