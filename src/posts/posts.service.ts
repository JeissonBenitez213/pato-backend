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
import { AddReaction } from './dto/add-reaction.input';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

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

    let xp = 35;

    if (files?.length) {
      xp += 10;
    }

    if (files && files.length >= 4) {
      xp += 10;
    }

    this.eventEmitter.emit('post.created', {
      userId,
      postId: newPost.id_post,
      xp,
    });

    return newPost;
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

  async feed(
    options: {
      take?: number;
      cursor?: number;
    },
    userId?: number,
  ) {
    const limit = options.take ?? 10;
    const cursor = options.cursor;

    const likedPosts = new Set<number>();
    const favoritePosts = new Set<number>();
    const sharedPosts = new Set<number>();

    if (userId) {
      // SQL equivalent:
      // SELECT id_post, like, favorites, share FROM PostReactions WHERE id_usuario = ?;
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

      for (const r of reactions) {
        if (r.like) likedPosts.add(r.id_post);
        if (r.favorites) favoritePosts.add(r.id_post);
        if (r.share) sharedPosts.add(r.id_post);
      }
    }

    // SQL equivalent:
    // SELECT p.*, c.*, r.*, f.* FROM Post p
    // LEFT JOIN Comentario c ON c.id_post = p.id_post
    // LEFT JOIN PostReactions r ON r.id_post = p.id_post
    // LEFT JOIN Files_Post f ON f.id_post = p.id_post
    // ORDER BY p.fecha_publicacion DESC
    // LIMIT ? OFFSET ?;
    const posts = await this.prisma.post.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id_post: cursor } : undefined,

      orderBy: {
        fecha_publicacion: 'desc',
      },

      include: {
        comentarios: {
          include: {
            usuario: true,
            files: true,
          },
        },
        reactions: true,
        files: true,
        usuario: true,
      },
    });

    if (!userId) {
      return {
        data: posts,
        nextCursor: posts.length ? posts[posts.length - 1].id_post : null,
      };
    }

    const ranked = posts.map((post) => {
      let score = 0;

      const reactionCount = post.reactions?.length ?? 0;
      const commentCount = post.comentarios?.length ?? 0;

      score += reactionCount * 1;
      score += commentCount * 2;

      if (likedPosts.has(post.id_post)) {
        score += 5;
      }

      if (favoritePosts.has(post.id_post)) {
        score += 10;
      }

      if (sharedPosts.has(post.id_post)) {
        score += 15;
      }

      const ageHours =
        (Date.now() - new Date(post.fecha_publicacion).getTime()) /
        (1000 * 60 * 60);

      score += Math.max(0, 10 - ageHours * 0.3);

      return {
        ...post,
        score,
      };
    });

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
      // SQL equivalent:
      // SELECT COUNT(*) FROM Comentario WHERE id_post = ?;
      this.prisma.comentario.count({
        where: {
          id_post,
        },
      }),

      // SQL equivalent:
      // SELECT like, favorites, share FROM PostReactions WHERE id_post = ?;
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
    const filters = [
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
        : null,

      filter.username
        ? {
            usuario: {
              nombre_usuario: {
                contains: filter.username,
              },
            },
          }
        : null,
    ].filter(Boolean);

    return this.prisma.post.findMany({
      ...select,

      where: filters.length
        ? {
            AND: filters,
          }
        : undefined,

      orderBy: {
        fecha_publicacion: 'desc',
      },
    });
  }

  async updateReaction(input: UpdatePostInput, user_id: number, select: any) {
    // SQL equivalent:
    // SELECT * FROM Post WHERE id_post = ? AND id_usuario = ? LIMIT 1;
    const validate = await this.prisma.post.findFirst({
      where: {
        AND: [{ id_post: input.id_post }, { id_usuario: user_id }],
      },
    });

    if (!validate) {
      throw new UnauthorizedException('no eres el dueño del post');
    }

    // SQL equivalent:
    // UPDATE Post SET title = ?, description = ? WHERE id_post = ?;
    const updatePost = await this.prisma.post.update({
      where: {
        id_post: input.id_post,
      },
      data: {
        title: input.title,
        description: input.description,
      },
    });

    return updatePost;
  }

  async addReaction(input: AddReaction, select: any, id_usuario: number) {
    const { id_post, ...reactions } = input;

    const filteredReactions = Object.fromEntries(
      Object.entries(reactions).filter(([_, value]) => value !== undefined),
    );

    // SQL equivalent:
    // IF EXISTS (SELECT 1 FROM PostReactions WHERE id_usuario = ? AND id_post = ?)
    //   UPDATE PostReactions SET ... WHERE id_usuario = ? AND id_post = ?;
    // ELSE
    //   INSERT INTO PostReactions (id_post, id_usuario, ...) VALUES (...);
    const reaction = await this.prisma.postReactions.upsert({
      where: {
        id_usuario_id_post: {
          id_usuario,
          id_post,
        },
      },

      update: {
        ...filteredReactions,
      },

      create: {
        id_post,
        id_usuario,
        ...filteredReactions,
      },

      ...select,
    });

    return reaction;
  }
}
