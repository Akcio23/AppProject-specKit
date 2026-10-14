import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ message: 'O token de atualização deve ser um texto.' })
  @IsNotEmpty({ message: 'O token de atualização é obrigatório.' })
  refreshToken!: string;
}
