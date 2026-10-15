import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch()
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Put('photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máx
      },
      fileFilter: (_req, file, cb) => {
        if (!file || !file.mimetype || !file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Apenas arquivos de imagem são permitidos.'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadPhoto(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('Nenhum arquivo de imagem foi enviado.');
    }
    return this.usersService.uploadPhoto(userId, file.buffer);
  }

  @Delete('photo')
  async deletePhoto(@CurrentUser('id') userId: string) {
    return this.usersService.deletePhoto(userId);
  }
}
