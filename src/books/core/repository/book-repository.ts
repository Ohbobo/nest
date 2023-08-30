import { Book } from "../book-entities";

export interface IBookRepository {
    findAll(): Promise<Book[]>;
    findById(id: string): Promise<Book | undefined>;
    createBook(book: Book): Promise<Book>;
}