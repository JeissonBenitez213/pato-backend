import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Info,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { SearchPostInput } from './dto/search-post.input';
import type { GraphQLResolveInfo } from 'graphql';
import { PrismaSelect } from '@paljs/plugins';
import { PostStats } from './dto/post-stats.input';

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

  @Query((returns) => [Post], { name: 'posts' })
  async posts(@Info() info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value;

    if (select.select?.stats) {
      delete select.select.stats;
    }

    return this.postsService.findAll(select);
  }

  @ResolveField(() => PostStats)
  async stats(@Parent() post: Post) {
    return this.postsService.getStats(post.id_post);
  }
}
