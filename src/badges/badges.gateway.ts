import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';

@WebSocketGateway()
export class BadgesGateway {
  constructor(private readonly badgesService: BadgesService) {}

  @SubscribeMessage('createBadge')
  create(@MessageBody() createBadgeDto: CreateBadgeDto) {
    return this.badgesService.create(createBadgeDto);
  }

  @SubscribeMessage('findAllBadges')
  findAll() {
    return this.badgesService.findAll();
  }

  @SubscribeMessage('findOneBadge')
  findOne(@MessageBody() id: number) {
    return this.badgesService.findOne(id);
  }

  @SubscribeMessage('updateBadge')
  update(@MessageBody() updateBadgeDto: UpdateBadgeDto) {
    return this.badgesService.update(updateBadgeDto.id, updateBadgeDto);
  }

  @SubscribeMessage('removeBadge')
  remove(@MessageBody() id: number) {
    return this.badgesService.remove(id);
  }
}
