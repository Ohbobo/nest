import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../auth/adapters/secondary/mongoDB/mongoUserEntity';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}

//'mongodb+srv://agentheo:DpENWosEnRtghWhg@cluster0.5ge86ol.mongodb.net/?retryWrites=true&w=majority'