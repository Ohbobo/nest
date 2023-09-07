import { Injectable } from '@nestjs/common'
import { IBook } from "../../../core/interface/book-entities";
import { IBookRepository } from "../../../core/repository/book-repository";

@Injectable()
export class InMemoryBook implements IBookRepository {
    private readonly books: IBook[] = [];

    async findAll(): Promise<IBook[]> {
        return this.books;
    }

    async findById(id: string): Promise<IBook | undefined> {
        return this.books.find(book => book.id === id);
    }

    async createBook(book: IBook, userId: string, imageUrl: string): Promise<IBook> {
        const completeBook = { ...book, userId, imageUrl }; 
        this.books.push(book);
        return completeBook;
    }

    async updateBook(book: IBook): Promise<IBook | undefined> {
        const index = this.books.findIndex(b => b.id === book.id);
        if(index === -1) {
            return undefined;
        }

        this.books[index] = book;
        return book;
    }

    async deleteBook(id: string): Promise<void> {
        const index = this.books.findIndex(book => book.id === id);

        if(index !== -1) {
            this.books.splice(index, 1);
        }
    }
}