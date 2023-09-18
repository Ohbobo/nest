import { IUserRepository } from '../repository/UserRepository';
import { LoginResponseDto } from '../dto/UserDto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

export class LoginUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(email: string, password: string): Promise<LoginResponseDto | null> {
        const user = await this.userRepository.getUserByEmail(email);
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!user || !passwordMatch) {
            throw new Error('Invalide');
        }
        
        const token = jwt.sign({ userId: user.userId }, process.env.JWT_KEY, { expiresIn: '24h' });
        return { userId: user.userId, token };
    }
}