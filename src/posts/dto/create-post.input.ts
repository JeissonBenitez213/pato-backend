import { InputType, Int, Field } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { AddFile } from './add-file.input';

@InputType()
export class CreatePostInput {
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  id_usuario!: number;

  @IsArray()
  @ArrayNotEmpty()
  @Field(() => [AddFile], { nullable: true })
  contenido!: AddFile[];
}
