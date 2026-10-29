# ---- build ----
FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ ca-certificates openssl && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npm run build

# ---- run ----
FROM node:22-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production PORT=3000 DATABASE_URL=file:/app/data/zeropitie.db NEXT_TELEMETRY_DISABLED=1
COPY --from=build /app ./
VOLUME ["/app/data"]
EXPOSE 3000
# Apply migrations, (re)create the admin from env, start
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npx next start -p ${PORT}"]
