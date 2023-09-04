import { Body, Controller, Delete, Get, Param, Post, NotFoundException, UseGuards, Put, Req } from '@nestjs/common';
import { CreateBookDto, UpdatedBookDto } from './core/dto/books.dto';
import { BookService } from './application/book.service';
import { Book } from './core/interface/book-entities';
import { AuthMiddleware } from 'src/auth/adapters/middleware/auth/authMiddleware.service';


@Controller('api/books')
export class BooksController {
    constructor(private readonly bookService: BookService) {}

    @Get()
    async getAllBooks(): Promise<Book[]> {
        return this.bookService.getAllBooks();
    }

    @Get(':id')
    async getOneBook(@Param('id') id: string): Promise<Book | undefined> {
        const book = await this.bookService.getOneBook(id);
        if(!book) {
            throw new NotFoundException('livre non trouvé')
        }
        return book;
    }

    @Post()
    @UseGuards(AuthMiddleware)
    async createBook(@Body() createBookDto: CreateBookDto, @Req() req: any): Promise<Book> {
        const userId = req.user.userId;
        const book = await this.bookService.create(createBookDto, userId);
        return book;
    }

    @Put(':id')
    async updateBook(@Param('id') id: string, @Body() updatedBookDto: UpdatedBookDto): Promise<Book | undefined> {
        return this.bookService.updateBook(id, updatedBookDto);
    }

    @Delete('id')
    async deleteBook(@Param('id') id: string): Promise<void> {
        return this.bookService.deleteBook(id);
    }

}
