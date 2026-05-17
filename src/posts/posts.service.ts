import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchPostInput } from './dto/search-post.input';
import { DeletePost } from './dto/delete-post.input';
import { unlink } from 'fs/promises';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(post: CreatePostInput, userId: number) {
    const { files, ...rest } = post;
    const newPost = await this.prisma.post.create({
      data: {
        ...rest,

        files: files?.length
          ? {
              create: files.map((f) => ({
                dir: f.dir,
                file_extension: f.file_extension,
              })),
            }
          : undefined,
        id_usuario: userId,
      },
    });

    if (!files) {
      return newPost;
    }
  }

  async delete(post: DeletePost, user_id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id_usuario: user_id },
    });

    if (!user) {
      throw new UnauthorizedException('Operación no permitida');
    }

    const existingPost = await this.prisma.post.findUnique({
      where: { id_post: post.id_post },
    });

    if (!existingPost) {
      throw new NotFoundException('Post no encontrado');
    }

    if (existingPost.id_usuario !== user_id) {
      throw new UnauthorizedException('No eres dueño de este post');
    }

    const filesPost = await this.prisma.files_Post.findMany({
      where: { id_post: post.id_post },
    });

    await Promise.all(
      filesPost.map(async (file) => {
        try {
          await unlink(file.dir + file.file_extension);
        } catch (err) {
          console.warn(`File not found: ${file.dir}${file.file_extension}`);
        }
      }),
    );

    await this.prisma.post.delete({
      where: { id_post: post.id_post },
    });

    return {
      success: true,
      message: 'Post deleted successfully',
    };
  }

  async feed(select: any, userId?: number) {
    const limit = select.take ?? 10;
    const cursor = select.cursor;

    // 1. sets de señales del usuario
    const likedPosts = new Set<number>();
    const favoritePosts = new Set<number>();
    const sharedPosts = new Set<number>();

    // 2. cargar usuario SOLO si está loggeado
    if (userId) {
      const reactions = await this.prisma.postReactions.findMany({
        where: {
          id_usuario: userId,
        },
        select: {
          id_post: true,
          like: true,
          favorites: true,
          share: true,
        },
      });

      // 3. construir sets rápidos
      for (const r of reactions) {
        if (r.like) likedPosts.add(r.id_post);
        if (r.favorites) favoritePosts.add(r.id_post);
        if (r.share) sharedPosts.add(r.id_post);
      }
    }

    // 4. traer posts base (sin filtros agresivos)
    const posts = await this.prisma.post.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id_post: cursor } : undefined,

      orderBy: {
        fecha_publicacion: 'desc',
      },

      include: {
        comentarios: true,
        reactions: true,
        files: true,
      },
    });

    // 5. SI ES GUEST → return directo
    if (!userId) {
      return {
        data: posts,
        nextCursor: posts.length ? posts[posts.length - 1].id_post : null,
      };
    }

    // 6. SCORING SYSTEM (USER FEED)
    const ranked = posts.map((post) => {
      let score = 0;

      const reactionCount = post.reactions?.length ?? 0;
      const commentCount = post.comentarios?.length ?? 0;

      // 🔥 popularidad global
      score += reactionCount * 1;
      score += commentCount * 2;

      // 🔥 interés del usuario (IMPORTANTE)
      if (likedPosts.has(post.id_post)) {
        score += 5;
      }

      if (favoritePosts.has(post.id_post)) {
        score += 10;
      }

      if (sharedPosts.has(post.id_post)) {
        score += 15;
      }

      // 🔥 recencia
      const ageHours =
        (Date.now() - new Date(post.fecha_publicacion).getTime()) /
        (1000 * 60 * 60);

      score += Math.max(0, 10 - ageHours * 0.3);

      return {
        ...post,
        score,
      };
    });

    // 7. ordenar por relevancia
    ranked.sort((a, b) => b.score - a.score);

    const paginated = ranked.slice(0, limit);

    return {
      data: paginated,
      nextCursor: paginated.length
        ? paginated[paginated.length - 1].id_post
        : null,
    };
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
