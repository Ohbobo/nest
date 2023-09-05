import { IsString, IsNumber, IsOptional } from "class-validator";

export class CreateBookDto {
    @IsString()
    title: string
    @IsString()
    author: string
    @IsString()
    genre: string
    @IsNumber()
    date: number
}

export class UpdatedBookDto {
    @IsOptional()
    @IsString()
    title: string
    @IsString()
    author: string
    @IsString()
    genre: string
    @IsNumber()
    date: number
}