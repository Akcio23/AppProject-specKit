import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class PreferencesService {
  constructor(private readonly prisma: PrismaService) {}

  async getPreferences(userId: string) {
    const pref = await this.prisma.userPreference.upsert({
      where: { userId },
      create: {
        userId,
        theme: 'dark',
        translationId: 'almeida',
      },
      update: {},
    });

    return {
      theme: pref.theme,
      translationId: pref.translationId,
      updatedAt: pref.updatedAt.toISOString(),
    };
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    const updated = await this.prisma.userPreference.upsert({
      where: { userId },
      create: {
        userId,
        theme: dto.theme ?? 'dark',
        translationId: dto.translationId ?? 'almeida',
      },
      update: {
        ...(dto.theme && { theme: dto.theme }),
        ...(dto.translationId && { translationId: dto.translationId }),
      },
    });

    return {
      theme: updated.theme,
      translationId: updated.translationId,
      updatedAt: updated.updatedAt.toISOString(),
    };
  }
}
