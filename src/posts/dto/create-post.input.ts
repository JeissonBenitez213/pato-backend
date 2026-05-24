import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { FileInput } from './file-post.input';

@InputType()
export class CreatePostInput {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @Field(() => String)
  title!: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @IsArray()
  @Field(() => [FileInput], { nullable: true })
  files?: FileInput[];
}
