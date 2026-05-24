import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUser } from './dto/update_user.input';
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAllFriends(id_user: number, select: any) {
    const friends = await this.prisma.follow.findMany({
      where: {
        follower_id: id_user,

        following: {
          siguiendo: {
            some: {
              following_id: id_user,
            },
          },
        },
      },

      select: {
        following: select.select,
      },
    });

    return friends.map((friend) => friend.following);
  }

  async findOneUser(id_user: number, select: any) {
    // SQL equivalent:
    // SELECT * FROM Usuario WHERE id_usuario = ? LIMIT 1;
    const user = await this.prisma.usuario.findUnique({
      where: {
        id_usuario: id_user,
      },
      ...select,
    });

    return user;
  }

  async toggleFollow(id_user: number, id_user_to_follow: number, select: any) {
    // SQL equivalent:
    // SELECT * FROM Follow WHERE follower_id = ? AND following_id = ? LIMIT 1;
    const validateUser = await this.prisma.follow.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: id_user,
          following_id: id_user_to_follow,
        },
      },
    });

    if (!validateUser) {
      // SQL equivalent:
      // INSERT INTO Follow (follower_id, following_id) VALUES (?, ?);
      const follow = await this.prisma.follow.create({
        data: {
          follower_id: id_user,
          following_id: id_user_to_follow,
        },

        select: {
          following: select.select,
        },
      });

      return {
        user: follow.following,
        following: true,
      };
    }

    // SQL equivalent:
    // DELETE FROM Follow WHERE follower_id = ? AND following_id = ?;
    const follow = await this.prisma.follow.delete({
      where: {
        follower_id_following_id: {
          follower_id: id_user,
          following_id: id_user_to_follow,
        },
      },

      select: {
        following: select.select,
      },
    });

    return {
      user: follow.following,
      following: false,
    };
  }

  async updateUser(id_user: number, input: UpdateUser, select: any) {
    const userData = await this.prisma.usuario.findFirst({
      where: {
        id_usuario: id_user,
      },
    });

    if (!userData) {
      throw new UnauthorizedException('usuario no encontrado');
    }

    // si llega un nuevo avatar
    if (input.avatar !== undefined && input.avatar !== userData.avatar) {
      const oldAvatar = userData.avatar;

      const isPlaceholder =
        oldAvatar === 'https://placehold.co/300x300?text=Avatar';

      // detectar si NO es una URL
      const isLocalFile =
        oldAvatar &&
        !oldAvatar.startsWith('http://') &&
        !oldAvatar.startsWith('https://');

      // eliminar archivo anterior
      if (isLocalFile && !isPlaceholder) {
        try {
          if (existsSync(oldAvatar)) {
            await unlink(oldAvatar);
          }
        } catch (error) {
          console.error('Error deleting old avatar:', error);
        }
      }
    }

    // limpiar undefined y null
    const cleanData = Object.fromEntries(
      Object.entries(input).filter(
        ([_, value]) => value !== undefined && value !== null,
      ),
    );

    const newUser = await this.prisma.usuario.update({
      where: {
        id_usuario: id_user,
      },
      data: {
        ...cleanData,
      },
    });

    return newUser;
  }
}
