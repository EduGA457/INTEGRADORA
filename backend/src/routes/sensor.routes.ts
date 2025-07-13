import {Router} from 'express'
import {getSensorReadingbySensor, getSensorReadingByDeviceId, getAllSensorReadings, saveSensorReading} from "../controllers/sensor.controller"

const router = Router();


router.get('/', getAllSensorReadings);
router.get('/device/:deviceId', getSensorReadingByDeviceId);
router.get('/readings', getSensorReadingbySensor);
router.post('/save', saveSensorReading);
    
export default router;
