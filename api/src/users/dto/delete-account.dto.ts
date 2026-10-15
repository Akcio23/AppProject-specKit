import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAccountDto {
  @IsString({ message: 'A senha é obrigatória.' })
  @IsNotEmpty({ message: 'Informe sua senha para confirmar a exclusão da conta.' })
  password!: string;
}
