import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { PrismaService } from 'src/prisma/prisma.service';
import { PetService } from './pet.service';

@Injectable()
export class PetListener {
  constructor(
    private readonly prisma: PrismaService,
    private readonly petService: PetService,
  ) {}

  @OnEvent('post.created')
  async handlePostCreated(payload: { userId: number; postId: number }) {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayPosts = await this.prisma.post.count({
      where: {
        id_usuario: payload.userId,

        fecha_publicacion: {
          gte: today,
        },
      },
    });

    if (todayPosts > 10) {
      return;
    }

    let xp = 35;

    await this.petService.updatePet(
      payload.userId,
      {},
      {
        puntos_experiencia: xp,
      },
    );
  }

  @OnEvent('comment.created')
  async handleCommentCreated(payload: { userId: number; commentId: number }) {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayComments = await this.prisma.comentario.count({
      where: {
        id_usuario: payload.userId,

        fecha: {
          gte: today,
        },
      },
    });

    if (todayComments > 40) {
      return;
    }

    let xp = 10;

    await this.petService.updatePet(
      payload.userId,
      {},
      {
        puntos_experiencia: xp,
      },
    );
  }
}
