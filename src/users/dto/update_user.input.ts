import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUser {
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  nombre_usuario?: string;

  @IsEmail()
  @IsOptional()
  @Field(() => String, { nullable: true })
  email?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  descripcion?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  avatar?: string;
}
