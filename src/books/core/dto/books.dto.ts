import { IsString, IsNumber, IsOptional } from "class-validator";

export class CreateBookDto {
    title: string
    author: string
    genre: string
    year: number
    ratings: [{
        userId: string,
        grade: number,
    }]
    imageUrl: string
    averageRating: number
}

export class UpdatedBookDto {
    @IsOptional()

    title: string

    author: string

    genre: string

    year: number
    ratings: [{
        userId: string,
        grade: number,
    }]
    imageUrl: string
    averageRating: number
}