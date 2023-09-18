import { Module } from '@nestjs/common';
import { BooksModule } from './books/module/books.module';
import { UserModule } from './user/module/UserModule';
import { DatabaseModule } from './database/database.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
      serveRoot: '/images',
    }),
    BooksModule, 
    UserModule, 
    DatabaseModule
  ],
})
export class AppModule {}
