import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { PostReactions } from './postReactions.entity';
import { Comentario } from './comentario.entity';
import { PostContent } from './postContent.entity';

@ObjectType()
export class Post {
  @Field(() => Int)
  id_post!: number;

  @Field(() => Int)
  id_usuario!: number;

  @Field(() => GraphQLISODateTime)
  fecha_publicacion!: Date;

  @Field(() => [Comentario], { nullable: true })
  Comentarios!: Comentario[] | null;

  @Field(() => [PostContent], { nullable: true })
  Contenido!: PostContent | null;

  @Field(() => [PostReactions], { nullable: true })
  Reactions!: PostReactions[] | null;
}
