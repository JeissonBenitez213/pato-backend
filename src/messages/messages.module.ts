import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MessagesResolver } from './messages.resolver';

@Module({
  providers: [MessagesGateway, MessagesService, MessagesResolver],
})
export class MessagesModule {}
