import { IBook } from "../interface/book-entities";

export interface IBookRepository {
    findAll(): Promise<IBook[]>;
    findById(id: string): Promise<IBook>;
    createBook(book: IBook, userId: string, imageUrl: string): Promise<IBook>;
    updateBook(book: IBook): Promise<IBook | undefined>;
    deleteBook(id: string): Promise<void>;
}