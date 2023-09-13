import { Body, Controller, Delete, Get, Param, Post, NotFoundException, UseGuards, Put, Req, ForbiddenException, UseInterceptors, UploadedFile, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { CreateBookDto, UpdatedBookDto } from '../../core/dto/books.dto';
import { BookService } from '../../core/application/book.service';
import { IBook } from '../../core/interface/book-entities';
import { AuthGuard } from 'src/auth/adapters/middleware/guard/authGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from '../secondary/middleware/multerConfig';


@Controller('api/books')
export class BooksController {
  constructor(private readonly bookService: BookService) { }

  @Get()
  async getAllBooks(): Promise<IBook[]> {
    return this.bookService.getAllBooks();
  }
  
  @Get('/bestrating')
  async getBestRatingBooks() {
    const bestRatingBooks = await this.bookService.getBestRating();

    if (!bestRatingBooks || bestRatingBooks.length === 0) {
      throw new NotFoundException('Aucun livre trouvé');
    }

    return bestRatingBooks;
  }

  @Get(':id')
  async getOneBook(@Param('id') id: string): Promise<IBook> {
    const bookById = await this.bookService.getOneBook(id);
    if (!bookById) {
      throw new NotFoundException('livre non trouvé')
    }
    return bookById;
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', MulterConfig))
  async createBook(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Body() body,
  ): Promise<IBook> {
    const userId = req.user.userId;
    const imageUrl = `${process.env.APP_URL}/images/${file.filename}`;
    const createBookDto = JSON.parse(body.book);

    createBookDto.year = parseInt(createBookDto.year, 10);

    const book = await this.bookService.createBook(createBookDto, userId, imageUrl);
    return book;
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', MulterConfig))
  async updateBook(
    @Param('id') id: string,
    @Body() updatedBookDto: UpdatedBookDto,
    @Req() req: any,
    @UploadedFile() imageFile: Express.Multer.File,
  ): Promise<IBook> {
    const userId = req.user.userId;
    const isOwner = await this.bookService.isBookOwner(id, userId);
  
    if (!isOwner) {
      throw new ForbiddenException("Vous ne pouvez pas modifier ce livre");
    }

    const imageUrl = `${process.env.APP_URL}/images/${imageFile.filename}`;
    return this.bookService.updateBook(id, updatedBookDto, userId, imageUrl);
  }
  
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteBook(@Param('id') id: string, @Req() req: any): Promise<void> {
    const userId = req.user.userId;
    const isOwner = await this.bookService.isBookOwner(id, userId);

    if (!isOwner) {
      throw new ForbiddenException("Vous ne pouvez pas supprimer ce livre");
    }

    await this.bookService.deleteBook(id);
  }

  @Post(':id/rating')
  @UseGuards(AuthGuard)
    async rateABook(
      @Param('id') id: string,
      @Body() requestBody: any,
      @Req() req: any
    ): Promise<IBook> {
      const userId = req.user.userId;
      const { rating } = requestBody; 

      const bookToRate = await this.bookService.rateABook(id, userId, rating);

      if (!bookToRate) {
        throw new NotFoundException('Livre non trouvé');
      }

      return bookToRate;
  }
}

