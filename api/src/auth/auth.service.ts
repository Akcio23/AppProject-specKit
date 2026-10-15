import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { PasswordService } from './password.service';
import { SessionsService } from './sessions.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  createdAt: string;
}

export interface PreferencesDto {
  theme: string;
  translationId: string;
  updatedAt: string;
}

export interface AuthTokensDto {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
}

export interface AuthResultDto extends AuthTokensDto {
  user: UserDto;
  preferences: PreferencesDto;
}

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_TTL_SECONDS = 15 * 60; // 15 minutos

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly sessionsService: SessionsService,
    private readonly jwtService: JwtService,
  ) {}

  private generateAccessToken(userId: string, sessionId: string, email: string): string {
    return this.jwtService.sign(
      {
        sub: userId,
        sid: sessionId,
        email,
      },
      {
        expiresIn: this.ACCESS_TOKEN_TTL_SECONDS,
      },
    );
  }

  /**
   * Cadastro de nova conta (FR-001 a FR-006).
   */
  async register(dto: RegisterDto): Promise<AuthResultDto> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const passwordHash = await this.passwordService.hash(dto.password);

    // Criação atômica de usuário e preferências padrão
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        preference: {
          create: {
            theme: 'dark',
            translationId: 'almeida',
          },
        },
      },
      include: {
        preference: true,
      },
    });

    const session = await this.sessionsService.createSession(user.id, dto.deviceName);
    const accessToken = this.generateAccessToken(user.id, session.sessionId, user.email);

    return {
      accessToken,
      accessTokenExpiresIn: this.ACCESS_TOKEN_TTL_SECONDS,
      refreshToken: session.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoKey ? `/files/avatars/${user.photoKey}` : null,
        createdAt: user.createdAt.toISOString(),
      },
      preferences: {
        theme: user.preference?.theme ?? 'dark',
        translationId: user.preference?.translationId ?? 'almeida',
        updatedAt: user.preference?.updatedAt.toISOString() ?? new Date().toISOString(),
      },
    };
  }

  /**
   * Login com anti-enumeração e mitigação de força bruta (FR-007 a FR-009).
   */
  async login(dto: LoginDto): Promise<AuthResultDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { preference: true },
    });

    // Se o e-mail não existir: executa verify dummy para evitar detecção por tempo de resposta
    if (!user) {
      await this.passwordService.verifyDummy(dto.password);
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    // Checa bloqueio temporário por tentativas falhas excessivas
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingSeconds = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / 1000,
      );
      throw new HttpException(
        {
          code: 'TOO_MANY_ATTEMPTS',
          message: `Muitas tentativas falhas. Tente novamente em ${remainingSeconds} segundos.`,
          details: { retryAfterSeconds: remainingSeconds },
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const isPasswordValid = await this.passwordService.verify(
      user.passwordHash,
      dto.password,
    );

    if (!isPasswordValid) {
      const nextFailCount = user.failedLoginCount + 1;
      const shouldLock = nextFailCount >= 5;
      const lockedUntil = shouldLock ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginCount: nextFailCount,
          lockedUntil,
        },
      });

      if (shouldLock) {
        throw new HttpException(
          {
            code: 'TOO_MANY_ATTEMPTS',
            message: 'Muitas tentativas falhas consecutivas. Sua conta foi bloqueada por 15 minutos.',
            details: { retryAfterSeconds: 900 },
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    // Login com sucesso: reseta contadores de falhas
    if (user.failedLoginCount > 0 || user.lockedUntil) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginCount: 0,
          lockedUntil: null,
        },
      });
    }

    const session = await this.sessionsService.createSession(user.id, dto.deviceName);
    const accessToken = this.generateAccessToken(user.id, session.sessionId, user.email);

    return {
      accessToken,
      accessTokenExpiresIn: this.ACCESS_TOKEN_TTL_SECONDS,
      refreshToken: session.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoKey ? `/files/avatars/${user.photoKey}` : null,
        createdAt: user.createdAt.toISOString(),
      },
      preferences: {
        theme: user.preference?.theme ?? 'dark',
        translationId: user.preference?.translationId ?? 'almeida',
        updatedAt: user.preference?.updatedAt.toISOString() ?? new Date().toISOString(),
      },
    };
  }

  /**
   * Rotação transparente de tokens com detecção de reuso (FR-010, FR-011).
   */
  async refresh(dto: RefreshTokenDto): Promise<AuthTokensDto> {
    const rotated = await this.sessionsService.rotateSession(dto.refreshToken);

    const user = await this.prisma.user.findUnique({
      where: { id: rotated.userId },
      select: { email: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const accessToken = this.generateAccessToken(
      rotated.userId,
      rotated.sessionId,
      user.email,
    );

    return {
      accessToken,
      accessTokenExpiresIn: this.ACCESS_TOKEN_TTL_SECONDS,
      refreshToken: rotated.refreshToken,
    };
  }

  /**
   * Encerramento voluntário de sessão no aparelho (FR-012).
   */
  async logout(dto: RefreshTokenDto): Promise<void> {
    await this.sessionsService.revokeSession(dto.refreshToken);
  }
}
