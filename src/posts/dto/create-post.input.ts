import { InputType, Int, Field } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { AddContent } from './add-content.input';

@InputType()
export class CreatePostInput {
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  id_usuario!: number;

  @IsArray()
  @ArrayNotEmpty()
  @Field(() => [AddContent], { nullable: true })
  contenido!: AddContent[];
}
