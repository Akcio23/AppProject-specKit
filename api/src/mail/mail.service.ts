import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST', 'localhost');
    const port = Number(this.config.get<number>('SMTP_PORT', 1025));
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    this.from = this.config.get<string>(
      'SMTP_FROM',
      'Bíblia Sagrada Mobile <nao-responda@bibliamobile.app>',
    );

    const transportOptions: nodemailer.TransportOptions = {
      host,
      port,
      secure: port === 465,
      ...(user && pass
        ? {
            auth: { user, pass },
          }
        : {}),
    } as nodemailer.TransportOptions;

    this.transporter = nodemailer.createTransport(transportOptions);
    this.logger.log(`MailService inicializado via SMTP ${host}:${port}`);
  }

  /**
   * Envia o código de 6 dígitos para recuperação de senha
   */
  async sendPasswordResetCode(email: string, code: string, name?: string): Promise<boolean> {
    const userName = name?.trim() || 'Leitor';

    const subject = `${code} é seu código de recuperação de senha — Bíblia Sagrada Mobile`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fa; color: #1e293b; margin: 0; padding: 24px; }
          .container { max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 32px; margin-bottom: 8px; }
          .title { font-size: 20px; font-weight: bold; color: #0f172a; margin: 0; }
          .subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
          .code-box { background-color: #f1f5f9; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0; border: 1px dashed #cbd5e1; }
          .code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #3b82f6; font-family: monospace; }
          .warning { font-size: 13px; color: #64748b; line-height: 1.5; margin-top: 20px; }
          .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">📖✨</div>
            <h1 class="title">Bíblia Sagrada Mobile</h1>
            <p class="subtitle">Recuperação de Acesso à sua Conta</p>
          </div>
          <p>Olá, <strong>${userName}</strong>!</p>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta. Use o código de 6 dígitos abaixo para continuar no aplicativo:</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
          </div>

          <p class="warning">
            ⏱️ Este código é válido por <strong>15 minutos</strong>.<br>
            🔒 Se não foi você quem solicitou, fique em paz: nenhuma alteração foi feita e você pode ignorar este e-mail.
          </p>

          <div class="footer">
            Bíblia Sagrada Mobile • Inspirando paz, reflexão e comunhão.
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: this.from,
        to: email,
        subject,
        html,
        text: `Olá, ${userName}!\n\nSeu código de recuperação de senha da Bíblia Sagrada Mobile é: ${code}\n\nEste código expira em 15 minutos.\nSe não foi você que solicitou, ignore esta mensagem.`,
      });

      this.logger.log(`E-mail de recuperação enviado para ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Falha ao enviar e-mail para ${email}:`, error);
      return false;
    }
  }
}
