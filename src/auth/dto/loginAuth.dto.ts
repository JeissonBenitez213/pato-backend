import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuth {
  @IsNotEmpty()
  @IsString()
  @IsIn(['google', 'github'])
  provider!: string;

  @IsNotEmpty()
  @IsString()
  provider_id!: string;
}
