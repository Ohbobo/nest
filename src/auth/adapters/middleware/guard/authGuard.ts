import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Observable } from 'rxjs/internal/Observable';
import { JwtService } from '../jwt/jwt-service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(JwtService)
        private readonly jwtService: JwtService
    ) { }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers['authorization']?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    async canActivate(context: ExecutionContext,): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(req);

        if (!token) {
            return false;
        }

        const user = await this.jwtService.checkToken(token);

        if (!user) {
            return false;
        }

        req.user = user;

        return true; // accés autorisé
    }
}

