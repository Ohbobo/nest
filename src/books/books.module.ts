import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BookService } from './application/book.service';
import { IBookRepository } from './core/repository/book-repository';
import { InMemoryBook } from './inMemory/in-memory-book';
import { AuthModule } from 'src/auth/module/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BooksController],
  providers: [
    { provide: BookService, useFactory: (repository: IBookRepository) => new BookService(repository), inject: ['BOOK_REPOSITORY']}, 
    { provide: 'BOOK_REPOSITORY', useClass: InMemoryBook},
  ],
})
export class BooksModule {}
