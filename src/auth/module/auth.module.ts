import { Module, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { AuthController } from "../adapters/primary/auth.controller";
import { LoginUseCase } from "../core/use-case/login.auth.use-case";
import { SignupUseCase } from "../core/use-case/signup.use-case";
import { InMemoryAuthRepository } from "../adapters/secondary/inMemory/InMemoryAuth";
import { IAuthRepository } from "../core/repository/auth-repository";
import { MongooseAuthRepository } from "../adapters/secondary/mongoDB/mongoRepository";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/auth/adapters/secondary/mongoDB/mongoUserEntity";
import { JwtService } from "../adapters/middleware/jwt/jwt-service";

@Module({
    controllers: [AuthController], 
    providers: [
        JwtService,
        { 
            provide: APP_PIPE, 
            useClass: ValidationPipe },
        { 
            provide: SignupUseCase,
            useFactory: (repository: IAuthRepository) => new SignupUseCase(repository), inject: ['USER_REPOSITORY']
        },
        { 
            provide: LoginUseCase,
            useFactory: (repository: IAuthRepository) => new LoginUseCase(repository), inject: ['USER_REPOSITORY']
        },
        {
            provide: 'USER_REPOSITORY',
            useClass: MongooseAuthRepository,
        },
    ],
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ],
    exports: [JwtService],
})

export class AuthModule {}