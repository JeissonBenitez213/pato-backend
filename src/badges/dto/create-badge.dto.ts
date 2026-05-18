import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateBadgeDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  nombre!: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  descripcion?: string;

  @IsOptional()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  icono?: string;
}
