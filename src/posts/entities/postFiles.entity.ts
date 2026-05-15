import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PostContent } from './postContent.entity';

@ObjectType()
export class PostFiles {
  @Field(() => Int)
  id_file!: number;

  @Field(() => Int)
  id_content!: number;

  @Field(() => String)
  dir!: string;

  @Field(() => String)
  file_extension!: string;

  @Field(() => PostContent)
  contenido!: PostContent;
}
