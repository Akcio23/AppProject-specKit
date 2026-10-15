import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '@/prisma/prisma.service';
import { PasswordService } from './password.service';
import { SessionsService } from './sessions.service';
import { MailService } from '../mail/mail.service';
import { ResetCodesService } from './reset-codes.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };
  let passwordService: {
    hash: jest.Mock;
    verify: jest.Mock;
    verifyDummy: jest.Mock;
  };
  let sessionsService: {
    createSession: jest.Mock;
    rotateSession: jest.Mock;
    revokeSession: jest.Mock;
    revokeAllUserSessions: jest.Mock;
  };
  let jwtService: {
    sign: jest.Mock;
  };
  let mailService: {
    sendPasswordResetEmail: jest.Mock;
  };
  let resetCodesService: {
    createResetCode: jest.Mock;
    verifyAndConsumeCode: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    passwordService = {
      hash: jest.fn(),
      verify: jest.fn(),
      verifyDummy: jest.fn(),
    };

    sessionsService = {
      createSession: jest.fn(),
      rotateSession: jest.fn(),
      revokeSession: jest.fn(),
      revokeAllUserSessions: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    mailService = {
      sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
    };

    resetCodesService = {
      createResetCode: jest.fn(),
      verifyAndConsumeCode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: PasswordService, useValue: passwordService },
        { provide: SessionsService, useValue: sessionsService },
        { provide: JwtService, useValue: jwtService },
        { provide: MailService, useValue: mailService },
        { provide: ResetCodesService, useValue: resetCodesService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('deve cadastrar um novo usuário com sucesso e retornar tokens', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      passwordService.hash.mockResolvedValue('hashed-pass');

      const mockCreatedUser = {
        id: 'user-uuid-1',
        name: 'Maria Teste',
        email: 'maria@example.com',
        photoKey: null,
        createdAt: new Date('2026-01-01'),
        preference: {
          theme: 'dark',
          translationId: 'almeida',
          updatedAt: new Date('2026-01-01'),
        },
      };

      prisma.user.create.mockResolvedValue(mockCreatedUser);
      sessionsService.createSession.mockResolvedValue({
        refreshToken: 'refresh-token-1',
        sessionId: 'session-1',
      });

      const result = await service.register({
        name: 'Maria Teste',
        email: 'maria@example.com',
        password: 'Password@123',
        deviceName: 'Pixel 8',
      });

      expect(result.user.id).toBe('user-uuid-1');
      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.refreshToken).toBe('refresh-token-1');
      expect(result.preferences.theme).toBe('dark');
    });

    it('deve lançar ConflictException se o e-mail já estiver cadastrado', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing-id' });

      await expect(
        service.register({
          name: 'Duplicado',
          email: 'maria@example.com',
          password: 'Password@123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('deve realizar login com sucesso se as credenciais forem válidas', async () => {
      const mockUser = {
        id: 'user-uuid-1',
        name: 'João Login',
        email: 'joao@example.com',
        passwordHash: 'valid-hash',
        photoKey: null,
        failedLoginCount: 0,
        lockedUntil: null,
        createdAt: new Date('2026-01-01'),
        preference: {
          theme: 'light',
          translationId: 'nvi',
          updatedAt: new Date('2026-01-01'),
        },
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      passwordService.verify.mockResolvedValue(true);
      prisma.user.update.mockResolvedValue(mockUser);
      sessionsService.createSession.mockResolvedValue({
        refreshToken: 'refresh-token-login',
        sessionId: 'session-login',
      });

      const result = await service.login({
        email: 'joao@example.com',
        password: 'Password@123',
      });

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.refreshToken).toBe('refresh-token-login');
      expect(result.user.email).toBe('joao@example.com');
      expect(passwordService.verify).toHaveBeenCalledWith('valid-hash', 'Password@123');
    });

    it('deve rejeitar e executar dummy verify se o usuário não existir (anti-timing)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'inexistente@example.com',
          password: 'QualquerCoisa!',
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(passwordService.verifyDummy).toHaveBeenCalledTimes(1);
    });

    it('deve rejeitar e incrementar tentativas se a senha for incorreta', async () => {
      const mockUser = {
        id: 'user-uuid-1',
        email: 'joao@example.com',
        passwordHash: 'valid-hash',
        failedLoginCount: 1,
        lockedUntil: null,
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      passwordService.verify.mockResolvedValue(false);
      prisma.user.update.mockResolvedValue({});

      await expect(
        service.login({
          email: 'joao@example.com',
          password: 'SenhaIncorreta!',
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-uuid-1' },
          data: expect.objectContaining({
            failedLoginCount: 2,
          }),
        }),
      );
    });
  });

  describe('refresh', () => {
    it('deve emitir novo access token e rotacionar refresh token', async () => {
      sessionsService.rotateSession.mockResolvedValue({
        refreshToken: 'new-refresh-token',
        sessionId: 'session-uuid',
        userId: 'user-uuid',
      });

      prisma.user.findUnique.mockResolvedValue({
        id: 'user-uuid',
        email: 'user@example.com',
      });

      const result = await service.refresh({
        refreshToken: 'old-refresh-token',
      });

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.refreshToken).toBe('new-refresh-token');
    });
  });
});
