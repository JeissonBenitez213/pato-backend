import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class Login {
  @IsNotEmpty({ message: 'El usuario no puede estar vacío' })
  @IsString()
  @MinLength(5, { message: '' })
  @MaxLength(500)
  nombre_usuario!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  contraseña!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  contraseña_repetida!: string;
}
