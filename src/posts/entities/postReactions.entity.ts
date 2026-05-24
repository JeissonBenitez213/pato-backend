import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Post } from './post.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class PostReactions {
  @Field(() => Int)
  id_postReaction!: number;

  @Field(() => Int)
  id_usuario!: number;

  @Field(() => Int)
  id_post!: number;

  @Field(() => Boolean)
  comentario!: boolean;

  @Field(() => Boolean)
  like!: boolean;

  @Field(() => Boolean)
  favorites!: boolean;

  @Field(() => Boolean)
  share!: boolean;

  @Field(() => GraphQLISODateTime)
  time_in!: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  time_out!: Date | null;

  @Field(() => Post)
  post!: Post;

  @Field(() => User)
  usuario!: User;
}
