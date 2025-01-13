# 构建阶段
FROM node:18.20.4-alpine3.20 AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build

# 生产阶段
FROM node:18.20.4-alpine3.20
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3333
CMD ["node", "dist/main"]
d