// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import mongoose, { Model } from 'mongoose';
// import { Book } from './mongoBookEntity';
// import { IBook } from 'src/books/core/interface/book-entities';
// import { IBookRepository } from 'src/books/core/repository/book-repository';

// @Injectable()
// export class MongooseBookRepository implements IBookRepository {
//     constructor (@InjectModel('Book') private readonly bookModel: Model<Book>) {}

//     async findAll(): Promise<IBook[]> {
//         return this.bookModel.find();
//     }

//     async findById(id: string): Promise<IBook> {
//         return this.bookModel.findById(id)
//     }

//     async createBook(book: IBook, userId: string, imageUrl: string): Promise<IBook> {
//         const newBook = new this.bookModel({
//             ...book,
//             userId,
//             imageUrl,
//         })
//         const savedBook = await newBook.save();
//         return savedBook.toJSON() as IBook;
//     }

//     async updateBook(book: IBook): Promise<IBook> {
//         const updatedBook = await this.bookModel.findByIdAndUpdate(book._id, book, { new: true }).exec();
//         return updatedBook ? updatedBook.toJSON() as IBook : undefined;
//     }

//     async deleteBook(id: string): Promise<void> {
//         await this.bookModel.findByIdAndRemove(id)
//     }
// }