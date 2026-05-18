import {
  Args,
  Context,
  Mutation,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Message } from './entities/message.entity';
import { Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/guards.guard';
import { MessagesService } from './messages.service';
import { SearchMessageDto } from './dto/search_message.dto';
import { PubSub } from 'graphql-subscriptions';
import { CreateMessage } from './dto/create_message.dto';
import { DeleteMessage } from './dto/delete_message.dto';
import { UpdateMessage } from './dto/update_message.dto';

const pubSub = new PubSub();

@Resolver()
export class MessagesResolver {
  constructor(private messagesService: MessagesService) {}

  @Query(() => Message)
  @UseGuards(GqlAuthGuard)
  async getMessages(@Args('input') input: SearchMessageDto) {
    return await this.messagesService.getMessages(
      input.id_usuario_envia,
      input.id_usuario_recibe,
    );
  }

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async createMessage(@Args('input') input: CreateMessage) {
    const message = await this.messagesService.createMessage(input);

    await pubSub.publish('NEW_MESSAGE', {
      newMessage: message,
    });

    return message;
  }

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async removeMessage(@Args('input') input: DeleteMessage) {
    const message = await this.messagesService.deleteMessage(input);

    await pubSub.publish('DELETE_MESSAGE', {
      deleted_message: Message,
    });

    return message;
  }

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async updateMessage(@Args('input') input: UpdateMessage) {
    const message = await this.messagesService.updateMessage(input);

    await pubSub.publish('UPDATE_MESSAGE', {
      updated_message: Message,
    });

    return message;
  }

  @Subscription(() => Message)
  newMessage() {
    return pubSub.asyncIterableIterator('NEW_MESSAGE');
  }

  @Subscription(() => Message)
  deleteMessage() {
    return pubSub.asyncIterableIterator('DELETE_MESSAGE');
  }

  @Subscription(() => Message)
  updatedMessage() {
    return pubSub.asyncIterableIterator('UPDATE_MESSAGE');
  }
}
