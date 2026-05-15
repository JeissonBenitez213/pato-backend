import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { PostReactions } from './postReactions.entity';
import { Comentario } from 'src/comments/entities/comentario.entity';
import { PostFiles } from './postFiles.entity';
import { PostStats } from '../dto/post-stats.input';

@ObjectType()
export class Post {
  @Field(() => Int)
  id_post!: number;

  @Field(() => Int)
  id_usuario!: number;

  @Field(() => String)
  Title!: string;

  @Field(() => String, { nullable: true })
  Description!: string | null;

  @Field(() => GraphQLISODateTime)
  fecha_publicacion!: Date;

  @Field(() => [Comentario], { nullable: true })
  Comentarios!: Comentario[] | null;

  @Field(() => [PostFiles], { nullable: true })
  Files!: PostFiles[] | null;

  @Field(() => [PostReactions], { nullable: true })
  Reactions!: PostReactions[] | null;

  @Field(() => PostStats)
  stats!: PostStats;
}
