import { Injectable } from '@nestjs/common'
import { Book } from "../core/interface/book-entities";
import { IBookRepository } from "../core/repository/book-repository";

@Injectable()
export class InMemoryBook implements IBookRepository {
    private readonly books: Book[] = [];

    async findAll(): Promise<Book[]> {
        return this.books;
    }

    async findById(id: string): Promise<Book | undefined> {
        return this.books.find(book => book.userId === id);
    }

    async createBook(book: Book): Promise<Book> {
        this.books.push(book);
        return book;
    }

    async updateBook(book: Book): Promise<Book | undefined> {
        const index = this.books.findIndex(b => b.userId === book.userId);
        if(index === -1) {
            return undefined;
        }

        this.books[index] = book;
        return book;
    }

    async deleteBook(id: string): Promise<void> {
        const index = this.books.findIndex(book => book.userId === id);

        if(index !== -1) {
            this.books.splice(index, 1);
        }
    }
}