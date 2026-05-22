import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessage } from './dto/create_message.dto';
import { DeleteMessage } from './dto/delete_message.dto';
import { UpdateMessage } from './dto/update_message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getMessages(id_usuario_envia: number, id_usuario_recibe: number) {
    // SQL equivalent:
    // SELECT m.*, f.* FROM Mensaje m
    // LEFT JOIN Files_Mensaje f ON f.id_mensaje = m.id_mensaje
    // WHERE m.id_usuario_envia = ? AND m.id_usuario_recibe = ?;
    const messages = await this.prisma.mensaje.findMany({
      where: {
        AND: [
          { id_usuario_envia: id_usuario_envia },
          { id_usuario_recibe: id_usuario_recibe },
        ],
      },
      include: {
        files: true,
      },
    });

    return messages;
  }

  async createMessage(input: CreateMessage) {
    // SQL equivalent:
    // INSERT INTO Mensaje (id_usuario_envia, id_usuario_recibe, texto)
    // VALUES (?, ?, ?);
    // INSERT INTO Files_Mensaje (id_mensaje, dir, fie_extension) VALUES (...);
    const newMessage = await this.prisma.mensaje.create({
      data: {
        id_usuario_envia: input.id_usuario_envia,
        id_usuario_recibe: input.id_usuario_recibe,
        texto: input.texto,

        ...(input.files?.length && {
          files: {
            create: input.files.map((file) => ({
              dir: file.dir,
              file_extension: file.fie_extension,
            })),
          },
        }),
      },

      include: {
        files: true,
      },
    });

    return newMessage;
  }

  async deleteMessage(input: DeleteMessage) {
    // SQL equivalent:
    // DELETE FROM Mensaje WHERE id_mensaje = ?;
    const delete_message = await this.prisma.mensaje.delete({
      where: {
        id_mensaje: input.id_mensaje,
      },
    });

    return delete_message;
  }

  async updateMessage(input: UpdateMessage) {
    // SQL equivalent:
    // UPDATE Mensaje SET texto = ? WHERE id_mensaje = ?;
    const updated_message = await this.prisma.mensaje.update({
      where: {
        id_mensaje: input.id_mensaje,
      },
      data: {
        texto: input.texto,
      },
    });
  }
}
