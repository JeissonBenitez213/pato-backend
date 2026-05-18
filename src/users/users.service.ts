import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
    const user = await this.prisma.usuario.findUnique({
      where: {
        id_usuario: id_user,
      },
      ...select,
    });

    return user;
  }

  async toggleFollow(id_user: number, id_user_to_follow: number, select: any) {
    const validateUser = await this.prisma.follow.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: id_user,
          following_id: id_user_to_follow,
        },
      },
    });

    if (!validateUser) {
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
}
