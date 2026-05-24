import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class DeleteMessage {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  id_mensaje!: number;
}
