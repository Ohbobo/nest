import { IAuthRepository } from '../repository/auth-repository';
import { LoginResponseDto } from '../dto/user.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export class LoginUseCase {
    constructor(
        private readonly userRepository: IAuthRepository,
        ) {}

    async login(email: string, password: string): Promise<LoginResponseDto | null> {
        const user = await this.userRepository.getUserByEmail(email);

        if(!user){
            throw new Error('Invalide');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(passwordMatch) {
            const token = jwt.sign({ userId: user.userId }, 'RANDOM_SECRET_KEY', { expiresIn: '24h' });
            return { userId: user.userId, token };
        }
        return null;
    }
}