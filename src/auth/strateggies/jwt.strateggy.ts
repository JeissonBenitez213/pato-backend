import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.access_token,
      ]),

      ignoreExpiration: false,

      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: number; username: string; isAdmin: boolean }) {
    const user = await this.prisma.usuario.findUnique({
      where: {
        id_usuario: payload.sub,
      },

      select: {
        id_usuario: true,
        username: true,
        isAdmin: true,
        banned: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.banned) {
      throw new ForbiddenException('User banned');
    }

    return {
      id: user.id_usuario,
      username: user.username,
      isAdmin: user.isAdmin,
    };
  }
}
