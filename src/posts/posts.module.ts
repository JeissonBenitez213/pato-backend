import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PostsResolver, PostsService],
  imports: [PrismaService],
})
export class PostsModule {}
