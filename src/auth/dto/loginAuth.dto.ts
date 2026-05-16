import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuth {
  @IsString()
  @IsIn(['google', 'github'])
  provider!: string;

  @IsNotEmpty()
  @IsString()
  code!: string;
}
