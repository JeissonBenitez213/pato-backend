import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { GqlAuthGuard } from 'src/auth/guards/guards.guard';
import { MessagesService } from './messages.service';

import { Message } from './entities/message.entity';
import { SearchMessageDto } from './dto/search_message.dto';
import { CreateMessage } from './dto/create_message.dto';
import { DeleteMessage } from './dto/delete_message.dto';
import { UpdateMessage } from './dto/update_message.dto';

const pubSub = new PubSub();

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  /* ---------------- QUERY ---------------- */
  @Query(() => [Message])
  @UseGuards(GqlAuthGuard)
  async getMessages(@Args('input') input: SearchMessageDto) {
    return this.messagesService.getMessages(
      input.id_usuario_envia,
      input.id_usuario_recibe,
    );
  }

  /* ---------------- MUTATIONS ---------------- */

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async createMessage(@Args('input') input: CreateMessage) {
    const message = await this.messagesService.createMessage(input);

    // 🔥 emitimos para ambos usuarios
    await pubSub.publish(`NEW_MESSAGE_${input.id_usuario_envia}`, {
      newMessage: message,
    });

    await pubSub.publish(`NEW_MESSAGE_${input.id_usuario_recibe}`, {
      newMessage: message,
    });

    return message;
  }

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async removeMessage(@Args('input') input: DeleteMessage) {
    const message = await this.messagesService.deleteMessage(input);

    await pubSub.publish(`DELETE_MESSAGE_${message.id_usuario_envia}`, {
      deleteMessage: message,
    });

    await pubSub.publish(`DELETE_MESSAGE_${message.id_usuario_recibe}`, {
      deleteMessage: message,
    });

    return message;
  }

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async updateMessage(@Args('input') input: UpdateMessage) {
    const message = await this.messagesService.updateMessage(input);

    await pubSub.publish(`UPDATE_MESSAGE_${message.id_usuario_envia}`, {
      updatedMessage: message,
    });

    await pubSub.publish(`UPDATE_MESSAGE_${message.id_usuario_recibe}`, {
      updatedMessage: message,
    });

    return message;
  }

  /* ---------------- SUBSCRIPTIONS ---------------- */

  @Subscription(() => Message, {
    resolve: (payload) => payload.newMessage,
  })
  newMessage(@Args('userId') userId: number) {
    return pubSub.asyncIterableIterator(`NEW_MESSAGE_${userId}`);
  }

  @Subscription(() => Message, {
    resolve: (payload) => payload.deleteMessage,
  })
  deleteMessage(@Args('userId') userId: number) {
    return pubSub.asyncIterableIterator(`DELETE_MESSAGE_${userId}`);
  }

  @Subscription(() => Message, {
    resolve: (payload) => payload.updatedMessage,
  })
  updatedMessage(@Args('userId') userId: number) {
    return pubSub.asyncIterableIterator(`UPDATE_MESSAGE_${userId}`);
  }
}
