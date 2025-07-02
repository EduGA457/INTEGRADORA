import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import sensorRoutes from './routes/sensor.routes';
import reportRoutes from './routes/report.routes';
import connectDBMongo from './config/db';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Usar el puerto de .env 
const PORT = process.env.PORT ;


app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/sensor', sensorRoutes);
app.use('/api/reports', reportRoutes);


connectDBMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
  });
});