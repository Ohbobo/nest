import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";

@Schema()
export class Book {
    @Prop({ required: true, unique: true })
    title: string;

    @Prop({ required: true, unique: true })
    author: string;

    @Prop({ required: true, unique: true })
    genre: string;

    @Prop({ required: true, unique: true })
    date: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);