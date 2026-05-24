import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class UpdatePetInput {
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  puntos_experiencia!: number;
}
