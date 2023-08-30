import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user-schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://agentheo:DpENWosEnRtghWhg@cluster0.5ge86ol.mongodb.net/?retryWrites=true&w=majority'),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
