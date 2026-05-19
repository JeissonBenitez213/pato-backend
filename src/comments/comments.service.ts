import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddReactions } from './dto/add-reactions.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getComments(select: any) {
    return await this.prisma.comentario.findMany({
      where: {
        id_comentario_padre: null,
      },
      ...select,
    });
  }

  async getCommentByParents(idComment: number, content: any) {
    return await this.prisma.comentario.findMany({
      where: {
        id_comentario_padre: idComment,
      },
      ...content,
    });
  }

  async create(input: CreateCommentInput, select: any, userId: number) {
    const newComment = await this.prisma.comentario.create({
      data: {
        id_usuario: userId,
        texto: input.texto,
        id_post: input.id_post,

        files: input.files
          ? {
              create: input.files.map((file) => ({
                dir: file.dir,
                file_extension: file.file_extension,
              })),
            }
          : undefined,
      },
      ...select,
    });

    this.eventEmitter.emit('comment.created', {
      userId,
      xp: 15,
    });

    return newComment;
  }

  async delete(id_comment: number, id_user: number, select: any) {
    const validate = await this.prisma.comentario.findFirst({
      where: { AND: [{ id_comentario: id_comment }, { id_usuario: id_user }] },
    });

    if (!validate) {
      throw new UnauthorizedException('operacion no permitida');
    }

    const deleteMessage = await this.prisma.comentario.delete({
      where: {
        id_comentario: id_comment,
      },
      ...select,
    });

    return deleteMessage;
  }

  async addReactions(select: any, user_id: number, input: AddReactions) {
    const validate = await this.prisma.comentario.findFirst({
      where: {
        id_comentario: input.id_comment,
      },
    });

    if (!validate) {
      throw new NotFoundException('Comentario no encontrado');
    }

    const { id_comment, ...rest } = input;

    const data = Object.fromEntries(
      Object.entries(rest).filter(([_, v]) => v !== undefined),
    );

    const addReaction = await this.prisma.comentarioReactions.upsert({
      where: {
        id_comment_id_usuario: {
          id_comment,
          id_usuario: user_id,
        },
      },

      update: {
        ...data,
      },

      create: {
        id_comment,
        id_usuario: user_id,
        ...data,
      },

      ...select,
    });

    return addReaction;
  }

  async updateComment(id_user: number, input: UpdateCommentInput, select: any) {
    const validate = await this.prisma.comentario.findFirst({
      where: {
        AND: [{ id_comentario: input.id_comentario }, { id_usuario: id_user }],
      },
    });

    if (!validate) {
      throw new NotFoundException('comentario no encontrado');
    }

    const updatedComment = await this.prisma.comentario.update({
      where: {
        id_comentario: input.id_comentario,
      },
      data: {
        texto: input.texto,
      },
      ...select,
    });

    return updatedComment;
  }
}
