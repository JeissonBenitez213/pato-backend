import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class SearchMessageDto {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  id_usuario_envia!: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  id_usuario_recibe!: number;
}
