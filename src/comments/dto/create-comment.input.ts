import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AddFiles } from './add-files.imput';

@InputType()
export class CreateCommentInput {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  id_post!: number;

  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  id_comentario_padre?: number;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  texto!: string;

  @IsArray()
  @IsOptional()
  @Field(() => [AddFiles], { nullable: true })
  files?: AddFiles[];
}
