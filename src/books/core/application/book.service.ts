import { CreateBookDto, UpdatedBookDto } from '../dto/books.dto';
import { IBook } from '../interface/book-entities';
import { IBookRepository } from '../repository/book-repository';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

export class BookService {
    constructor(private readonly bookRepository: IBookRepository) {}

    async getAllBooks(): Promise<IBook[]> {
        return this.bookRepository.findAll();
    }

    async getOneBook(id: string): Promise<IBook> {
        return this.bookRepository.findById(id);
    }

    async createBook(createBookDto: CreateBookDto, userId: string, imageUrl: string): Promise<IBook> {
        const newBook: IBook = { 
          _id: uuidv4(),
          userId: userId,
          imageUrl: imageUrl, 
          ...createBookDto, 
        };
        const createdBook = await this.bookRepository.createBook(newBook, userId, imageUrl);
        return createdBook;
      }
      
      async updateBook(id: string, updatedBookDto: UpdatedBookDto, userId: string, newImageUrl: string | undefined): Promise<IBook> {
        const findABookWithId = await this.bookRepository.findById(id);
        if (!findABookWithId) {
          throw new Error("Ce livre n'existe pas");
        }

        if (findABookWithId.imageUrl) {
          const originalImageToDelete = findABookWithId.imageUrl.replace(`${process.env.APP_URL}/images/`, '');
          const resizedImageToDelete = originalImageToDelete.replace('resized_', '');
      
          try {
            fs.unlinkSync(`./images/${originalImageToDelete}`);
            fs.unlinkSync(`./images/${resizedImageToDelete}`);
          } catch (err) {
            console.error("Erreur lors de la suppression des images:", err);
          }
        }
      
        if (newImageUrl) {
          findABookWithId.imageUrl = newImageUrl;
        }
      
        for (const key in updatedBookDto) {
          if (key !== 'image' && updatedBookDto[key] !== undefined) {
            findABookWithId[key] = updatedBookDto[key];
          }
        }
        const updatedBook = await this.bookRepository.updateBook(findABookWithId);
        return updatedBook;
      }

    async deleteBook(id: string): Promise<void> {
        const findABook = await this.bookRepository.findById(id);

        if(!findABook) {
            throw new Error("Ce livre n'existe pas");
        }

        if(findABook.imageUrl){
            const imageToDelete = findABook.imageUrl.replace(`${process.env.APP_URL}/images/`, '');
            fs.unlinkSync(`./images/${imageToDelete}`);

            const baseImageToDelete = imageToDelete.replace('resized_', '');
            fs.unlinkSync(`./images/${baseImageToDelete}`);
        }

        await this.bookRepository.deleteBook(id);
    }

    async isBookOwner(id: string, userId: string): Promise<boolean> {
        const book = await this.bookRepository.findById(id);
        if(!book || !book.userId) {
            return false;
        }

        return book.userId === userId;
    }

    async getBestRating(): Promise<IBook[]> {
        const limit = 3;
        const allBooks = await this.bookRepository.findAll();
        
        const sortedBooks = allBooks.sort((a, b) => b.averageRating - a.averageRating).slice(0, limit);
    
        return sortedBooks;
    }

    async rateABook(id: string, userId: string, grade: number): Promise<IBook> {
        const book = await this.bookRepository.findById(id);
      
        if (!book) {
          throw new Error('Le livre non trouvé');
        }

        if (grade === undefined || grade < 1 || grade > 5) {
          throw new Error('La note doit être entre 1 et 5 étoiles');
        }
      
        const existingRating = book.ratings.find(rating => rating.userId === userId);
      
        if (existingRating) {
          throw new Error('Vous avez déjà noté ce livre');
        }
      
        book.ratings.push({ userId, grade });
      
        const totalRating = book.ratings.reduce((sum, r) => sum + (r.grade || 0), 0);
        book.averageRating = totalRating / book.ratings.length;

        book.averageRating = Math.min(5, Math.max(0.5, book.averageRating));
        book.averageRating = Math.round(book.averageRating * 10) / 10;

        const updatedBook = await this.bookRepository.updateBook(book);
      
        if (!updatedBook) {
          throw new Error('Échec de la mise à jour du livre');
        }
      
        return updatedBook;
      }
}