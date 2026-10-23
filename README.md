<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

NestJS 10 + TypeScript 的练手/实验后端，按功能拆成独立模块（认证、上传、短链、二维码登录、文章、邮件、天气、健康检查等）。技术栈：TypeORM(MySQL)、Redis、MinIO、Casbin、nestjs-i18n、Winston、Docker。

## Installation

```bash
$ pnpm install
# 复制环境变量模板并按需填写（真实密钥不要提交）
$ cp .env.example .env.development
```

### 配置与密钥

所有密钥只从环境变量读取（`.env.development` → `.env` → 进程环境变量，后者覆盖前者），代码里不再有硬编码凭证。生产环境（`NODE_ENV=production`）缺少 `JWT_SECRET` / `SESSION_SECRET` 会直接启动失败，避免用开发默认值上线。

| 变量 | 说明 |
| --- | --- |
| `JWT_SECRET` / `SESSION_SECRET` | 必填（生产），JWT 签名 / session 加密 |
| `JWT_EXPIRES_IN` | token 有效期，默认 `60m` |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | 首次启动且 user 表为空时自动创建的管理员；密码留空则随机生成并打印到日志 |
| `CORS_ORIGIN` | 允许的来源，逗号分隔；留空反射请求来源（仅开发） |
| `DB_SYNCHRONIZE` | 是否启动时自动改表；生产默认 `false` |
| `MYSQL_*` / `REDIS_*` | 数据库连接 |
| `MAIL_*` / `WEATHER_API_KEY` / `FEISHU_*` / `MINIO_*` | 第三方服务 |

> 历史版本曾把 JWT secret、邮箱授权码、天气 key、飞书 webhook 硬编码在源码里，且 `.env.development` 被提交。这些值已全部移除并加入 `.gitignore`，**建议到各平台重置这些凭证**（旧值仍留在 git 历史中）。

### 认证与权限

- 注册接口用 bcrypt（cost 10）存密码；历史遗留的明文密码在下次成功登录时自动升级为哈希。
- `AuthGuard` 校验 `Authorization: Bearer <token>`，解析出 `{ userId, username, role }` 挂到 `request.user`。
- `@Auth()` 要求登录；`@Auth('admin')` 额外要求角色；接口级权限由 Casbin 判定（`src/assets/casbin/policy.csv`），**未命中任何策略即拒绝**。
- 需要鉴权的接口：`/users*`、`/mail/send`、`/system/status`、`/qrcode/confirm/:id`。`/health` 与 `/sso/login`、`/mail/code` 保持匿名。

```bash
# 登录拿 token
curl -s -X POST http://localhost:3333/sso/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"<密码>"}'

# 带 token 访问受保护接口
curl -s http://localhost:3333/users -H "Authorization: Bearer <access_token>"
```

## 请求链路追踪（Request ID）

每个 HTTP 请求都会经过一个全局中间件 `RequestIdMiddleware`，它会：

1. **优先沿用上游**请求头里的 `X-Request-Id`（网关 / Nginx / 前端可以传进来，便于跨服务串联日志）。
2. **否则**用 Node 自带的 `crypto.randomUUID()` 生成一个 UUID。
3. 写入到 `req.requestId`。
4. 写入到响应头 `X-Request-Id`，前端可以通过这个头反查日志。
5. 通过 `AsyncLocalStorage` 存到请求级上下文，整条链路（Interceptor / Service / Filter / Logger）任意位置都能用 `getRequestId()` 取到。

**生效位置：**

| 位置 | 是否带 requestId | 备注 |
| --- | --- | --- |
| `req.requestId` | ✅ | Express Request 上直接可读 |
| 响应头 `X-Request-Id` | ✅ | 客户端可直接看到 |
| `RequestLogInterceptor` 日志 | ✅ | 形如 `[<uuid>] GET /users ...` |
| `HttpExceptionFilter` 异常响应体 | ✅ | 响应 JSON 多了 `requestId` 字段 |
| 任意业务代码 | ✅ | `import { getRequestId } from 'src/common/context/request-id.context'` |

**调用示例：**

```ts
import { getRequestId } from 'src/common/context/request-id.context';

@Injectable()
export class MyService {
  doSomething() {
    const id = getRequestId(); // 当前请求的 ID，不需要传参
    this.logger.log(`[${id}] 处理业务...`);
  }
}
```

**手动测试：**

```bash
# 不传 X-Request-Id，服务端自动生成
curl -i http://localhost:3333/health
# HTTP/1.1 200 OK
# X-Request-Id: 9f1b2c3d-4e5f-6789-abcd-ef0123456789
# ...

# 客户端传 X-Request-Id，服务端沿用同一个 ID
curl -i -H "X-Request-Id: my-trace-001" http://localhost:3333/health
# X-Request-Id: my-trace-001
```

## 响应格式

成功响应由 `TransformIntercepter` 统一包装：

```json
{ "code": 200, "data": {}, "msg": "请求成功", "duration": 3 }
```

异常响应由 `HttpExceptionFilter` 统一格式化（含 `requestId`）：

```json
{ "errCode": 400, "errMsg": "参数校验失败", "requestId": "…", "path": "/users/register", "timestamp": "…" }
```

`main.ts` 不再重复注册全局过滤器（曾导致 i18n 校验错误被前一个过滤器吞掉），所有异常统一由 `CommonModule` 里的 `APP_FILTER` 处理。

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
