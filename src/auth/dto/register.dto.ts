import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class Register {
  @IsNotEmpty({ message: 'El usuario no puede estar vacío' })
  @IsString()
  @MinLength(5, { message: 'Usuario o contraseña incorrecto' })
  @MaxLength(500, { message: 'Usuario o contraseña incorrecto' })
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
