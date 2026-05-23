import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post } from './post.entity';

@ObjectType()
export class PostsFeed {
  @Field(() => [Post], { nullable: true })
  data?: Post[] | null;

  @Field(() => Int, { nullable: true })
  nextCursor?: number | null;
}
