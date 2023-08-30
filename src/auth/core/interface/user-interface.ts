export interface User {
    email: string;
    password: string;
}

export interface UserWithId extends User {
    userId: string;
}