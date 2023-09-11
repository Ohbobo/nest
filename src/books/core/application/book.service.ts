import { CreateBookDto, UpdatedBookDto } from '../dto/books.dto';
import { IBook } from '../interface/book-entities';
import { IBookRepository } from '../repository/book-repository';
import { v4 as uuidv4 } from 'uuid';

export class BookService {
    constructor(private readonly bookRepository: IBookRepository) {}

    async getAllBooks(): Promise<IBook[]> {
        return this.bookRepository.findAll();
    }

    async getOneBook(id: string): Promise<IBook> {
        console.log(id);
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

    async updateBook(id: string, updatedBookDto: UpdatedBookDto, userId: string): Promise<IBook> {
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