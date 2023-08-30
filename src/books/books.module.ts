import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BookUseCase } from './use-case/book.use-case';
import { IBookRepository } from './core/repository/book-repository';
import { InMemoryBook } from './core/data/data-service';

@Module({
  controllers: [BooksController],
  providers: [
    BookUseCase, 
    { provide: 'IBookRepository', useClass: InMemoryBook},
  ],
})
export class BooksModule {}
