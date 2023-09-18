export interface IUser {
    email: string;
    password: string;
    userId?: string;
}

export interface UserWithId extends IUser {
    userId: string;
}