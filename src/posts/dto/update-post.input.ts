import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreatePostInput } from './create-post.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  id_post!: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  title!: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  description!: string;
}
