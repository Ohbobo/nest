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
}