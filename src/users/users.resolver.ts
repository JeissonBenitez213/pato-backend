import {
  Resolver,
  Query,
  Info,
  Context,
  Args,
  Mutation,
  Subscription,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/guards.guard';
import type { GraphQLResolveInfo } from 'graphql';
import { PrismaSelect } from '@paljs/plugins';
import { FollowResponse } from './entities/follow_response.entity';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async findFriends(@Context() ctx: any, @Info() info: GraphQLResolveInfo) {
    const userId = ctx.req.user?.id_usuario;

    const select = new PrismaSelect(info).value;
    const friends = await this.usersService.findAllFriends(userId, select);
    return friends;
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async findOneUser(
    @Args('id_user') id_user: number,
    @Info() info: GraphQLResolveInfo,
  ) {
    const select = new PrismaSelect(info).value;
    const user = await this.usersService.findOneUser(id_user, select);
    return user;
  }

  @Mutation(() => FollowResponse)
  @UseGuards(GqlAuthGuard)
  async toggleFollow(
    @Context() ctx: any,
    @Args('id_user') id_user: number,
    @Info() info: GraphQLResolveInfo,
  ) {
    const select = new PrismaSelect(info).value;
    const userId = ctx.req.user?.id_usuario;
    const data = await this.usersService.toggleFollow(userId, id_user, select);
    await pubSub.publish('TOGGLE_FOLLOW', {
      data,
    });
  }

  @Subscription(() => FollowResponse)
  async toogledFollow() {
    return pubSub.asyncIterableIterator('TOGGLE_FOLLOW');
  }
}
