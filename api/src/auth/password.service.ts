import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordService {
  // Hash dummy pré-computado para anti-timing attacks quando usuário não for encontrado
  private readonly dummyHash =
    '$argon2id$v=19$m=19456,t=2,p=1$QmlibGlhU2FsdEhhc2gxMjM$r9uXwJmP25XfG+vj6qQZf4ZJ9Yj3wJmP25XfG+vj6qQ';

  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456, // 19 MiB (OWASP recomendado)
      timeCost: 2,
      parallelism: 1,
    });
  }

  async verify(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }

  /**
   * Executa uma verificação artificial de senha para evitar timing attacks
   * em tentativas de login com e-mails inexistentes (anti-enumeração).
   */
  async verifyDummy(plain: string): Promise<void> {
    try {
      await argon2.verify(this.dummyHash, plain);
    } catch {
      // Ignora
    }
  }
}
