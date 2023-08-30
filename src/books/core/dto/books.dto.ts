import { IsString, IsNotEmpty, IsNumber } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateBookDto {
    @IsString()
    id: string
    // @IsString()
    // title: string
    // @IsString()
    // author: string
    // @IsString()
    // genre: string
    // @IsNumber()
    // date: number
}

export class UpdatedBookDto extends PartialType(CreateBookDto) {}