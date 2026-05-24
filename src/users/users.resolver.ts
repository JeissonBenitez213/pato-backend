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
import { UpdateUser } from './dto/update_user.input';

const pubSub = new PubSub();

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async findFriends(@Context() ctx: any, @Info() info: GraphQLResolveInfo) {
    const userId = ctx.req.user?.id;

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

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async getMyData(@Context() ctx: any, @Info() info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value;
    const id = ctx.req.user?.id;
    const user = await this.usersService.findOneUser(id, select);

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

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Context() ctx: any,
    @Args('input') input: UpdateUser,
    @Info() info: GraphQLResolveInfo,
  ) {
    const userId = ctx.req.user?.id;
    const select = new PrismaSelect(info).value;
    const newUser = await this.usersService.updateUser(userId, input, select);
    pubSub.publish('USER_UPDATE', { newUser });
    return newUser;
  }

  @Subscription(() => FollowResponse)
  toogledFollow() {
    return pubSub.asyncIterableIterator('TOGGLE_FOLLOW');
  }

  @Subscription(() => User, {
    resolve: (payload) => payload.newUser,
  })
  updatedUser() {
    return pubSub.asyncIterableIterator('USER_UPDATE');
  }
}
