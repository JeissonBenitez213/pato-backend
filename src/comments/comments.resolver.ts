import {
  Resolver,
  Mutation,
  Args,
  Info,
  Context,
  Query,
  Subscription,
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
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query(() => [Comentario])
  async getComments(@Args('postId') postId: number) {
    return this.commentsService.getComments(postId);
  }

  @Query(() => [Comentario])
  async getCommentReplies(@Args('commentId') commentId: number) {
    return this.commentsService.getCommentReplies(commentId);
  }

  @Mutation(() => Comentario)
  @UseGuards(GqlAuthGuard)
  async deleteComment(
    @Context() ctx: any,
    @Args('comment_id') comment_id: number,
    @Info() info: GraphQLResolveInfo,
  ) {
    const userId = ctx.req.user?.id;
    const select = new PrismaSelect(info).value;
    const comment = await this.commentsService.delete(
      comment_id,
      userId,
      select,
    );
    pubSub.publish('DELETE_COMMENT', {
      deletedComment: comment,
    });
    return comment;
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
    const comment = await this.commentsService.create(input, select, userId);
    pubSub.publish('NEW_COMMENT', {
      newComment: comment,
    });
    return comment;
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
    const reactions = await this.commentsService.addReactions(
      select,
      user_id,
      input,
    );

    pubSub.publish('ADD_REACTION_COMMENT', { reactions });

    return reactions;
  }

  @Mutation(() => Comentario)
  @UseGuards(GqlAuthGuard)
  async updateComment(
    @Args('input') input: UpdateCommentInput,
    @Info() info: GraphQLResolveInfo,
    @Context() ctx: any,
  ) {
    const userId = ctx.req.user?.id;
    const select = new PrismaSelect(info).value;
    const comment = await this.commentsService.updateComment(
      userId,
      input,
      select,
    );
    pubSub.publish('UPDATE_COMMENT', {
      updatedComment: comment,
    });
    return comment;
  }

  @Subscription(() => Comentario, {
    resolve: (payload) => payload.newComment,
  })
  async newComment() {
    return pubSub.asyncIterableIterator('NEW_COMMENT');
  }

  @Subscription(() => Comentario, {
    resolve: (payload) => payload.updatedComment,
  })
  async updatedComment() {
    return pubSub.asyncIterableIterator('UPDATE_COMMENT');
  }

  @Subscription(() => Comentario, {
    resolve: (payload) => payload.deletedComment,
  })
  async deletedComment() {
    return pubSub.asyncIterableIterator('DELETE_COMMENT');
  }

  @Subscription(() => ComentarioReactions, {
    resolve: (payload) => payload.reactions,
  })
  async addReaction() {
    return pubSub.asyncIterableIterator('ADD_REACTION_COMMENT');
  }
}
