import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadDir = path.resolve(process.cwd(), 'uploads', 'avatars');

  constructor() {
    void this.ensureDir();
  }

  private async ensureDir(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (err) {
      this.logger.error('Falha ao criar diretório de uploads:', err);
    }
  }

  async saveAvatar(buffer: Buffer): Promise<string> {
    await this.ensureDir();
    const filename = `${crypto.randomUUID()}.webp`;
    const filepath = path.join(this.uploadDir, filename);
    await fs.writeFile(filepath, buffer);
    return filename;
  }

  async deleteAvatar(filename: string): Promise<void> {
    if (!filename) return;
    try {
      const filepath = path.join(this.uploadDir, filename);
      await fs.unlink(filepath);
    } catch (err: unknown) {
      // Ignora erro se o arquivo já não existir
      this.logger.warn(`Não foi possível deletar avatar ${filename}: ${(err as Error).message}`);
    }
  }

  getAvatarPath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }
}
