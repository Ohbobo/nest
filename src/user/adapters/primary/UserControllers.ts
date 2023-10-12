import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { SignupUseCase } from '../../core/use-case/SignupService';
import { LoginUseCase } from '../../core/use-case/LoginService';
import { CreateUserDto, LoginResponseDto } from '../../core/dto/UserDto';
import { IUser } from 'src/user/core/interface/UserInterface';

@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly signupUseCase: SignupUseCase,
        private readonly loginUseCase: LoginUseCase
        ) {}
    
    @Post('signup')
    async signup(@Body() userDto: CreateUserDto): Promise<IUser> {
        try {
            const { email, password } = userDto;
            return await this.signupUseCase.execute(email, password);
        } catch (error) {
            throw new Error('Erreur lors de l\'inscription : ' + error.message);
        }

    }

    @Post('login')
    async login(@Body() userDto: CreateUserDto): Promise<LoginResponseDto | null> {
        try {
            const { email, password } = userDto;
            const user = await this.loginUseCase.execute(email, password);
            if(!user){
                throw new UnauthorizedException('Invalide');
            }
            return user;
        } catch (error) {
            throw new Error('Erreur lors de la connexion : ' + error.message);
        }
    }
    
}