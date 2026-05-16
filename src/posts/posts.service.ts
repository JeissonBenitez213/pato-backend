import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchPostInput } from './dto/search-post.input';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(createPostInput: CreatePostInput) {
    return 'This action adds a new post';
  }

  async findAll(select: any) {
    const data = await this.prisma.post.findMany({ ...select });
    return data;
  }

  async getStats(id_post: number) {
    const [comentarios, reactions] = await Promise.all([
      this.prisma.comentario.count({
        where: {
          id_post,
        },
      }),

      this.prisma.postReactions.findMany({
        where: {
          id_post,
        },

        select: {
          like: true,
          favorites: true,
          share: true,
        },
      }),
    ]);

    return {
      comentarios,

      likes: reactions.filter((r) => r.like).length,

      favorites: reactions.filter((r) => r.favorites).length,

      shares: reactions.filter((r) => r.share).length,
    };
  }

  async findByFilter(filter: SearchPostInput, select: any) {
    return this.prisma.post.findMany({
      ...select,

      where: {
        AND: [
          filter.search
            ? {
                OR: [
                  {
                    title: {
                      contains: filter.search,
                      mode: 'insensitive',
                    },
                  },

                  {
                    description: {
                      contains: filter.search,
                      mode: 'insensitive',
                    },
                  },
                ],
              }
            : undefined,

          filter.username
            ? {
                usuario: {
                  nombre_usuario: {
                    contains: filter.username,
                    mode: 'insensitive',
                  },
                },
              }
            : undefined,
        ],
      },

      orderBy: {
        fecha_publicacion: 'desc',
      },
    });
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
