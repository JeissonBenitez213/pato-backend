import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Comentario } from './comentario.entity';
import { FilesComment } from './filesComment.entity';

@ObjectType()
export class ContentComentario {
  @Field(() => Int)
  id_content!: number;

  @Field(() => Int)
  id_comentario!: number;

  @Field(() => String, { nullable: true })
  texto!: string | null;

  @Field(() => Int, { nullable: true })
  id_files!: number | null;

  @Field(() => Comentario)
  Comentario!: Comentario;

  @Field(() => FilesComment, { nullable: true })
  File!: FilesComment | null;
}
