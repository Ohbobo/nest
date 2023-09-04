import { CreateBookDto, UpdatedBookDto } from '../core/dto/books.dto';
import { Book } from '../core/interface/book-entities';
import { IBookRepository } from '../core/repository/book-repository';

export class BookService {
    constructor(private readonly bookRepository: IBookRepository) {}

    async getAllBooks(): Promise<Book[]> {
        return this.bookRepository.findAll();
    }

    async getOneBook(id: string): Promise<Book> {
        return this.bookRepository.findById(id);
    }

    async create(createBookDto: CreateBookDto, userId: string): Promise<Book> {
        const book: Book = { ...createBookDto, userId: userId }
        const createdBook = await this.bookRepository.createBook(book, userId);
        return createdBook;
    }

    async updateBook(id: string, updatedBookDto: UpdatedBookDto): Promise<Book | undefined> {
        const findABook = await this.bookRepository.findById(id);
        if(!findABook){
            return undefined;
        }

        const updatedBook = { ...findABook, ...updatedBookDto };
        updatedBook.id = findABook.userId;

        const saveBook = await this.bookRepository.updateBook(updatedBook);
        return saveBook;
    }

    async deleteBook(id: string): Promise<void> {
        const findABook = await this.bookRepository.findById(id);

        if(!findABook) {
            throw new Error("Ce livre n'existe pas");
        }

        await this.bookRepository.deleteBook(id);
    }
}