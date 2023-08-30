import { Module, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { AuthController } from "./auth.controller";
import { LoginUseCase } from "./use-case/login.auth.use-case";
import { SignupUseCase } from "./use-case/signup.use-case";
import { InMemoryAuthRepository } from "./core/inMemory/InMemoryAuth";
import { IAuthRepository } from "./core/repository/auth-repository";
import { MongooseAuthRepository } from "src/database/repository/auth.mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/database/schema/user-schema";

@Module({
    controllers: [AuthController], 
    providers: [
        { provide: APP_PIPE, useClass: ValidationPipe },
        SignupUseCase,
        LoginUseCase,
        {
            provide: 'IAuthRepository',
            useClass: MongooseAuthRepository,
        },
        // { provide: 'InMemoryRepository', useClass: InMemoryAuthRepository },
    ],
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ]
})

export class AuthModule {}