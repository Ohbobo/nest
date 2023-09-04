import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if(this.protectedRoute(req)){
            const token = req.headers.authorization?.split(' ')[1];
            if(token) {
                try {
                    const decodedToken = jwt.verify(token, 'RANDOM_SECRET_KEY') as { userId: string };
                    req['user'] = { userId: decodedToken.userId };
                } catch (error) {
                    throw new Error(error);
                }
            }
        }
        next()
    }

    private protectedRoute(req: Request): boolean {
        return req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE'
    }
}