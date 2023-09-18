import { Module, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { AuthController } from "../adapters/primary/UserControllers";
import { LoginUseCase } from "../core/use-case/LoginService";
import { SignupUseCase } from "../core/use-case/SignupService";
import { InMemoryAuthRepository } from "../adapters/secondary/inMemory/InMemoryAuth";
import { IUserRepository } from "../core/repository/UserRepository";
import { MongooseAuthRepository } from "../adapters/secondary/mongoDB/mongoRepository";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../adapters/secondary/mongoDB/mongoUserEntity";
import { JwtService } from "../adapters/middleware/jwt/JwtService";

@Module({
    controllers: [AuthController], 
    providers: [
        JwtService,
        { 
            provide: APP_PIPE, 
            useClass: ValidationPipe },
        { 
            provide: SignupUseCase,
            useFactory: (repository: IUserRepository) => new SignupUseCase(repository), inject: ['USER_REPOSITORY']
        },
        { 
            provide: LoginUseCase,
            useFactory: (repository: IUserRepository) => new LoginUseCase(repository), inject: ['USER_REPOSITORY']
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

export class UserModule {}