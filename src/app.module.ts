import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { PetModule } from './pet/pet.module';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { BadgesModule } from './badges/badges.module';
import { FilesModule } from './files/files.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PostsModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),

      sortSchema: true,

      subscriptions: {
        'graphql-ws': true,
      },

      context: ({ req, res }) => ({
        req,
        res,
      }),
    }),

    EventEmitterModule.forRoot(),

    CommentsModule,
    UsersModule,
    PetModule,
    MessagesModule,
    AuthModule,
    BadgesModule,
    FilesModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
