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
    // SELECT * FROM Mensaje
    // WHERE (envia = ? AND recibe = ?)
    //    OR (envia = ? AND recibe = ?)

    return this.prisma.mensaje.findMany({
      where: {
        OR: [
          {
            id_usuario_envia,
            id_usuario_recibe,
          },
          {
            id_usuario_envia: id_usuario_recibe,
            id_usuario_recibe: id_usuario_envia,
          },
        ],
      },

      include: {
        // 🔥 CRÍTICO: estas dos relaciones evitan el error GraphQL
        envia: true,
        recibe: true,
      },

      orderBy: {
        fecha: 'asc',
      },
    });
  }

  async createMessage(input: CreateMessage) {
    // SQL equivalent:
    // INSERT INTO Mensaje (...)
    // INSERT INTO Files_Mensaje (...)

    return this.prisma.mensaje.create({
      data: {
        id_usuario_envia: input.id_usuario_envia,
        id_usuario_recibe: input.id_usuario_recibe,
        texto: input.texto,
      },

      include: {
        envia: true,
        recibe: true,
      },
    });
  }

  async deleteMessage(input: DeleteMessage) {
    // SQL equivalent:
    // DELETE FROM Mensaje WHERE id_mensaje = ?

    return this.prisma.mensaje.delete({
      where: {
        id_mensaje: input.id_mensaje,
      },

      include: {
        envia: true,
        recibe: true,
      },
    });
  }

  async updateMessage(input: UpdateMessage) {
    // SQL equivalent:
    // UPDATE Mensaje SET texto = ? WHERE id_mensaje = ?

    return this.prisma.mensaje.update({
      where: {
        id_mensaje: input.id_mensaje,
      },

      data: {
        texto: input.texto,
      },

      include: {
        envia: true,
        recibe: true,
      },
    });
  }
}
