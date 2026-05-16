import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class Follow {
  @Field(() => Int)
  follower_id!: number;

  @Field(() => Int)
  following_id!: number;

  @Field(() => GraphQLISODateTime)
  CreatedAt!: Date;

  @Field(() => User)
  Follower!: User;

  @Field(() => User)
  Following!: User;
}
