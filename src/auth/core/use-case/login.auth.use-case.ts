import { IAuthRepository } from '../repository/auth-repository';
import { LoginResponseDto } from '../dto/user.dto';
import { JwtService } from 'src/auth/adapters/middleware/jwt/jwt-service';

export class LoginUseCase {
    constructor(
        private readonly userRepository: IAuthRepository,
        private readonly jwtService: JwtService,
        ) {}

    async login(email: string, password: string): Promise<LoginResponseDto | null> {
        const user = await this.userRepository.getUserByEmail(email);

        if(!user){
            throw new Error('Invalide');
        }

        const passwordMatch = await this.jwtService.comparePassword(password, user.password);

        if(passwordMatch){
            const token = await this.jwtService.createToken({ userId: user.userId });
            return { userId: user.userId, token };
        }
        return null;
    }
    
}