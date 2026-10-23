# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm@10
# 先装依赖（利用 Docker 层缓存，依赖不变时不会重新安装）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# 必须用 SWC 构建：tsc 产物的部分 CJS 互操作在 node 直跑时会出问题
RUN npx nest build -b swc

# 生产阶段
FROM node:20-alpine
WORKDIR /app
# 完整时区设置（Alpine 需要软链接 TZ data）
RUN apk add --no-cache tzdata \
    && ln -snf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' > /etc/timezone
ENV TZ=Asia/Shanghai
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 3333
# 健康检查：打 Terminus 的 /health 探针（任一检查项失败返回 503）
# node:20-alpine 自带 busybox wget，无需额外安装；start-period 给应用启动留 30s 缓冲
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3333/health || exit 1
CMD ["node", "dist/main"]
