import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Book } from './mongoBookEntity';
import { IBook } from 'src/books/core/interface/book-entities';
import { IBookRepository } from 'src/books/core/repository/book-repository';

@Injectable()
export class MongooseBookRepository implements IBookRepository {
    constructor (@InjectModel('Book') private readonly bookModel: Model<Book>) {}

    async findAll(): Promise<IBook[]> {
        return this.bookModel.find();
    }

    async findById(id: string): Promise<IBook> {
        return this.bookModel.findById(id);
    }

    async createBook(book: IBook, userId: string, imageUrl: string): Promise<IBook> {
        const newBook = new this.bookModel({
            ...book,
            _id: new mongoose.Types.ObjectId(),
            userId,
            imageUrl,
        });
        const savedBook = await newBook.save();
        return savedBook.toJSON() as IBook;
    }
    async updateBook(book: IBook): Promise<IBook | undefined> {
        try {
            const updatedBook = await this.bookModel.findByIdAndUpdate(book._id, book, { new: true }).exec();
    
            if (!updatedBook) {
                throw new Error("Livre introuvable pour la mise à jour");
            }
    
            return updatedBook.toObject() as IBook;
        } catch (error) {
            console.error("Erreur lors de la mise à jour du livre :", error);
            throw error;
        }
    }

    async deleteBook(id: string): Promise<void> {
        await this.bookModel.findByIdAndRemove(id).exec();
    }

    async rateBook(bookId: string, userId: string, grade: number): Promise<IBook | undefined> {
        const book = await this.bookModel.findById(bookId).exec();

        if (!book) {
            return undefined;
        }

        const existingRating = book.ratings.find((rating) => rating.userId === userId);

        if (existingRating) {
            return undefined;
        }

        if (grade < 1 || grade > 5) {
            return undefined;
        }

        book.ratings.push({ userId, grade });

        const totalRating = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
        book.averageRating = totalRating / book.ratings.length;

        const updatedBook = await book.save();
        return updatedBook.toObject() as IBook;
    }
}