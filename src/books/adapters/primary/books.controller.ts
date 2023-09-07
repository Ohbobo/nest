import { Body, Controller, Delete, Get, Param, Post, NotFoundException, UseGuards, Put, Req, ForbiddenException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CreateBookDto, UpdatedBookDto } from '../../core/dto/books.dto';
import { BookService } from '../../core/application/book.service';
import { IBook } from '../../core/interface/book-entities';
import { AuthGuard } from 'src/auth/adapters/middleware/guard/authGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MulterConfig } from '../secondary/middleware/multerConfig';


@Controller('api/books')
export class BooksController {
    constructor(private readonly bookService: BookService) {}

    @Get()
    async getAllBooks(): Promise<IBook[]> {
        return this.bookService.getAllBooks();
    }

    @Get(':id')
    async getOneBook(@Param('id') id: string): Promise<IBook> {
        const bookById = await this.bookService.getOneBook(id);
        if(!bookById) {
            throw new NotFoundException('livre non trouvé')
        }
        return bookById;
    }

    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file', MulterConfig))
    async createBook(
        @Body() createBookDto: CreateBookDto, 
        @Req() req: any,
        @UploadedFile() file: Express.Multer.File,
        ): Promise<IBook>
        {
        const userId = req.user.userId;
        const imageUrl = `./images/${file.filename}`;
        const book = await this.bookService.createBook(createBookDto, userId, imageUrl);
        return book;
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async updateBook(@Param('id') id: string, @Body() updatedBookDto: UpdatedBookDto, @Req() req: any): Promise<IBook> {
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

    @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images', // Le dossier où les images seront stockées
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { imagePath: `images/${file.filename}` };
  }
}

