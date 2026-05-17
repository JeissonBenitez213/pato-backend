import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Login } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { LoginAuth } from './dto/loginAuth.dto';
import { Register } from './dto/register.dto';
import { RegisterAuth } from './dto/registerAuth.dto';
import { CreatePostInput } from 'src/posts/dto/create-post.input';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(login: Login) {
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

    await this.prisma.usuario.update({
      where: { id_usuario: user.id_usuario },
      data: { refresh_token: hashedRefresh },
    });

    return { accessToken, refreshToken };
  }

  async loginOAuth(data: LoginAuth) {
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

    const hashed_password = await hash(data.contraseña, 10);

    const newUser = await this.prisma.usuario.create({
      data: {
        nombre_usuario: data.nombre_usuario,
        contraseña_hash: hashed_password,
      },
    });

    return newUser;
  }

  async registerAuth(data: RegisterAuth) {
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

    return newUser;
  }

  async logout(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const logouted = await this.prisma.usuario.update({
      where: { id_usuario: payload.sub },
      data: {
        refresh_token: null,
      },
    });

    return logouted;
  }
}
