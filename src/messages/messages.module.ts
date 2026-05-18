import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [MessagesService, MessagesResolver, PrismaService],
})
export class MessagesModule {}
