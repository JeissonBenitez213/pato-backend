import { InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class DeletePost {
  @IsNotEmpty()
  @IsNumber()
  id_post!: number;
}
