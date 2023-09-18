import { IUser, UserWithId } from "../interface/UserInterface";

export interface IUserRepository {
    getUserByEmail(email: string): Promise<IUser | null>
    createUser(user: IUser): Promise<IUser>
}