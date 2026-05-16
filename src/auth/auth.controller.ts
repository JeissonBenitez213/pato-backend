import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from './dto/login.dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() login: Login, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.login(login);
    const tokens = await this.authService.generateAuthTokens(user);

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: false, //poner en true para producción
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: false, //poner en true para producción
      sameSite: 'lax',
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
      secure: false, //poner en true para producción
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: false, //poner en true para producción
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { ok: true };
  }
}
