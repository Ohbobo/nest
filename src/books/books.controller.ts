import { Body, Controller, Delete, Get, Param, Patch, Post, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/adapters/middleware/guard/authGuard';
import { CreateBookDto, UpdatedBookDto } from './core/dto/books.dto';
import { BookService } from './application/book.service';
import { Book } from './core/interface/book-entities';


@Controller('api/books')
@UseGuards(AuthGuard)
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

    // @Post()
    // async addBook(@Body() createBookDto: CreateBookDto, @Req() req: Request): Promise<Book> {
    //     const userId = req.user.userId;
    // }

    @Patch(':id')
    async updateBook(@Param('id') id: string, @Body() updatedBookDto: UpdatedBookDto): Promise<Book | undefined> {
        return this.bookService.updateBook(id, updatedBookDto);
    }

    @Delete('id')
    async deleteBook(@Param('id') id: string): Promise<void> {
        return this.bookService.deleteBook(id);
    }

}
