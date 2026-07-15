/** 从环境变量读取的配置项 */
export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  database: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? 'super_admin',
    synchronize: process.env.DB_SYNC === 'true',
    logger: process.env.DB_LOGGER === 'false',
  },
  redis: {
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB ?? '0', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'super-admin-dev-secret',
    /** 过期时间（秒），默认 7 天 */
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '604800', 10),
  },
});
