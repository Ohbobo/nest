import { Injectable } from '@nestjs/common'
import { Book } from "../../../core/interface/book-entities";
import { IBookRepository } from "../../../core/repository/book-repository";

@Injectable()
export class InMemoryBook implements IBookRepository {
    private readonly books: Book[] = [];

    async findAll(): Promise<Book[]> {
        return this.books;
    }

    async findById(id: string): Promise<Book | undefined> {
        return this.books.find(book => book.id === id);
    }

    async createBook(book: Book, userId: string): Promise<Book> {
        const completeBook = { ...book, userId }; 
        this.books.push(book);
        return completeBook;
    }

    async updateBook(book: Book): Promise<Book | undefined> {
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