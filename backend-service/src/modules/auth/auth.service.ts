import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import type { Redis } from 'ioredis';
import { Repository } from 'typeorm';
import { BusinessException } from '../../common/exceptions/business.exception';
import { REDIS_CLIENT } from '../../redis/redis.module';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SysUserEntity } from './entities/sys-user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { SafeUser } from './interfaces/safe-user.interface';
import { ERROR_CODE } from 'src/common/constant/error-code';

/** 用户缓存 TTL（秒） */
const USER_CACHE_TTL = 300;

/** 密码哈希盐轮数 */
const BCRYPT_SALT_ROUNDS = 10;

/** 登录成功响应 */
export interface AuthResult {
  token: string;
  user: SafeUser;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(SysUserEntity)
    private readonly userRepository: Repository<SysUserEntity>,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    private readonly jwtService: JwtService,
  ) {}

  /** 用户注册 */
  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.userRepository.findOne({
      where: { mail: dto.mail },
    });
    if (existing) {
      throw new BusinessException(ERROR_CODE.EMAIL_ALREADY_EXISTS.code, ERROR_CODE.EMAIL_ALREADY_EXISTS.message);
    }

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);
    const user = this.userRepository.create({
      mail: dto.mail,
      password: hashedPassword,
      nickname: dto.nickname ?? null,
    });
    const saved = await this.userRepository.save(user);

    await this.cacheUser(saved);
    this.logger.log(`用户注册成功: ${saved.mail}`);

    return this.buildAuthResult(saved);
  }

  /** 用户登录 */
  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.findUserByMail(dto.mail);
    if (!user) {
      throw new BusinessException(ERROR_CODE.USER_NOT_FOUND.code, ERROR_CODE.USER_NOT_FOUND.message);
    }

    const passwordMatched = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatched) {
      throw new BusinessException(ERROR_CODE.PASSWORD_INCORRECT.code, ERROR_CODE.PASSWORD_INCORRECT.message);
    }

    this.logger.log(`用户登录成功: ${user.mail}`);
    return this.buildAuthResult(user);
  }

  /** 按邮箱查询用户（Cache-Aside：先 Redis 后 MySQL） */
  async findUserByMail(mail: string): Promise<SysUserEntity | null> {
    const cacheKey = this.getUserCacheKey(mail);
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      this.logger.debug(`命中 Redis 缓存: ${cacheKey}`);
      return JSON.parse(cached) as SysUserEntity;
    }

    const user = await this.userRepository.findOne({ where: { mail } });
    if (user) {
      await this.cacheUser(user);
    }

    return user;
  }

  /** 按 ID 查询用户 */
  async findUserById(id: number): Promise<SysUserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /** 剔除敏感字段，返回安全用户信息 */
  toSafeUser(user: SysUserEntity): SafeUser {
    return {
      id: user.id,
      mail: user.mail,
      nickname: user.nickname,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  }

  /** 签发 JWT 并组装登录响应 */
  private buildAuthResult(user: SysUserEntity): AuthResult {
    const payload: JwtPayload = { sub: user.id, mail: user.mail };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: this.toSafeUser(user),
    };
  }

  /** 写入用户缓存 */
  private async cacheUser(user: SysUserEntity): Promise<void> {
    const cacheKey = this.getUserCacheKey(user.mail);
    await this.redis.setex(cacheKey, USER_CACHE_TTL, JSON.stringify(user));
    this.logger.debug(`写入 Redis 缓存: ${cacheKey}`);
  }

  private getUserCacheKey(mail: string): string {
    return `user:${mail}`;
  }
}
