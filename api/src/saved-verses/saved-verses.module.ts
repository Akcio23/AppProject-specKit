import { Module } from '@nestjs/common';
import { SavedVersesController } from './saved-verses.controller';
import { SavedVersesService } from './saved-verses.service';

@Module({
  controllers: [SavedVersesController],
  providers: [SavedVersesService],
  exports: [SavedVersesService],
})
export class SavedVersesModule {}
