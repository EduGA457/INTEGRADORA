import {Router} from 'express'
import {getSensorReadingbySensor, getSensorReadingByDeviceId, getAllSensorReadings} from "../controllers/sensor.controller"

const router = Router();


router.get('/', getAllSensorReadings);
router.get('/device/:deviceId', getSensorReadingByDeviceId);
router.get('/readings', getSensorReadingbySensor);
    
export default router;
