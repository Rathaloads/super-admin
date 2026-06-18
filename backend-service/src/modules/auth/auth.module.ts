import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SysUserEntity } from './entities/sys-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SysUserEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
