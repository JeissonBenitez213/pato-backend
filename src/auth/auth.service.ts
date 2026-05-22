import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Login } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { LoginAuth } from './dto/loginAuth.dto';
import { Register } from './dto/register.dto';
import { RegisterAuth } from './dto/registerAuth.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async login(login: Login) {
    // SQL equivalent:
    // SELECT * FROM Usuario WHERE nombre_usuario = ? LIMIT 1;
    const user = await this.prisma.usuario.findUnique({
      where: {
        nombre_usuario: login.nombre_usuario,
      },
    });

    if (!user) {
      throw new UnauthorizedException('usuario o contraseña incorrectos');
    }

    if (!user.contraseña_hash) {
      throw new UnauthorizedException('usuario o contraseña incorrectos');
    }

    const validate = await compare(login.contraseña, user.contraseña_hash);

    if (!validate) {
      throw new UnauthorizedException('usuario o contraseña incorrectos');
    }

    return user;
  }

  async validateRefreshToken(token: string) {
    if (!token) {
      throw new UnauthorizedException();
    }

    const payload = await this.jwtService.verify(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    // SQL equivalent:
    // SELECT * FROM Usuario WHERE id_usuario = ? LIMIT 1;
    const user = await this.prisma.usuario.findUnique({
      where: { id_usuario: payload.sub },
    });

    if (!user || !user.refresh_token) {
      throw new UnauthorizedException();
    }

    const isValid = await compare(token, user.refresh_token);

    if (!isValid) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    return user;
  }

  async generateAuthTokens(user: any) {
    const payload = {
      sub: user.id_usuario,
      username: user.nombre_usuario,
      isAdmin: user.is_admin,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    const hashedRefresh = await hash(refreshToken, 10);

    // SQL equivalent:
    // UPDATE Usuario SET refresh_token = ? WHERE id_usuario = ?;
    await this.prisma.usuario.update({
      where: { id_usuario: user.id_usuario },
      data: { refresh_token: hashedRefresh },
    });

    return { accessToken, refreshToken };
  }

  async validateAccessToken(token: string) {
    if (!token) {
      throw new UnauthorizedException('No access token provided');
    }

    const payload = await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    // SQL equivalent:
    // SELECT * FROM Usuario WHERE id_usuario = ? LIMIT 1;
    const user = await this.prisma.usuario.findUnique({
      where: { id_usuario: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async loginOAuth(data: LoginAuth) {
    // SQL equivalent:
    // SELECT a.*, u.* FROM AuthAcount a
    // JOIN Usuario u ON u.id_usuario = a.userId
    // WHERE a.provider = ? AND a.provider_id = ? LIMIT 1;
    const user = await this.prisma.authAcount.findUnique({
      where: {
        provider_provider_id: {
          provider: data.provider,
          provider_id: data.provider_id,
        },
      },
      include: {
        user: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    return user.user;
  }

  async regiser(data: Register) {
    if (data.contraseña != data.contraseña_repetida) {
      throw new UnauthorizedException('usuario o contraseña incorrectas');
    }

    const validateUser = await this.prisma.usuario.findUnique({
      where: {
        nombre_usuario: data.nombre_usuario,
      },
    });

    if (!validateUser) {
      const hashed_password = await hash(data.contraseña, 10);

      const newUser = await this.prisma.usuario.create({
        data: {
          nombre_usuario: data.nombre_usuario,
          contraseña_hash: hashed_password,
        },
      });

      this.eventEmitter.emit('user.registered', {
        userId: newUser.id_usuario,
      });

      return newUser;
    }

    throw new UnauthorizedException('usuario ya existente');
  }

  async registerAuth(data: RegisterAuth) {
    // SQL equivalent:
    // INSERT INTO Usuario (nombre_usuario) VALUES (?);
    // INSERT INTO AuthAcount (provider, provider_id, userId)
    // VALUES (?, ?, LAST_INSERT_ID());
    const newUser = await this.prisma.usuario.create({
      data: {
        nombre_usuario: data.username,
        auths: {
          create: {
            provider: data.provider,
            provider_id: data.provider_id,
          },
        },
      },
    });

    this.eventEmitter.emit('user.registered', {
      userId: newUser.id_usuario,
    });

    return newUser;
  }

  async logout(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    // SQL equivalent:
    // UPDATE Usuario SET refresh_token = NULL WHERE id_usuario = ?;
    const logouted = await this.prisma.usuario.update({
      where: { id_usuario: payload.sub },
      data: {
        refresh_token: null,
      },
    });

    return logouted;
  }
}
