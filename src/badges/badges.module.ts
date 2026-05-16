import { Module } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { BadgesGateway } from './badges.gateway';
import { BadgesResolver } from './badges.resolver';

@Module({
  providers: [BadgesGateway, BadgesService, BadgesResolver],
})
export class BadgesModule {}
