import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post } from './post.entity';

@ObjectType()
export class PostFiles {
  @Field(() => Int)
  id_file!: number;

  @Field(() => Int)
  id_post!: number;

  @Field(() => String)
  dir!: string;

  @Field(() => String)
  file_extension!: string;

  @Field(() => Post)
  post!: Post;
}
