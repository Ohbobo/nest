import { IUserRepository } from '../repository/UserRepository';
import { IUser } from '../interface/UserInterface';
import * as bcrypt from 'bcrypt';

export class SignupUseCase {
    constructor(private readonly userRepository : IUserRepository) {}

    async execute(email: string, password: string): Promise<IUser> {
        const hash = await bcrypt.hash(password, 10);
        const user: IUser = {
            email, 
            password: hash,
        }
        return await this.userRepository.createUser(user);
    }
}