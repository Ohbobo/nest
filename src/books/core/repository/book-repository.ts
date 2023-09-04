import { Book } from "../interface/book-entities";

export interface IBookRepository {
    findAll(): Promise<Book[]>;
    findById(id: string): Promise<Book | undefined>;
    createBook(book: Book, userId: string): Promise<Book>;
    updateBook(book: Book): Promise<Book | undefined>;
    deleteBook(id: string): Promise<void>;
}