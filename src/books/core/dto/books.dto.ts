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
    @IsOptional()
    author: string
    @IsOptional()
    genre: string
    @IsOptional()
    year: number
    @IsOptional()
    ratings: [{
        userId: string,
        grade: number,
    }]
    @IsOptional()
    imageUrl: string
    @IsOptional()
    averageRating: number
}