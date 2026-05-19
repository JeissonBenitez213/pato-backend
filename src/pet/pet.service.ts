import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePetInput } from './dto/update-pet.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PetService {
  constructor(private prisma: PrismaService) {}

  async getPet(id_user: number, select: any) {
    return await this.prisma.mascota.findFirst({
      where: {
        id_usuario: id_user,
      },
      ...select,
    });
  }

  async create(id_user: number, select: any) {
    return await this.prisma.mascota.create({
      data: {
        id_usuario: id_user,
      },
      ...select,
    });
  }

  async updatePet(id_user: number, select: any, input: UpdatePetInput) {
    const pet = await this.prisma.mascota.findUnique({
      where: {
        id_usuario: id_user,
      },
    });

    if (!pet) {
      throw new NotFoundException('mascota no encontrada');
    }

    const xpRequired = (level: number) => {
      return Math.floor(100 * Math.pow(level, 1.5));
    };

    let currentLevel = pet.nivel_actual;

    let totalXp = pet.puntos_experiencia + input.puntos_experiencia;

    let leveledUp = false;

    while (totalXp >= xpRequired(currentLevel)) {
      totalXp -= xpRequired(currentLevel);

      currentLevel++;

      leveledUp = true;
    }

    const updatedPet = await this.prisma.mascota.update({
      where: {
        id_usuario: id_user,
      },

      data: {
        nivel_actual: currentLevel,

        puntos_experiencia: totalXp,

        ...(leveledUp && {
          fecha_ultima_evolucion: new Date(),
        }),
      },

      ...select,
    });

    return updatedPet;
  }
}
