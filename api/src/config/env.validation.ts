export interface EnvironmentVariables {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  RESET_CODE_PEPPER: string;
  ALLOWED_ORIGINS: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_FROM: string;
}

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const port = Number(config.PORT ?? 3000);
  const nodeEnv = (config.NODE_ENV as string) ?? 'development';
  const databaseUrl = config.DATABASE_URL as string;
  const jwtSecret = config.JWT_SECRET as string;
  const jwtExpiresIn = (config.JWT_EXPIRES_IN as string) ?? '15m';
  const resetCodePepper = (config.RESET_CODE_PEPPER as string) ?? 'dev_pepper_default';
  const allowedOrigins = (config.ALLOWED_ORIGINS as string) ?? '*';

  const smtpHost = (config.SMTP_HOST as string) ?? 'localhost';
  const smtpPort = Number(config.SMTP_PORT ?? 1025);
  const smtpUser = config.SMTP_USER ? String(config.SMTP_USER) : undefined;
  const smtpPass = config.SMTP_PASS ? String(config.SMTP_PASS) : undefined;
  const smtpFrom =
    (config.SMTP_FROM as string) ?? 'Bíblia Sagrada Mobile <nao-responda@bibliamobile.app>';

  if (!databaseUrl) {
    throw new Error('A variável de ambiente DATABASE_URL é obrigatória.');
  }

  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error('A variável JWT_SECRET é obrigatória e deve ter pelo menos 32 caracteres.');
  }

  return {
    PORT: port,
    NODE_ENV: nodeEnv,
    DATABASE_URL: databaseUrl,
    JWT_SECRET: jwtSecret,
    JWT_EXPIRES_IN: jwtExpiresIn,
    RESET_CODE_PEPPER: resetCodePepper,
    ALLOWED_ORIGINS: allowedOrigins,
    SMTP_HOST: smtpHost,
    SMTP_PORT: smtpPort,
    SMTP_USER: smtpUser,
    SMTP_PASS: smtpPass,
    SMTP_FROM: smtpFrom,
  };
}
