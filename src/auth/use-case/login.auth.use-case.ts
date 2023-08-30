import { Inject, Injectable } from '@nestjs/common';
import { User } from '../core/interface/user-interface';
import { IAuthRepository } from '../core/repository/auth-repository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginResponseDto } from '../core/dto/user.dto';

@Injectable()
export class LoginUseCase {
    constructor(@Inject('IAuthRepository') private readonly userRepository : IAuthRepository) {}

    async login(email: string, password: string): Promise<LoginResponseDto | null> {
        const user = await this.userRepository.getUserByEmail(email);

        if(!user){
            throw new Error('Invalide');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(passwordMatch){
            const token = jwt.sign({ userId: user.userId }, 'RANDOM_SECRET_KEY', { expiresIn: '24h'});
            return { userId: user.userId, token };
        }
        return null;
    }
    
}