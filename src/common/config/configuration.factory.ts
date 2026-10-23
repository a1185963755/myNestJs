/**
 * 应用配置工厂：所有配置项一律从环境变量读取，代码里不保留任何密钥。
 *
 * 加载顺序（见 AppModule 的 ConfigModule.forRoot）：
 *   .env.development → .env → 真实进程环境变量（后者覆盖前者）。
 *
 * 生产环境（NODE_ENV=production）下缺少 JWT_SECRET / SESSION_SECRET 会直接抛错，
 * 避免用开发默认值把线上跑起来。
 */

const toInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBool = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined || value.trim() === '') return fallback;
  return value === 'true' || value === '1';
};

const requireInProduction = (
  key: string,
  value: string | undefined,
  devFallback: string,
): string => {
  const trimmed = value?.trim();
  if (trimmed) return trimmed;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`缺少必需的环境变量 ${key}`);
  }
  return devFallback;
};

export default () => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  return {
    NODE_ENV: nodeEnv,
    PORT: toInt(process.env.PORT, 3333),
    HTTP_TIMEOUT: toInt(process.env.HTTP_TIMEOUT, 10000),
    /** 允许跨域的来源，逗号分隔；留空表示反射请求来源（开发默认） */
    CORS_ORIGIN: process.env.CORS_ORIGIN || '',

    SESSION_SECRET: requireInProduction(
      'SESSION_SECRET',
      process.env.SESSION_SECRET,
      'dev-only-session-secret',
    ),
    JWT_SECRET: requireInProduction(
      'JWT_SECRET',
      process.env.JWT_SECRET,
      'dev-only-jwt-secret',
    ),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '60m',

    /** 首次启动时自动创建的管理员账号（user 表为空时才生效） */
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',

    DB: {
      host: process.env.MYSQL_HOST || 'localhost',
      port: toInt(process.env.MYSQL_PORT, 3306),
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'mydb',
      // 生产环境默认关闭自动改表；需要时用 DB_SYNCHRONIZE=true 显式打开
      synchronize: toBool(process.env.DB_SYNCHRONIZE, nodeEnv !== 'production'),
    },

    REDIS: {
      host: process.env.REDIS_HOST || 'localhost',
      port: toInt(process.env.REDIS_PORT, 6379),
      password: process.env.REDIS_PASSWORD || undefined,
    },

    MAIL: {
      host: process.env.MAIL_HOST || 'smtp.qq.com',
      port: toInt(process.env.MAIL_PORT, 587),
      user: process.env.MAIL_USER || '',
      pass: process.env.MAIL_PASS || '',
      from: process.env.MAIL_FROM || process.env.MAIL_USER || '',
    },

    WEATHER_API_KEY: process.env.WEATHER_API_KEY || '',

    FEISHU_WEBHOOK_URL: process.env.FEISHU_WEBHOOK_URL || '',
    FEISHU_SECRET: process.env.FEISHU_SECRET || '',

    MINIO: {
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: toInt(process.env.MINIO_PORT, 9000),
      useSSL: toBool(process.env.MINIO_USE_SSL, false),
      accessKey: process.env.MINIO_ACCESS_KEY || '',
      secretKey: process.env.MINIO_SECRET_KEY || '',
    },
  };
};
