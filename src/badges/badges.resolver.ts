import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Badge } from './entities/badge.entity';
import { CreateBadgeDto } from './dto/create-badge.dto';
import type { GraphQLResolveInfo } from 'graphql';
import { PrismaSelect } from '@paljs/plugins';
import { BadgesService } from './badges.service';
import { UseGuards } from '@nestjs/common';
import { AdminRole } from 'src/auth/guards/guards.guard';
import { UpdateBadge } from './dto/update-badge.dto';

@Resolver(() => Badge)
export class BadgesResolver {
  constructor(private badgesService: BadgesService) {}

  @Mutation(() => Badge)
  @UseGuards(AdminRole)
  async createBadge(
    @Args('input') input: CreateBadgeDto,
    @Info() info: GraphQLResolveInfo,
  ) {
    const select = new PrismaSelect(info).value;
    return await this.badgesService.createBadge(input, select);
  }

  @Mutation(() => Badge)
  @UseGuards(AdminRole)
  async updateBadge(
    @Args('input') input: UpdateBadge,
    @Info() info: GraphQLResolveInfo,
  ) {
    const select = new PrismaSelect(info).value();
    return await this.badgesService.updateBadge(input, select);
  }

  @Mutation(() => Badge)
  @UseGuards(AdminRole)
  async deleteRole(@Args('id') id: number, @Info() info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value();
    return await this.badgesService.delete(id, select);
  }

  @Query(() => [Badge])
  async getBadges(@Info() info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value;
    return await this.badgesService.getBadges(select);
  }
}
