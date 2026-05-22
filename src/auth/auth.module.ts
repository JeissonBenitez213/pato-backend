import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './strateggies/jwt.strateggy';

import { PrismaService } from 'src/prisma/prisma.service';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { StringValue } from 'ms';

@Module({
  controllers: [AuthController],

  providers: [AuthService, JwtStrategy, PrismaService],

  imports: [
    ConfigModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => ({
        global: true,

        secret: configService.get<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: configService.get<StringValue>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
})
export class AuthModule {}
