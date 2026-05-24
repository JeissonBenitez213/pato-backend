import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class AddReactions {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  id_comment!: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  commented?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  like?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  share?: boolean;
}
