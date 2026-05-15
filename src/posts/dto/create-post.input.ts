import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { AddContent } from './add-content.input';

@InputType()
export class CreatePostInput {
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  id_usuario!: number;

  @Field(() => [AddContent], { nullable: true })
  contenido?: AddContent[];
}
