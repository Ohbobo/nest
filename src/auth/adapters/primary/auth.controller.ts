import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { SignupUseCase } from '../../core/use-case/signup.use-case';
import { LoginUseCase } from '../../core/use-case/login.auth.use-case';
import { CreateUserDto, LoginResponseDto } from '../../core/dto/user.dto';
import { IUser } from 'src/auth/core/interface/user-interface';

@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly signupUseCase: SignupUseCase,
        private readonly loginUseCase: LoginUseCase
        ) {}
    
    @Post('signup')
    async signup(@Body() userDto: CreateUserDto): Promise<IUser> {
        const { email, password } = userDto;
        return await this.signupUseCase.execute(email, password);
    }

    @Post('login')
    async login(@Body() userDto: CreateUserDto): Promise<LoginResponseDto | null> {
        const { email, password } = userDto;
        const user = await this.loginUseCase.execute(email, password);

        if(!user){
            throw new UnauthorizedException('Invalide');
        }
        return user;
    }
    
}