import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class DeletePost {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  id_post!: number;
}
