import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/posts/entities/post.entity';
import { FilesComment } from './filesComment.entity';
import { ComentarioReactions } from './comentarioReactions.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Comentario {
  @Field(() => Int)
  id_comentario!: number;

  @Field(() => Int)
  id_post!: number;

  @Field(() => Int)
  id_usuario!: number;

  @Field(() => Int, { nullable: true })
  id_comentario_padre?: number | null;

  @Field(() => GraphQLISODateTime)
  fecha!: Date;

  @Field(() => String, { nullable: true })
  texto?: string | null;

  @Field(() => Post)
  post!: Post;

  @Field(() => User)
  usuario!: User;

  @Field(() => Comentario, { nullable: true })
  padre?: Comentario | null;

  @Field(() => [Comentario], { nullable: true })
  respuestas?: Comentario[] | null;

  // relaciones opcionales
  @Field(() => [FilesComment], { nullable: true })
  files?: FilesComment[] | null;

  @Field(() => [ComentarioReactions], { nullable: true })
  reactions?: ComentarioReactions[] | null;
}
