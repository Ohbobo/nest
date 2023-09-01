import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/module/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [BooksModule, AuthModule, DatabaseModule],
})
export class AppModule {}
