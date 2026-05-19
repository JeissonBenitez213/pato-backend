import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  Info,
} from '@nestjs/graphql';
import { PetService } from './pet.service';
import { Pet } from './entities/pet.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/guards.guard';
import type { GraphQLResolveInfo } from 'graphql';
import { PrismaSelect } from '@paljs/plugins';
import { UpdatePetInput } from './dto/update-pet.input';

@Resolver(() => Pet)
export class PetResolver {
  constructor(private readonly petService: PetService) {}

  @Mutation(() => Pet)
  @UseGuards(GqlAuthGuard)
  async createPet(@Context() ctx: any, @Info() info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info);
    const userId = ctx.req.user?.id;
    return await this.petService.create(userId, select);
  }

  @Query(() => Pet)
  @UseGuards(GqlAuthGuard)
  async getPet(@Context() ctx: any, @Info() info: GraphQLResolveInfo) {
    const userId = ctx.req.user?.id;
    const select = new PrismaSelect(info).value;
    return await this.petService.getPet(userId, select);
  }
}
