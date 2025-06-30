import express from 'express'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes'
import sensorRoutes from './routes/sensor.routes'
import reportRoutes from './routes/report.routes'
import connectDBMongo from './config/db';
import cors from 'cors';


const app = express();    //declarando un objeto del servidor

const PORT = 4000;   //numero de puerto (tiene que estar disponibles)

app.use(express.json())     //request de tipo json
app.use(morgan('dev'));     //agraga logs de peticiones
app.use(cors());


//ruta principal
app.use('/api/auth', authRoutes);

//rutas de los para modulos
app.use('/api/sensor', sensorRoutes)
app.use('/api/reports', reportRoutes); 

connectDBMongo().then(() => {
    app.listen(PORT,()=>{
    console.log(`El servidor esta corriendo en el puerto: ${PORT}`);
});
});

