import * as mongoose from 'mongoose';


export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async (): Promise<typeof mongoose> =>
            await mongoose.connect('mongodb+srv://agentheo:DpENWosEnRtghWhg@cluster0.5ge86ol.mongodb.net/?retryWrites=true&w=majority'), 
    },
]
