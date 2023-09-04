import { UserWithId } from "../interface/user-interface";

export interface IAuthRepository {
    getUserByEmail(email: string): Promise<UserWithId | null>
    createUser(user: UserWithId): Promise<void>
    // login(email: string, password: string): Promise<UserWithId | null>
}