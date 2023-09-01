import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { SignupUseCase } from '../../core/use-case/signup.use-case';
import { LoginUseCase } from '../../core/use-case/login.auth.use-case';
import { CreateUserDto, LoginResponseDto } from '../../core/dto/user.dto';

@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly signupUseCase: SignupUseCase,
        private readonly loginUseCase: LoginUseCase
        ) {}
    
    @Post('signup')
    async signup(@Body() userDto: CreateUserDto): Promise<void> {
        const { email, password } = userDto;
        await this.signupUseCase.signup(email, password);
    }

    @Post('login')
    async login(@Body() userDto: CreateUserDto): Promise<LoginResponseDto | null> {
        const { email, password } = userDto;
        const user = await this.loginUseCase.login(email, password);

        if(!user){
            throw new UnauthorizedException('Invalide');
        }
        return user;
    }
    
}