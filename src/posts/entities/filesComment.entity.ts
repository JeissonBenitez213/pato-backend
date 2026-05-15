import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ContentComentario } from './comentarioContent.entity';

@ObjectType()
export class FilesComment {
  @Field(() => Int)
  id_file!: number;

  @Field(() => Int)
  id_content!: number;

  @Field(() => String)
  Dir!: string;

  @Field(() => String)
  File_extension!: string;

  @Field(() => [ContentComentario], { nullable: true })
  Contenido!: ContentComentario[];
}
