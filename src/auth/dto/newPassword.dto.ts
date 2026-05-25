import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewPassword {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  contraseña!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  new_password!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  refresh_password!: string;
}
