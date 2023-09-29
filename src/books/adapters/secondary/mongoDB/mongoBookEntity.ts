import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";

@Schema()
export class Book {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true, unique: true })
    title: string;

    @Prop({ required: true })
    author: string;
    
    @Prop({ required: true, unique: true })
    imageUrl: string;
    
    @Prop({ required: true })
    year: number;
    
    @Prop({ required: true })
    genre: string;

    @Prop({ required: true })
    ratings: [{
        userId: string;
        grade: number;
    }]

    @Prop({ required: true })
    averageRating: number
}

export const BookSchema = SchemaFactory.createForClass(Book);