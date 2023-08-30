import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}


export class LoginResponseDto {
    userId: string;
    token: string;
}