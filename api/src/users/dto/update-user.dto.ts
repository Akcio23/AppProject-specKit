import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode estar em branco.' })
  @Length(2, 80, { message: 'O nome deve ter entre 2 e 80 caracteres.' })
  name!: string;
}
