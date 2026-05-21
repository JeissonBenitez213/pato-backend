import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from './dto/login.dto';
import type { Request, Response } from 'express';
import { LoginAuth } from './dto/loginAuth.dto';
import { Register } from './dto/register.dto';
import { RegisterAuth } from './dto/registerAuth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() login: Login, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.login(login);
    const tokens = await this.authService.generateAuthTokens(user);

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: false, // poner en true para producción
      sameSite: 'none',
      path: '/',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: false, // poner en true para producción
      sameSite: 'none',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { ok: true };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    const user = await this.authService.validateRefreshToken(refreshToken);
    const tokens = await this.authService.generateAuthTokens(user);

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: false, // poner en true para producción
      sameSite: 'none',
      path: '/',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: false, // poner en true para producción
      sameSite: 'none',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { ok: true };
  }

  @Get('me')
  async me(@Req() req: Request) {
    const accessToken = req.cookies?.access_token;
    const user = await this.authService.validateAccessToken(accessToken);

    return {
      authenticated: true,
      id: user.id_usuario,
      nombre_usuario: user.nombre_usuario,
      is_admin: user.is_admin,
    };
  }

  @Post('oAuthLogin')
  async oAuthLogin(
    @Body() data: LoginAuth,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.loginOAuth(data);
    const tokens = await this.authService.generateAuthTokens(user);

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: false, // poner en true para producción
      sameSite: 'none',
      path: '/',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: false, // poner en true para producción
      sameSite: 'none',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { ok: true };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.refresh_token;

    if (token) {
      const logouted = await this.authService.logout(token);
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        path: '/',
      });
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        path: '/',
      });
      return { ok: true };
    }

    throw new UnauthorizedException('no hay ninguna sesión iniciada');
  }

  @Post('register')
  async register(@Body() data: Register) {
    return await this.authService.regiser(data);
  }

  @Post('registerAuth')
  async registerAuth(@Body() data: RegisterAuth) {
    return await this.authService.registerAuth(data);
  }
}
