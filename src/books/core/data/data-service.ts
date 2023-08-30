import { Injectable } from '@nestjs/common'
import { Book } from "../book-entities";
import { IBookRepository } from "../repository/book-repository";

@Injectable()
export class InMemoryBook implements IBookRepository {
    private readonly books: Book[] = [];

    async findAll(): Promise<Book[]> {
        return this.books;
    }

    async findById(id: string): Promise<Book | undefined> {
        return this.books.find(book => book.id === id);
    }

    async createBook(book: Book): Promise<Book> {
        this.books.push(book);
        return book;
    }
}