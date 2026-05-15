import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Comentario } from './comentario.entity';

@ObjectType()
export class FilesComment {
  @Field(() => Int)
  id_file!: number;

  @Field(() => Int)
  id_comment!: number;

  @Field(() => String)
  Dir!: string;

  @Field(() => String)
  File_extension!: string;

  @Field(() => [Comentario], { nullable: true })
  Contenido!: Comentario[];
}
