import { Book } from '../core/book-entities';
import { IBookRepository } from '../core/repository/book-repository';

export class BookService {
    constructor(private readonly bookRepository: IBookRepository) {}

    async getAllBooks(): Promise<Book[]> {
        return this.bookRepository.findAll();
    }

    async getOneBook(id: string): Promise<Book> {
        return this.bookRepository.findById(id);
    }

    async create(book: Book): Promise<Book> {
        this.bookRepository.createBook(book);
        return book;
    }
}