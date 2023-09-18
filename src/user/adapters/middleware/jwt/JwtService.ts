import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './JwtInterface';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtService {
    private readonly jwtSecretKey = process.env.JWT_KEY;

    async createToken(userId: JwtPayload): Promise<string> {
        return jwt.sign(userId, this.jwtSecretKey, { expiresIn: '24h' });
    }

    async checkToken(token: string): Promise<JwtPayload | null> {
        try {
            return jwt.verify(token, this.jwtSecretKey) as JwtPayload;
        } catch (error) {
            return null
        }
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare( password, hash );
    }
}