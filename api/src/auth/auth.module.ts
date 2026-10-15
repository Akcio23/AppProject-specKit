import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { SessionsService } from './sessions.service';
import { JwtStrategy } from './jwt.strategy';

import { MailModule } from '../mail/mail.module';
import { ResetCodesService } from './reset-codes.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    SessionsService,
    ResetCodesService,
    JwtStrategy,
  ],
  exports: [
    AuthService,
    SessionsService,
    ResetCodesService,
    JwtStrategy,
    PassportModule,
  ],
})
export class AuthModule {}
