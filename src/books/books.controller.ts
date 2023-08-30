import { Body, Controller, Delete, Get, Param, Patch, Post, Inject } from '@nestjs/common';
import { CreateBookDto } from './core/dto/books.dto';
import { BookUseCase } from './use-case/book.use-case';
import { Book } from './core/book-entities';


@Controller('api/books')
export class BooksController {
    constructor(private readonly bookUseCase: BookUseCase) {}

    @Get()
    async getAllBooks(): Promise<Book[]> {
        return this.bookUseCase.getAllBooks();
    }

    @Get(':id')
    async getOneBook(@Param('id') id: string): Promise<Book | undefined> {
        return this.bookUseCase.getOneBook(id);
    }

    @Post()
    async addBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
        return this.bookUseCase.create(createBookDto)
    } 
}
