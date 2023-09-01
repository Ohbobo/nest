import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateBookDto {
    @IsString()
    userId: string
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
    @IsString()
    id: string
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