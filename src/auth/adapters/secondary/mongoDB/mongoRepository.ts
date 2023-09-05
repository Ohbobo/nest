import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './mongoUserEntity';
import { UserWithId } from 'src/auth/core/interface/user-interface';
import { IAuthRepository } from 'src/auth/core/repository/auth-repository';

@Injectable()
export class MongooseAuthRepository implements IAuthRepository {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async getUserByEmail(email: string): Promise<UserWithId | null> {
        const user = await this.userModel.findOne({ email }).exec();
        if (user) {
            return {
                userId: user._id.toString(),
                email: user.email,
                password: user.password,
            };
        }
        return null;
    }

    async createUser(user: UserWithId): Promise<void> {
        await this.userModel.create(user);
    }
}