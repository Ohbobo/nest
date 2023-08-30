import { Injectable, Inject } from '@nestjs/common';
import { IAuthRepository } from '../core/repository/auth-repository';
import { UserWithId } from '../core/interface/user-interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SignupUseCase {
    constructor(@Inject('IAuthRepository') private readonly userRepository : IAuthRepository) {}

    async signup(email: string, password: string): Promise<void> {
        const hash = await bcrypt.hash(password, 10);
        const user: UserWithId = {
            email, 
            password: hash,
            userId: ''
        }
        await this.userRepository.createUser(user);
    }
}