FROM node:20-alpine
WORKDIR /app

# Build tools required by better-sqlite3 native bindings
RUN apk add --no-cache python3 make g++

# Copy workspace manifests first — maximizes Docker layer cache
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json     ./apps/backend/

# Install all workspace dependencies (compiles better-sqlite3)
RUN npm ci --workspaces --if-present

# Copy source
COPY packages/shared ./packages/shared
COPY apps/backend    ./apps/backend

# Build shared types first, then backend
RUN npm run build --workspace=apps/backend

# Persistent data directory for SQLite
RUN mkdir -p /data

ENV NODE_ENV=production
ENV DB_PATH=/data/glup.db

# Railway inyecta PORT dinámicamente — no fijar valor aquí
EXPOSE ${PORT:-3000}

CMD ["node", "apps/backend/dist/server.js"]
