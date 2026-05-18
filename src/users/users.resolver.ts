import { Resolver, Query, Info, Context, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/guards.guard';
import type { GraphQLResolveInfo } from 'graphql';
import { PrismaSelect } from '@paljs/plugins';

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
    @Context() ctx: any,
  ) {
    const select = new PrismaSelect(info).value;
    const userId = ctx.req.user?.id_usuario;
    const user = await this.usersService.findOneUser(userId, select);
    return user;
  }
}
