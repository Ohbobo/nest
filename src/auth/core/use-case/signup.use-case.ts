import { IAuthRepository } from '../repository/auth-repository';
import { UserWithId } from '../interface/user-interface';
import * as bcrypt from 'bcrypt';

export class SignupUseCase {
    constructor(private readonly userRepository : IAuthRepository) {}

    async execute(email: string, password: string): Promise<void> {
        const hash = await bcrypt.hash(password, 10);
        const user: UserWithId = {
            email, 
            password: hash,
            userId: ''
        }
        await this.userRepository.createUser(user);
    }
}