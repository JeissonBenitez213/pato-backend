import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class AddReaction {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  id_post!: number;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  comentario?: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  like?: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  favorites?: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  shares?: boolean;
}
