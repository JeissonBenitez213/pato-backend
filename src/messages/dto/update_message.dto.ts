import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class UpdateMessage {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  id_mensaje!: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  texto!: string;
}
