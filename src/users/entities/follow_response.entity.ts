import { Field, ObjectType } from '@nestjs/graphql';

import { User } from './user.entity';

@ObjectType()
export class FollowResponse {
  @Field(() => User)
  user!: User;

  @Field(() => Boolean)
  following!: boolean;
}
