import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/posts/entities/post.entity';
import { FilesComment } from './filesComment.entity';
import { ComentarioReactions } from './comentarioReactions.entity';

@ObjectType()
export class Comentario {
  @Field(() => Int)
  id_comentario!: number;

  @Field(() => Int)
  id_post!: number;

  @Field(() => Int)
  id_usuario!: number;

  @Field(() => Int, { nullable: true })
  id_comentario_padre!: number | null;

  @Field(() => GraphQLISODateTime)
  Fecha!: Date;

  @Field(() => String, { nullable: true })
  texto!: string | null;

  @Field(() => Post)
  Post!: Post;

  @Field(() => Comentario, { nullable: true })
  Padre!: Comentario | null;

  @Field(() => [Comentario], { nullable: true })
  Respuestas!: Comentario[];

  @Field(() => [FilesComment], { nullable: true })
  files!: FilesComment[] | null;

  @Field(() => [ComentarioReactions], { nullable: true })
  reactions!: ComentarioReactions | null;
}
