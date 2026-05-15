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

  async findAll() {
    const data = await this.prisma.post.findMany({
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre_usuario: true,
            avatar: true,
          },
        },

        files: {
          select: {
            id_file: true,
            dir: true,
            file_extension: true,
          },
        },

        _count: {
          select: {
            comentarios: true,
          },
        },

        reactions: {
          select: {
            like: true,
            favorites: true,
            share: true,
          },
        },
      },
    });

    const formatted = data.map((post) => {
      const likes = post.reactions.filter((reaction) => reaction.like).length;

      const favorites = post.reactions.filter(
        (reaction) => reaction.favorites,
      ).length;

      const shares = post.reactions.filter((reaction) => reaction.share).length;

      return {
        id_post: post.id_post,
        title: post.title,
        description: post.description,
        fecha_publicacion: post.fecha_publicacion,

        usuario: post.usuario,

        files: post.files,

        stats: {
          comentarios: post._count.comentarios,
          likes,
          favorites,
          shares,
        },
      };
    });

    return formatted;
  }

  async findByFilter(filter: SearchPostInput) {
    const data = await this.prisma.post.findMany({
      where: {
        AND: [
          filter.search
            ? {
                OR: [
                  {
                    title: {
                      contains: filter.search,
                    },
                  },

                  {
                    description: {
                      contains: filter.search,
                    },
                  },
                ],
              }
            : {},

          filter.username
            ? {
                usuario: {
                  nombre_usuario: {
                    contains: filter.username,
                  },
                },
              }
            : {},
        ],
      },

      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre_usuario: true,
            avatar: true,
          },
        },

        files: true,

        _count: {
          select: {
            comentarios: true,
          },
        },

        reactions: {
          select: {
            like: true,
            favorites: true,
            share: true,
          },
        },
      },

      orderBy: {
        fecha_publicacion: 'desc',
      },
    });

    return data.map((post) => ({
      ...post,

      stats: {
        comentarios: post._count.comentarios,

        likes: post.reactions.filter((r) => r.like).length,

        favorites: post.reactions.filter((r) => r.favorites).length,

        shares: post.reactions.filter((r) => r.share).length,
      },
    }));
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
