import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { Prisma } from 'generated/prisma/client';
import { UpdateBadge } from './dto/update-badge.dto';

@Injectable()
export class BadgesService {
  constructor(private prisma: PrismaService) {}

  async createBadge(input: CreateBadgeDto, select: any) {
    const data: Prisma.InsigniaCreateInput = {
      ...input,
    };

    const newBadge = await this.prisma.insignia.create({
      data,
      ...select,
    });

    return newBadge;
  }

  async updateBadge(input: UpdateBadge, select: any) {
    const data = Object.fromEntries(
      Object.entries(input).filter(
        ([_, value]) => value !== null && value !== undefined,
      ),
    ) as Prisma.InsigniaCreateInput;

    return this.prisma.insignia.update({
      where: {
        id_insignia: 1,
      },
      data,
      ...select,
    });
  }

  async delete(id: number, select: any) {
    const badge = await this.prisma.insignia.delete({
      where: {
        id_insignia: id,
      },
      ...select,
    });

    return badge;
  }

  async getBadges(select: any) {
    return await this.prisma.insignia.findMany({ ...select });
  }
}
