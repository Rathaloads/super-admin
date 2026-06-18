import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Redis } from 'ioredis';
import { Repository } from 'typeorm';
import { REDIS_CLIENT } from '../../redis/redis.module';
import { SysUserEntity } from './entities/sys-user.entity';

/** 用户缓存 TTL（秒） */
const USER_CACHE_TTL = 300;

/** 登录 Token TTL（秒） */
const TOKEN_CACHE_TTL = 3600;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(SysUserEntity)
    private readonly userRepository: Repository<SysUserEntity>,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  /** 按用户名查询用户（Cache-Aside：先 Redis 后 MySQL） */
  async findUserByUsername(username: string): Promise<{
    user: SysUserEntity | null;
    fromCache: boolean;
  }> {
    const cacheKey = `user:${username}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      this.logger.debug(`命中 Redis 缓存: ${cacheKey}`);
      return { user: JSON.parse(cached) as SysUserEntity, fromCache: true };
    }

    const user = await this.userRepository.findOne({ where: { nickname: username } });
    if (user) {
      await this.redis.setex(cacheKey, USER_CACHE_TTL, JSON.stringify(user));
      this.logger.debug(`写入 Redis 缓存: ${cacheKey}`);
    }

    return { user, fromCache: false };
  }

  /** 生成并缓存登录 Token */
  async createLoginToken(username: string): Promise<string> {
    const token = `token_${username}_${Date.now()}`;
    await this.redis.setex(`token:${username}`, TOKEN_CACHE_TTL, token);
    return token;
  }

  /** 从 Redis 读取登录 Token */
  async getLoginToken(username: string): Promise<string | null> {
    return this.redis.get(`token:${username}`);
  }
}
