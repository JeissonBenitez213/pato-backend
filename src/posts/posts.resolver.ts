import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { SearchPostInput } from './dto/search-post.input';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query((returns) => [Post], { name: 'postsByFilter' })
  findByFilter(
    @Args('filter', { type: () => SearchPostInput })
    filter: SearchPostInput,
  ) {
    return this.postsService.findByFilter(filter);
  }

  @Query((returns) => [Post], { name: 'posts' })
  findAll() {
    return this.postsService.findAll();
  }
}
