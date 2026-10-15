import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { StorageModule } from '../storage/storage.module';
import { PasswordService } from '../auth/password.service';

@Module({
  imports: [StorageModule],
  controllers: [UsersController],
  providers: [UsersService, PasswordService],
  exports: [UsersService],
})
export class UsersModule {}
