import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveVerseDto } from './dto/save-verse.dto';

@Injectable()
export class SavedVersesService {
  constructor(private readonly prisma: PrismaService) {}

  async getSavedVerses(userId: string) {
    const items = await this.prisma.savedVerse.findMany({
      where: { userId },
      orderBy: { savedAt: 'desc' },
    });

    return {
      items: items.map((item) => ({
        id: item.id,
        reference: item.reference,
        text: item.text,
        translation: item.translation,
        savedAt: item.savedAt.toISOString(),
      })),
    };
  }

  async saveVerse(userId: string, id: string, dto: SaveVerseDto) {
    // 1. Checa se o usuário já tem esse versículo com essa tradução (idempotência por conteúdo)
    const existingSameContent = await this.prisma.savedVerse.findUnique({
      where: {
        user_reference_translation_unique: {
          userId,
          reference: dto.reference,
          translation: dto.translation,
        },
      },
    });

    if (existingSameContent) {
      return {
        created: false,
        verse: {
          id: existingSameContent.id,
          reference: existingSameContent.reference,
          text: existingSameContent.text,
          translation: existingSameContent.translation,
          savedAt: existingSameContent.savedAt.toISOString(),
        },
      };
    }

    // 2. Checa se o ID informado já existe no banco
    const existingWithId = await this.prisma.savedVerse.findUnique({
      where: { id },
    });

    if (existingWithId) {
      if (existingWithId.userId !== userId) {
        // IDOR mitigation: não revela que pertence a outro usuário
        throw new NotFoundException('Versículo não encontrado');
      }

      const updated = await this.prisma.savedVerse.update({
        where: { id },
        data: {
          text: dto.text,
          savedAt: new Date(dto.savedAt),
        },
      });

      return {
        created: false,
        verse: {
          id: updated.id,
          reference: updated.reference,
          text: updated.text,
          translation: updated.translation,
          savedAt: updated.savedAt.toISOString(),
        },
      };
    }

    // 3. Cria novo versículo vinculado à conta
    const created = await this.prisma.savedVerse.create({
      data: {
        id,
        userId,
        reference: dto.reference,
        text: dto.text,
        translation: dto.translation,
        savedAt: new Date(dto.savedAt),
      },
    });

    return {
      created: true,
      verse: {
        id: created.id,
        reference: created.reference,
        text: created.text,
        translation: created.translation,
        savedAt: created.savedAt.toISOString(),
      },
    };
  }

  async deleteSavedVerse(userId: string, id: string): Promise<void> {
    const existing = await this.prisma.savedVerse.findFirst({
      where: { id, userId },
    });

    if (existing) {
      await this.prisma.savedVerse.delete({
        where: { id },
      });
    }
  }
}
