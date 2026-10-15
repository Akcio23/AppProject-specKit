import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResetCodesService {
  private readonly logger = new Logger(ResetCodesService.name);
  private readonly pepper: string;
  private readonly CODE_TTL_MINUTES = 15;
  private readonly MAX_ATTEMPTS = 5;
  private readonly MAX_REQUESTS_IN_WINDOW = 3;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.pepper = this.config.get<string>('RESET_CODE_PEPPER', 'dev_pepper_default');
  }

  /**
   * Calcula o hash HMAC-SHA256 do código com o segredo pepper
   */
  private hashHmac(code: string): string {
    return crypto.createHmac('sha256', this.pepper).update(code.trim()).digest('hex');
  }

  /**
   * Gera um código de 6 dígitos para o usuário e persiste seu HMAC
   */
  async generateCode(userId: string): Promise<string> {
    const windowStart = new Date(Date.now() - this.CODE_TTL_MINUTES * 60 * 1000);

    // Checa taxa de requisições recentes (máx 3 códigos em 15 minutos)
    const recentRequests = await this.prisma.passwordResetCode.count({
      where: {
        userId,
        createdAt: { gte: windowStart },
      },
    });

    if (recentRequests >= this.MAX_REQUESTS_IN_WINDOW) {
      throw new HttpException(
        {
          code: 'TOO_MANY_RESET_REQUESTS',
          message:
            'Você já solicitou muitos códigos recentemente. Por favor, aguarde alguns minutos antes de tentar novamente.',
          details: { retryAfterMinutes: this.CODE_TTL_MINUTES },
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Invalida códigos anteriores não usados deste usuário
    await this.prisma.passwordResetCode.updateMany({
      where: {
        userId,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });

    // Gera 6 dígitos aleatórios criptograficamente seguros (100000 a 999999)
    const rawCode = crypto.randomInt(100000, 1000000).toString();
    const codeHmac = this.hashHmac(rawCode);
    const expiresAt = new Date(Date.now() + this.CODE_TTL_MINUTES * 60 * 1000);

    await this.prisma.passwordResetCode.create({
      data: {
        userId,
        codeHmac,
        expiresAt,
        attempts: 0,
      },
    });

    this.logger.log(`Novo código de recuperação gerado para o usuário ${userId}`);
    return rawCode;
  }

  /**
   * Valida o código informado pelo usuário.
   * Se válido, marca como usado e retorna o userId.
   * Se inválido ou expirado, lança exceção com feedback seguro.
   */
  async verifyAndConsumeCode(userId: string, code: string): Promise<boolean> {
    const activeCode = await this.prisma.passwordResetCode.findFirst({
      where: {
        userId,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!activeCode) {
      throw new BadRequestException('Código de recuperação inválido ou expirado.');
    }

    if (activeCode.attempts >= this.MAX_ATTEMPTS) {
      // Invalida permanentemente se excedeu tentativas
      await this.prisma.passwordResetCode.update({
        where: { id: activeCode.id },
        data: { usedAt: new Date() },
      });
      throw new BadRequestException(
        'Limite de tentativas excedido para este código. Solicite um novo código.',
      );
    }

    const providedHmac = this.hashHmac(code);

    // Comparação em tempo constante para mitigar timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(providedHmac, 'hex'),
      Buffer.from(activeCode.codeHmac, 'hex'),
    );

    if (!isValid) {
      const nextAttempts = activeCode.attempts + 1;
      const shouldInvalidate = nextAttempts >= this.MAX_ATTEMPTS;

      await this.prisma.passwordResetCode.update({
        where: { id: activeCode.id },
        data: {
          attempts: nextAttempts,
          usedAt: shouldInvalidate ? new Date() : null,
        },
      });

      if (shouldInvalidate) {
        throw new BadRequestException(
          'Código incorreto. Limite de tentativas excedido. Solicite um novo código.',
        );
      }

      const remaining = this.MAX_ATTEMPTS - nextAttempts;
      throw new BadRequestException(
        `Código incorreto. Você ainda tem ${remaining} tentativa(s).`,
      );
    }

    // Código correto: consome o código
    await this.prisma.passwordResetCode.update({
      where: { id: activeCode.id },
      data: { usedAt: new Date() },
    });

    return true;
  }
}
