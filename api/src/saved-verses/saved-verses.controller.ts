import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SavedVersesService } from './saved-verses.service';
import { SaveVerseDto } from './dto/save-verse.dto';

@Controller('me/saved-verses')
export class SavedVersesController {
  constructor(private readonly savedVersesService: SavedVersesService) {}

  @Get()
  async getSavedVerses(@CurrentUser('id') userId: string) {
    return this.savedVersesService.getSavedVerses(userId);
  }

  @Put(':id')
  async saveVerse(
    @CurrentUser('id') userId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: SaveVerseDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.savedVersesService.saveVerse(userId, id, dto);
    res.status(result.created ? 201 : 200);
    return result.verse;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteSavedVerse(
    @CurrentUser('id') userId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.savedVersesService.deleteSavedVerse(userId, id);
  }
}
