import {
  Resolver,
  Mutation,
  Args,
  Info,
  Context,
  Query,
} from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comentario } from './entities/comentario.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/guards.guard';
import type { GraphQLResolveInfo } from 'graphql';
import { PrismaSelect } from '@paljs/plugins';
import { AddReactions } from './dto/add-reactions.input';
import { ComentarioReactions } from './entities/comentarioReactions.entity';
import { UpdateCommentInput } from './dto/update-comment.input';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query(() => [Comentario])
  async getComment(@Info() info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info);
    return await this.commentsService.getComments(select);
  }

  @Query(() => [Comentario])
  async getCommentsByParent(
    @Args('comment_id') comment_id: number,
    @Info() info: GraphQLResolveInfo,
  ) {
    const select = new PrismaSelect(info).value;
    return await this.commentsService.getCommentByParents(comment_id, select);
  }

  @Mutation(() => Comentario)
  @UseGuards(GqlAuthGuard)
  async deleteComment(
    @Context() ctx: any,
    @Args('comment_id') comment_id: number,
    @Info() info: GraphQLResolveInfo,
  ) {
    const userId = ctx.req.user?.id;
    const select = new PrismaSelect(info).value();
    return await this.commentsService.delete(comment_id, userId, select);
  }

  @Mutation(() => Comentario)
  @UseGuards(GqlAuthGuard)
  async createComment(
    @Args('input') input: CreateCommentInput,
    @Info() info: GraphQLResolveInfo,
    @Context() ctx: any,
  ) {
    const select = new PrismaSelect(info);
    const userId = ctx.req.user?.id;
    return await this.commentsService.create(input, select, userId);
  }

  @Mutation(() => ComentarioReactions)
  @UseGuards(GqlAuthGuard)
  async addReactions(
    @Args('input') input: AddReactions,
    @Info() info: GraphQLResolveInfo,
    @Context() ctx: any,
  ) {
    const user_id = ctx.req.user?.id;
    const select = new PrismaSelect(info).value;
    return await this.commentsService.addReactions(select, user_id, input);
  }

  @Mutation(() => Comentario)
  @UseGuards(GqlAuthGuard)
  async updateMessage(
    @Args('input') input: UpdateCommentInput,
    @Info() info: GraphQLResolveInfo,
    @Context() ctx: any,
  ) {
    const userId = ctx.req.user?.id;
    const select = new PrismaSelect(info).value;
    return await this.commentsService.updateComment(userId, input, select);
  }
}
