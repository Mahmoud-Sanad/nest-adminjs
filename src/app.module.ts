import { Module } from '@nestjs/common';
import { AdminModule } from '@adminjs/nestjs';
import { DMMFClass } from '@prisma/client/runtime';
import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/prisma';

import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { JwtGuard } from './auth/guards/jwt.guard';
import { join } from 'path';
import { GatwayModule } from './gatway/gatway.module';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';

AdminJS.registerAdapter({ Resource, Database });

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    BookmarkModule,
    JwtGuard,
    AdminModule.createAdminAsync({
      imports: [PrismaModule, GatwayModule],
      inject: [PrismaService],
      useFactory: async (prisma: PrismaService) => {
        const dmmf = (prisma as any)._dmmf as DMMFClass;
        return {
          adminJsOptions: {
            rootPath: '/admin',
            branding: {
              companyName: 'OPPA',
              logo: join(__dirname, 'public/Oppa-logo.svg.png'),
            },
            assets: {
              styles: ['/admin.option.css'],
            },
            resources: [
              {
                resource: { model: dmmf.modelMap.User, client: prisma },
                options: {},
              },
              {
                resource: { model: dmmf.modelMap.Bookmark, client: prisma },
                options: {},
              },
            ],
          },
        };
      },
    }),
    MessageModule,
    ChatModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
