import { Injectable } from '@nestjs/common';
import { UserWithId } from '../../../core/interface/user-interface';
import { IAuthRepository } from '../../../core/repository/auth-repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InMemoryAuthRepository implements IAuthRepository {
    private readonly users: UserWithId[] = [];

    async createUser(user: UserWithId): Promise<void> {
        const existingUser = await this.getUserByEmail(user.email);
    
        if(existingUser) {
            throw new Error('Cet email existe déjà');
        }
        this.users.push(user);
    }

    async getUserByEmail(email: string): Promise<UserWithId | null> {
        return this.users.find(user => user.email === email) || null;
    }

    // async login(email: string, password: string): Promise<User | null> {
    //     const user = await this.getUserByEmail(email);

    //     if(user && await bcrypt.compare(password, user.password)){
    //         return user;
    //     }
    //     return null;
    // }
}