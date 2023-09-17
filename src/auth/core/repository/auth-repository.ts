import { IUser, UserWithId } from "../interface/user-interface";

export interface IAuthRepository {
    getUserByEmail(email: string): Promise<IUser | null>
    createUser(user: IUser): Promise<IUser>
    // login(email: string, password: string): Promise<UserWithId | null>
}