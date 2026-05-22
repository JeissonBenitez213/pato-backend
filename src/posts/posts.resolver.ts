import {
  Resolver,
  Query,
  Mutation,
  Args,
  Info,
  ResolveField,
  Parent,
  Context,
  Subscription,
} from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { SearchPostInput } from './dto/search-post.input';
import type { GraphQLResolveInfo } from 'graphql';
import { PrismaSelect } from '@paljs/plugins';
import { PostStats } from './dto/post-stats.input';
import {
  GqlAuthGuard,
  OptionalJwtAuthGuard,
} from 'src/auth/guards/guards.guard';
import { UseGuards } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { DeletePost } from './dto/delete-post.input';
import { PostReactions } from './entities/postReactions.entity';
import { AddReaction } from './dto/add-reaction.input';
import { PubSub } from 'graphql-subscriptions';
import { UpdatePostInput } from './dto/update-post.input';

const pubSub = new PubSub();

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => [Post])
  async searchPosts(
    @Args('filter') filter: SearchPostInput,
    @Info() info: GraphQLResolveInfo,
  ) {
    const select = new PrismaSelect(info).value;

    if (select.select?.stats) {
      delete select.select.stats;
    }

    return this.postsService.findByFilter(filter, select);
  }

  @Query(() => [Post], { name: 'posts' })
  @UseGuards(OptionalJwtAuthGuard)
  async posts(@Info() info: GraphQLResolveInfo, @Context() ctx: any) {
    const select = new PrismaSelect(info).value;

    if (select.select?.stats) {
      delete select.select.stats;
    }

    const userId = ctx.req.user?.id;

    return this.postsService.feed(select, userId);
  }

  @ResolveField(() => PostStats)
  async stats(@Parent() post: Post) {
    return this.postsService.getStats(post.id_post);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async createPost(@Context() ctx: any, @Args('input') input: CreatePostInput) {
    const userId = ctx.req.user?.id;

    return this.postsService.create(input, userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async deletePost(@Context() ctx: any, @Args('post') input: DeletePost) {
    const userId = ctx.req.user.id;
    const deletedPost = await this.postsService.delete(input, userId);
    return deletedPost;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PostReactions)
  async addReaction(
    @Context() ctx: any,
    @Args('input') input: AddReaction,
    @Info() info: GraphQLResolveInfo,
  ) {
    const select = new PrismaSelect(info).value;
    const userId = ctx.req.user?.id;
    const follow = await this.postsService.addReaction(input, select, userId);

    pubSub.publish('USER_REACTION', { follow });
    return follow;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async updatePost(
    @Context() ctx: any,
    @Args('input') input: UpdatePostInput,
    @Info() info: GraphQLResolveInfo,
  ) {
    const id_user = ctx.req.user?.id;
    const select = new PrismaSelect(info).value;
    const updatePost = await this.postsService.updateReaction(
      input,
      id_user,
      select,
    );
    return updatePost;
  }

  @Subscription(() => PostReactions)
  async addedReaction() {
    return pubSub.asyncIterableIterator('USER_REACTION');
  }
}
