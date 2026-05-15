import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { PostReactions } from './postReactions.entity';
import { Comentario } from './comentario.entity';

@ObjectType()
export class Post {
  @Field(() => Int)
  id_post!: number;

  @Field(() => Int)
  id_user!: number;

  @Field(() => GraphQLISODateTime)
  fecha_publicacion!: Date;

  @Field(() => [PostReactions], { nullable: true })
  Reactions!: PostReactions[] | null;

  @Field(() => [Comentario], { nullable: true })
  Comentarios!: Comentario[] | null;
}
