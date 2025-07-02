import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDBMongo = async (): Promise<void> => {
    const mongoUrl = process.env.MONGO_URL;
    
    if (!mongoUrl) {
        throw new Error('MONGO_URL no está definida en .env');
    }

    try {
        await mongoose.connect(mongoUrl);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.log("Error al conectar con MongoDB: ", error);
        process.exit(1);
    }
}

export default connectDBMongo;