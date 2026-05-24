import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Comentario } from './comentario.entity';

@ObjectType()
export class FilesComment {
  @Field(() => Int)
  id_file!: number;

  @Field(() => Int)
  id_comment!: number;

  @Field(() => String)
  dir!: string;

  @Field(() => String)
  file_extension!: string;

  @Field(() => [Comentario], { nullable: true })
  contenido!: Comentario[];
}
