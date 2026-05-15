import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post } from './post.entity';
import { PostFiles } from './postFiles.entity';

@ObjectType()
export class PostContent {
  @Field(() => Int)
  id_content!: number;

  @Field(() => Int)
  id_post!: number;

  @Field(() => Post)
  post!: Post;

  @Field(() => [PostFiles])
  file!: PostFiles[] | null;
}
