import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './mongoUserEntity';
import { IUser, UserWithId } from 'src/user/core/interface/UserInterface';
import { IUserRepository } from 'src/user/core/repository/UserRepository';

@Injectable()
export class MongooseAuthRepository implements IUserRepository {
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

    async createUser(user: IUser): Promise<IUser> {
        return await this.userModel.create(user);
    }
}