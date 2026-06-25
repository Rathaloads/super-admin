import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** JWT 鉴权守卫 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
