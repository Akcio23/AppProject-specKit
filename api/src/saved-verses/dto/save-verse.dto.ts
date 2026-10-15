import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SaveVerseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  reference!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  text!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  translation!: string;

  @IsDateString()
  savedAt!: string;
}
