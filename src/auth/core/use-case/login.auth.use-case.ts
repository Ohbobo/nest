import { IAuthRepository } from '../repository/auth-repository';
import { LoginResponseDto } from '../dto/user.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export class LoginUseCase {
    constructor(private readonly userRepository: IAuthRepository) { }

    async execute(email: string, password: string): Promise<LoginResponseDto | null> {
        const user = await this.userRepository.getUserByEmail(email);
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!user || !passwordMatch) {
            throw new Error('Invalide');
        }

        // TODO 'RANDOM_SECRET_KEY' comes from some configuration service (.env) 
        // @see https://docs.nestjs.com/techniques/configuration#configuration
        const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY, { expiresIn: '24h' });
        return { userId: user.userId, token };
    }
}