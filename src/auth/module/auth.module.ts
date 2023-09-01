import { Module, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { AuthController } from "../adapters/primary/auth.controller";
import { LoginUseCase } from "../core/use-case/login.auth.use-case";
import { SignupUseCase } from "../core/use-case/signup.use-case";
import { InMemoryAuthRepository } from "../inMemory/InMemoryAuth";
import { IAuthRepository } from "../core/repository/auth-repository";
import { MongooseAuthRepository } from "src/database/repository/auth.mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/database/schema/user-schema";
import { JwtService } from "../adapters/middleware/jwt/jwt-service";

@Module({
    controllers: [AuthController], 
    providers: [
        { 
            provide: APP_PIPE, 
            useClass: ValidationPipe },
        { 
            provide: SignupUseCase,
            useFactory: (repository: IAuthRepository) => new SignupUseCase(repository), inject: ['USER_REPOSITORY']
        },
        { 
            provide: LoginUseCase,
            useFactory: (repository: IAuthRepository, jwtService: JwtService) => new LoginUseCase(repository, jwtService), inject: ['USER_REPOSITORY']
        },
        {
            provide: 'USER_REPOSITORY',
            useClass: MongooseAuthRepository,
        },
    ],
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ]
})

export class AuthModule {}