import { join } from 'node:path';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

/** 日志文件目录（相对于项目根 backend-service） */
const logsDir = join(process.cwd(), 'logs');

/** 文件日志格式：JSON，便于检索与归档 */
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

/** 控制台日志格式：开发时更易读 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, context, ...meta }) => {
    const ctx = context ? `[${context}] ` : '';
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}: ${ctx}${message}${extra}`;
  }),
);

export const WinstonLoggerModule = WinstonModule.forRoot({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [
    new winston.transports.Console({ 
      format: consoleFormat,
      level: 'debug',
    }),
    new winston.transports.File({
      filename: join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat,
    }),
    new winston.transports.File({
      filename: join(logsDir, 'info.log'),
      format: fileFormat,
      level: 'info',
    }),
  ],
});
