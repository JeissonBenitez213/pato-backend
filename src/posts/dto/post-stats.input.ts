import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostStats {
  @Field(() => Int)
  comentarios!: number;

  @Field(() => Int)
  likes!: number;

  @Field(() => Int)
  favorites!: number;

  @Field(() => Int)
  shares!: number;
}
