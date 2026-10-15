import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { PrismaService } from '@/prisma/prisma.service';
import * as crypto from 'crypto';

describe('SessionsService', () => {
  let service: SessionsService;
  let prisma: {
    session: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      session: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('createSession', () => {
    it('deve gerar novo token opaco e persistir hash da sessão', async () => {
      prisma.session.create.mockResolvedValue({
        id: 'session-uuid-1',
        userId: 'user-uuid-1',
        refreshTokenHash: 'hash-mock',
        deviceName: 'iPhone 15',
      });

      const result = await service.createSession('user-uuid-1', 'iPhone 15');

      expect(result.refreshToken).toBeDefined();
      expect(result.sessionId).toBe('session-uuid-1');
      expect(prisma.session.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('rotateSession', () => {
    it('deve rotacionar token com sucesso em sessão ativa', async () => {
      const oldRawToken = 'raw-token-12345';
      const oldHash = crypto.createHash('sha256').update(oldRawToken).digest('hex');

      prisma.session.findUnique.mockResolvedValue({
        id: 'session-uuid-1',
        userId: 'user-uuid-1',
        refreshTokenHash: oldHash,
        revokedAt: null,
      });

      prisma.session.update.mockResolvedValue({});

      const result = await service.rotateSession(oldRawToken);

      expect(result.refreshToken).toBeDefined();
      expect(result.refreshToken).not.toBe(oldRawToken);
      expect(result.sessionId).toBe('session-uuid-1');
      expect(result.userId).toBe('user-uuid-1');
      expect(prisma.session.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'session-uuid-1' },
          data: expect.objectContaining({
            previousTokenHash: oldHash,
          }),
        }),
      );
    });

    it('deve lançar UnauthorizedException se a sessão estiver revogada', async () => {
      const oldRawToken = 'raw-token-revoked';
      const oldHash = crypto.createHash('sha256').update(oldRawToken).digest('hex');

      prisma.session.findUnique.mockResolvedValue({
        id: 'session-uuid-1',
        userId: 'user-uuid-1',
        refreshTokenHash: oldHash,
        revokedAt: new Date(),
      });

      await expect(service.rotateSession(oldRawToken)).rejects.toThrow(UnauthorizedException);
    });

    it('deve detectar tentativa de reuso e revogar a sessão inteira com token_reuse', async () => {
      const stolenToken = 'stolen-token';
      const stolenHash = crypto.createHash('sha256').update(stolenToken).digest('hex');

      // Não acha no refreshTokenHash atual
      prisma.session.findUnique.mockResolvedValue(null);

      // Acha no previousTokenHash (tentativa de replay do token anterior)
      prisma.session.findFirst.mockResolvedValue({
        id: 'session-uuid-reused',
        userId: 'victim-user',
        previousTokenHash: stolenHash,
      });

      prisma.session.update.mockResolvedValue({});

      await expect(service.rotateSession(stolenToken)).rejects.toThrow(UnauthorizedException);

      expect(prisma.session.update).toHaveBeenCalledWith({
        where: { id: 'session-uuid-reused' },
        data: {
          revokedAt: expect.any(Date),
          revokedReason: 'token_reuse',
        },
      });
    });
  });

  describe('revokeSession', () => {
    it('deve revogar uma sessão específica se ela estiver ativa', async () => {
      const rawToken = 'token-to-revoke';
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

      prisma.session.findUnique.mockResolvedValue({
        id: 'session-uuid-1',
        refreshTokenHash: tokenHash,
        revokedAt: null,
      });
      prisma.session.update.mockResolvedValue({});

      await service.revokeSession(rawToken);

      expect(prisma.session.update).toHaveBeenCalledWith({
        where: { id: 'session-uuid-1' },
        data: {
          revokedAt: expect.any(Date),
          revokedReason: 'logout',
        },
      });
    });
  });

  describe('revokeAllUserSessions', () => {
    it('deve revogar todas as sessões ativas do usuário', async () => {
      prisma.session.updateMany.mockResolvedValue({ count: 3 });

      await service.revokeAllUserSessions('user-uuid-1', 'password_changed');

      expect(prisma.session.updateMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-uuid-1',
          revokedAt: null,
        },
        data: {
          revokedAt: expect.any(Date),
          revokedReason: 'password_changed',
        },
      });
    });
  });
});
