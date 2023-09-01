import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs/internal/Observable';
import { JwtService } from '../jwt/jwt-service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const token = req.headers.authorization;

        if(!token) {
            return false;
        }

        const user = this.jwtService.checkToken(token);
        if(!user) {
            return false;
        }

        req.user = user;
        return true; // accés autorisé
    }
}

