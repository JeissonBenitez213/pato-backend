import { Module } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { BadgesResolver } from './badges.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [BadgesService, BadgesResolver, PrismaService],
})
export class BadgesModule {
  constructor(private badgesService: BadgesService) {}
}
