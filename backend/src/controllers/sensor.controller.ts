import { Request, Response } from 'express';
import { SensorReading } from '../models/sensor';


const SensorTypes = {
  AMBIENT_HUMIDITY: 'ambientHumidity',
  AMBIENT_TEMPERATURE: 'ambientTemperature',
  AIR_QUALITY: 'airQuality',
  VOLTAGE: 'voltage',
  SOIL_MOISTURE: 'soilMoisture'
} as const;    //diccionario de tipos de sensores

// consulta para obtener lecturas de sensores por tipo
export const getSensorReadingbySensor = async (req: Request, res: Response) => {
  const { sensorType } = req.query;

  if (!sensorType || typeof sensorType !== 'string' || !Object.values(SensorTypes).includes(sensorType as any)) {
    return res.status(400).json({
      error: `Parámetro sensorType inválido. Usa uno de: ${Object.values(SensorTypes).join(', ')}`,
      validSensors: Object.values(SensorTypes)
    });
  }

  try {
    const readings = await SensorReading.find(
      { [`sensors.${sensorType}`]: { $exists: true } }, 
      { 
        deviceId: 1,
        timestamp: 1,
        [`sensors.${sensorType}`]: 1,
        _id: 0 
      }
    )
      .sort({ timestamp: -1 })
      .limit(100)
      .lean(); 
    if (readings.length === 0) {
      return res.status(404).json({ message: 'No se encontraron datos para el sensor especificado' });
    }

    return res.status(200).json(readings);
  } catch (error) {
    console.error('Error al obtener lecturas del sensor:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor'
    });
  }
};

//obtiene todas las lecturas de sensores
export const getAllSensorReadings = async (req: Request, res: Response) => {
  try {
    const readings = await SensorReading.find({}, { _id: 0, __v: 0 })
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();

    if (readings.length === 0) {
      return res.status(404).json({ message: 'No se encontraron lecturas de sensores' });
    }

    return res.status(200).json(readings);
  } catch (error) {
    console.error('Error al obtener todas las lecturas de sensores:', error);
    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};  

//obtiene lecturas de sensores por el ID del dispositivo
export const getSensorReadingByDeviceId = async (req: Request, res: Response) => {
  const { deviceId } = req.params;

  if (!deviceId) {
    return res.status(400).json({ error: 'El parámetro deviceId es obligatorio' });
  }

  try {
    const readings = await SensorReading.find(
      { deviceId },
      { _id: 0, __v: 0 }
    )
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();

    if (readings.length === 0) {
      return res.status(404).json({ message: 'No se encontraron lecturas para el dispositivo especificado' });
    }

    return res.status(200).json(readings);
  } catch (error) {
    console.error('Error al obtener lecturas del sensor por deviceId:', error);
    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
}