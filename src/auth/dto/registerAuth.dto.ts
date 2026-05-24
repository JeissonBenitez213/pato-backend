import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterAuth {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  username!: string;

  @IsNotEmpty()
  @IsString()
  provider!: string;

  @IsNotEmpty()
  @IsString()
  provider_id!: string;
}
