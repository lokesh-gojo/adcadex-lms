# ========================================================
# Acadex LMS Production Cloud Container (Dockerfile)
# Lightweight, Secure, Non-Root Node.js 20 Alpine Image
# ========================================================

FROM node:20-alpine AS builder

WORKDIR /app

# Copy server package manifests
COPY server/package*.json ./

# Install all dependencies including devDependencies for build/testing
RUN npm ci || npm install

# Copy server application source code
COPY server/ ./

# Stage 2: Minimal Production Image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install dumb-init for proper signal forwarding and PID 1 management
RUN apk add --no-cache dumb-init

# Copy dependencies and application from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/data ./data

# Security: Run as non-root node user
USER node

EXPOSE 5000

# Healthcheck definition
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]
