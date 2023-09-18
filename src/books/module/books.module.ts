import { Module } from '@nestjs/common';
import { BooksController } from '../adapters/primary/books.controller';
import { BookService } from '../core/application/book.service';
import { IBookRepository } from '../core/repository/book-repository';
import { InMemoryBook } from '../adapters/secondary/inMemory/in-memory-book';
import { UserModule } from 'src/user/module/UserModule';
import { MongooseBookRepository } from '../adapters/secondary/mongoDB/mongoRepository';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from '../adapters/secondary/mongoDB/mongoBookEntity';

@Module({
  imports: [
    UserModule,
    // MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }])
  ],
  controllers: [BooksController],
  providers: [
    { provide: BookService, useFactory: (repository: IBookRepository) => new BookService(repository), inject: ['BOOK_REPOSITORY']}, 
    { provide: 'BOOK_REPOSITORY', useClass: InMemoryBook},
  ],
})
export class BooksModule {}
