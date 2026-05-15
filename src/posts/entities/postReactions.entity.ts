import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Post } from './post.entity';

@ObjectType()
export class PostReactions {
  @Field(() => Int)
  id_postReaction!: number;

  @Field(() => Int)
  id_usuario!: number;

  @Field(() => Int)
  id_post!: number;

  @Field(() => Boolean)
  Comentario!: boolean;

  @Field(() => Boolean)
  Like!: boolean;

  @Field(() => Boolean)
  Favorites!: boolean;

  @Field(() => Boolean)
  Share!: boolean;

  @Field(() => GraphQLISODateTime)
  Time_in!: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  Time_out!: Date | null;

  @Field(() => Post)
  Post!: Post;
}
