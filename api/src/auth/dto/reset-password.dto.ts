import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email!: string;

  @IsString({ message: 'O código deve ser uma sequência de caracteres.' })
  @Length(6, 6, { message: 'O código deve ter exatamente 6 dígitos.' })
  @Matches(/^\d{6}$/, { message: 'O código deve conter apenas números.' })
  code!: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @Length(8, 72, { message: 'A senha deve ter entre 8 e 72 caracteres.' })
  @Matches(/[A-Z]/, { message: 'A senha deve conter pelo menos uma letra maiúscula.' })
  @Matches(/[0-9]/, { message: 'A senha deve conter pelo menos um número.' })
  @Matches(/[^a-zA-Z0-9]/, {
    message: 'A senha deve conter pelo menos um caractere especial (!, @, #, etc.).',
  })
  newPassword!: string;
}
