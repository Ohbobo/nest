import { Body, Controller, Delete, Get, Param, Post, NotFoundException, UseGuards, Put, Req, ForbiddenException } from '@nestjs/common';
import { CreateBookDto, UpdatedBookDto } from '../../core/dto/books.dto';
import { BookService } from '../../core/application/book.service';
import { Book } from '../../core/interface/book-entities';
import { AuthGuard } from 'src/auth/adapters/middleware/guard/authGuard';


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
    @UseGuards(AuthGuard)
    async createBook(@Body() createBookDto: CreateBookDto, @Req() req: any): Promise<Book> {
        const userId = req.user.userId;
        const book = await this.bookService.create(createBookDto, userId);
        return book;
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async updateBook(@Param('id') id: string, @Body() updatedBookDto: UpdatedBookDto, @Req() req: any): Promise<Book> {
        const userId = req.user.userId;
        const isOwner = await this.bookService.isBookOwner(id, userId);

        if(!isOwner){
            throw new ForbiddenException("Vous ne pouvez pas modifier ce livre");
        }
        return this.bookService.updateBook(id, updatedBookDto, userId);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteBook(@Param('id') id: string, @Req() req: any): Promise<void> {
        const userId = req.user.userId;
        const isOwner = await this.bookService.isBookOwner(id, userId);

        if(!isOwner){
            throw new ForbiddenException("Vous ne pouvez pas supprimer ce livre");
        }
        
        await this.bookService.deleteBook(id);
    }
}
