import { Injectable } from '@nestjs/common'
import { IBook } from "../../../core/interface/book-entities";
import { IBookRepository } from "../../../core/repository/book-repository";

@Injectable()
export class InMemoryBook implements IBookRepository {
    private readonly books: IBook[] = [];

    async findAll(): Promise<IBook[]> {
        return this.books;
    }

    async findById(id: string): Promise<IBook> {
        return this.books.find(book => book._id === id);
    }

    async createBook(book: IBook, userId: string, imageUrl: string): Promise<IBook> {
        const completeBook = { ...book, userId, imageUrl };
        this.books.push(completeBook);
        return completeBook;
    }

    async updateBook(book: IBook): Promise<IBook | undefined> {
        const index = this.books.findIndex(b => b._id === book._id);
        if(index === -1) {
            return undefined;
        }

        this.books[index] = book;
        return book;
    }

    async deleteBook(id: string): Promise<void> {
        const index = this.books.findIndex(book => book._id === id);

        if(index !== -1) {
            this.books.splice(index, 1);
        }
    }

    async getBestRating(limit: number): Promise<IBook[]> {
        const sortedBooks = this.books.sort((a, b) => b.averageRating - a.averageRating);
        const bestRatingBooks = sortedBooks.slice(0, limit);
        return bestRatingBooks;
      }

      async rateBook(bookId: string, userId: string, grade: number): Promise<IBook | undefined> {
        const book = this.books.find((book) => book._id === bookId);
    
        if (!book) {
          return undefined; 
        }
    
        const existingRating = book.ratings.find((rating) => rating.userId === userId);
    
        if (existingRating) {
          return undefined; 
        }
    
        if (grade < 1 || grade > 5) {
          return undefined;
        }
        book.ratings.push({ userId, grade });
    
        const totalRating = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
        book.averageRating = totalRating / book.ratings.length;
    
        return book;
      }
}