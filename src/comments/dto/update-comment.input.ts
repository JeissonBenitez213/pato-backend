import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class UpdateCommentInput {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  id_comentario!: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  texto!: string;
}
