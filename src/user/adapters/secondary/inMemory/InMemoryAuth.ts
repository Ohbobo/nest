import { Injectable } from '@nestjs/common';
import { IUser, UserWithId } from '../../../core/interface/UserInterface';
import { IUserRepository } from '../../../core/repository/UserRepository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InMemoryAuthRepository implements IUserRepository {
    private readonly users: IUser[] = [];

    async createUser(user: IUser): Promise<IUser> {
        const existingUser = await this.getUserByEmail(user.email);
    
        if(existingUser) {
            throw new Error('Cet email existe déjà');
        }
        this.users.push(user);
        return user;
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        return this.users.find(user => user.email === email) || null;
    }
}