import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { PostReactions } from './postReactions.entity';
import { Comentario } from 'src/comments/entities/comentario.entity';
import { PostFiles } from './postFiles.entity';
import { PostStats } from '../dto/post-stats.input';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Post {
  @Field(() => Int)
  id_post!: number;

  @Field(() => Int)
  id_usuario!: number;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => GraphQLISODateTime)
  fecha_publicacion!: Date;

  @Field(() => User)
  usuario!: User;

  @Field(() => [Comentario], { nullable: true })
  comentarios!: Comentario[] | null;

  @Field(() => [PostFiles], { nullable: true })
  files!: PostFiles[] | null;

  @Field(() => [PostReactions], { nullable: true })
  reactions!: PostReactions[] | null;

  @Field(() => PostStats)
  stats!: PostStats;

  @Field(() => Number, { nullable: true })
  score?: number;
}
