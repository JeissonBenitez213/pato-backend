import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateMessage {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  id_usuario_envia!: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  id_usuario_recibe!: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  texto!: string;
}
