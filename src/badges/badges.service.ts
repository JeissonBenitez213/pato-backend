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

    // SQL equivalent:
    // INSERT INTO Insignia (nombre, descripcion, icono) VALUES (?, ?, ?);
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

    // SQL equivalent:
    // UPDATE Insignia SET ... WHERE id_insignia = 1;
    return this.prisma.insignia.update({
      where: {
        id_insignia: 1,
      },
      data,
      ...select,
    });
  }

  async delete(id: number, select: any) {
    // SQL equivalent:
    // DELETE FROM Insignia WHERE id_insignia = ?;
    const badge = await this.prisma.insignia.delete({
      where: {
        id_insignia: id,
      },
      ...select,
    });

    return badge;
  }

  async getBadges(select: any) {
    // SQL equivalent:
    // SELECT * FROM Insignia;
    return await this.prisma.insignia.findMany({ ...select });
  }
}
