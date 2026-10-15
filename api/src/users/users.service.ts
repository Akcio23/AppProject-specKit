import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import sharp from 'sharp';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  private formatUser(user: {
    id: string;
    name: string;
    email: string;
    photoKey: string | null;
    createdAt: Date;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoKey ? `/files/avatars/${user.photoKey}` : null,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        photoKey: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.formatUser(user);
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name: dto.name.trim() },
      select: {
        id: true,
        name: true,
        email: true,
        photoKey: true,
        createdAt: true,
      },
    });

    return this.formatUser(user);
  }

  async uploadPhoto(userId: string, buffer: Buffer) {
    let processed: Buffer;
    try {
      // Reprocessa para WebP 512x512 e remove EXIF automaticamente
      processed = await sharp(buffer)
        .resize(512, 512, { fit: 'cover', position: 'center' })
        .webp({ quality: 80 })
        .toBuffer();
    } catch {
      throw new BadRequestException('O arquivo enviado não é uma imagem válida.');
    }

    const current = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { photoKey: true },
    });

    const newPhotoKey = await this.storageService.saveAvatar(processed);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { photoKey: newPhotoKey },
      select: {
        id: true,
        name: true,
        email: true,
        photoKey: true,
        createdAt: true,
      },
    });

    // Se havia uma foto anterior, deleta do disco
    if (current?.photoKey) {
      void this.storageService.deleteAvatar(current.photoKey);
    }

    return this.formatUser(updatedUser);
  }

  async deletePhoto(userId: string) {
    const current = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { photoKey: true },
    });

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { photoKey: null },
      select: {
        id: true,
        name: true,
        email: true,
        photoKey: true,
        createdAt: true,
      },
    });

    if (current?.photoKey) {
      void this.storageService.deleteAvatar(current.photoKey);
    }

    return this.formatUser(updatedUser);
  }
}
