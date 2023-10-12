import * as sharp from 'sharp';
import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Post, 
  NotFoundException, 
  UseGuards, 
  Put, 
  Req, 
  ForbiddenException, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException,} from '@nestjs/common';
import { CacheInterceptor, CacheTTL, CACHE_MANAGER, CacheKey } from '@nestjs/cache-manager';
import { BookService } from '../../core/application/book.service';
import { IBook } from '../../core/interface/book-entities';
import { AuthGuard } from 'src/user/adapters/middleware/guard/authGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from '../secondary/middleware/multerConfig';

@Controller('api/books')
export class BooksController {
  constructor(
    private readonly bookService: BookService,
    ) {}

  @Get()
  async getAllBooks(): Promise<IBook[]> {
    try {
      return this.bookService.getAllBooks();
    } catch (error) {
      console.error('Erreur lors de la récupération des livres :', error);
      throw new NotFoundException('Erreur lors de la récupération des livres');
    }
  }
  
  @Get('/bestrating')
  async getBestRatingBooks() {
    try {
      const bestRatingBooks = await this.bookService.getBestRating();

      if (!bestRatingBooks || bestRatingBooks.length === 0) {
        throw new NotFoundException('Aucun livre trouvé');
      }
  
      return bestRatingBooks;
    } catch (error) {
      console.error('Erreur lors de la récupération des meilleurs livres :', error);
      throw new NotFoundException('Erreur lors de la récupération des meilleurs livres');
    }
  }

  @Get(':id')
  async getOneBook(@Param('id') id: string): Promise<IBook> {
    try {
      const bookById = await this.bookService.getOneBook(id);
      if (!bookById) {
        throw new NotFoundException('livre non trouvé')
      }
      return bookById;
    } catch (error) {
      console.error('Erreur lors de la récupération du livre :', error);
      throw new NotFoundException('Erreur lors de la récupération du livre');
    }
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
    const createBookDto = JSON.parse(body.book);
    const resizedFileName = `resized_${file.filename}`;

    try {
      await sharp(`${file.destination}/${file.filename}`)
        .resize({ width: 400 })
        .toFile(`${file.destination}/${resizedFileName}`)

      createBookDto.year = parseInt(createBookDto.year, 10);

      const imageUrl = `${process.env.APP_URL}/images/${resizedFileName}`;

      const book = await this.bookService.createBook(createBookDto, userId, imageUrl);
      return book;
    } catch (error) {
      console.error("Erreur lors du redimensionnement de l'image :", error);
      throw new BadRequestException("Erreur lors du redimensionnement de l'image");
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', MulterConfig))
  async updateBook(
    @Param('id') id: string,
    @Req() req: any,
    @UploadedFile() imageFile: Express.Multer.File | undefined,
    @Body() updatedBookDto: any,
  ): Promise<IBook> {
    const userId = req.user.userId;
    const isOwner = await this.bookService.isBookOwner(id, userId);

    if (!isOwner) {
      throw new ForbiddenException("Vous ne pouvez pas modifier ce livre");
    }

    try {
      let imageUrl = null;
      if (imageFile) {
        const resizedFileName = `resized_${imageFile.filename}`;
        await sharp(imageFile.path)
          .resize({ width: 400 })
          .toFile(`${imageFile.destination}/${resizedFileName}`);
        imageUrl = `${process.env.APP_URL}/images/${resizedFileName}`;
        console.log('Nouvelle URL de l\'image :', imageUrl);
      }
      const bookData = updatedBookDto.book ? JSON.parse(updatedBookDto.book) : updatedBookDto;
      const updatedBook = await this.bookService.updateBook(id, bookData, userId, imageUrl);
      return updatedBook;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du livre :", error);
      throw new BadRequestException("Erreur lors de la mise à jour du livre");
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteBook(@Param('id') id: string, @Req() req: any): Promise<void> {
    try {
      const userId = req.user.userId;
      const isOwner = await this.bookService.isBookOwner(id, userId);
  
      if (!isOwner) {
        throw new ForbiddenException("Vous ne pouvez pas supprimer ce livre");
      }
  
      await this.bookService.deleteBook(id);
    } catch (error) {
      console.error('Erreur lors de la suppression du livre :', error);
      throw new BadRequestException('Erreur lors de la suppression du livre');
    }
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

      try {
        const bookToRate = await this.bookService.rateABook(id, userId, rating);
        return bookToRate;
      } catch (err) {
        throw new BadRequestException(err.message);
      }
  }
}

