import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import * as fs from 'fs';
import { Public } from '../common/decorators/public.decorator';
import { StorageService } from '../storage/storage.service';

@Controller('files/avatars')
export class FilesController {
  constructor(private readonly storageService: StorageService) {}

  @Public()
  @Get(':file')
  serveAvatar(@Param('file') file: string, @Res() res: Response) {
    // Sanitização básica do nome do arquivo contra path traversal
    if (!/^[0-9a-fA-F-]+\.webp$/.test(file)) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    const filePath = this.storageService.getAvatarPath(file);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Avatar não encontrado');
    }

    res.set({
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  }
}
