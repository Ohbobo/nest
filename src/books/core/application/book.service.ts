import { CreateBookDto, UpdatedBookDto } from '../dto/books.dto';
import { Book } from '../interface/book-entities';
import { IBookRepository } from '../repository/book-repository';
import { v4 as uuidv4 } from 'uuid';

export class BookService {
    constructor(private readonly bookRepository: IBookRepository) {}

    async getAllBooks(): Promise<Book[]> {
        return this.bookRepository.findAll();
    }

    async getOneBook(id: string): Promise<Book> {
        return this.bookRepository.findById(id);
    }

    async create(createBookDto: CreateBookDto, userId: string): Promise<Book> {
        const newBook: Book = { 
            id: uuidv4(),
            userId: userId, 
            ...createBookDto, 
        };
        const createdBook = await this.bookRepository.createBook(newBook, userId);
        return createdBook;
    }

    async updateBook(id: string, updatedBookDto: UpdatedBookDto, userId: string): Promise<Book> {
        const findABook = await this.bookRepository.findById(id);
        if(!findABook){
            throw new Error("Ce livre n'existe pas");
        }
        
        const updatedBook = { ...findABook, ...updatedBookDto };
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

    async isBookOwner(id: string, userId: string): Promise<boolean> {
        const book = await this.bookRepository.findById(id);
        if(!book || !book.userId) {
            return false;
        }

        return book.userId === userId;
    }
}