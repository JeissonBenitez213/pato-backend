import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@ObjectType()
export class UpdateBadge {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  id_insignia!: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  nombre?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  icono?: string;
}
