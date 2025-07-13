import { Request, Response } from 'express';
import { SensorReading } from '../models/sensor';


const SensorTypes = {
  AMBIENT_HUMIDITY: 'ambientHumidity',
  AMBIENT_TEMPERATURE: 'ambientTemperature',
  AIR_QUALITY: 'airQuality',
  VOLTAGE: 'voltage',
  SOIL_MOISTURE: 'soilMoisture'
} as const;    //diccionario de tipos de sensores


export const saveSensorReading = async (req: Request, res: Response) => {
  const { deviceId, timestamp, sensors } = req.body;

  // Validación de campos requeridos
  if (!deviceId || !sensors) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters',
      details: {
        required: ['deviceId', 'sensors'],
        received: Object.keys(req.body)
      }
    });
  }

  try {
    // Validación de timestamp (opcional)
    const parsedTimestamp = timestamp ? new Date(timestamp) : new Date();
    if (isNaN(parsedTimestamp.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid timestamp format',
        expectedFormat: 'ISO 8601 (e.g., "2023-07-20T12:00:00Z")'
      });
    }

    // Validación de estructura de sensores
    if (!sensors.ambientHumidity && !sensors.ambientTemperature && 
        !sensors.airQuality && !sensors.soilMoisture) {
      return res.status(400).json({
        success: false,
        error: 'Estructura de sensores inválida',
        expected: 'At least one sensor reading must be provided'
      });
    }

    // Calcular porcentaje de humedad del suelo si solo viene rawValue
    if (sensors.soilMoisture && sensors.soilMoisture.rawValue && !sensors.soilMoisture.percentage) {
      // Mapeo de 0 (muy húmedo) a 4095 (muy seco) a porcentaje 0-100%
      sensors.soilMoisture.percentage = 100 - Math.round((sensors.soilMoisture.rawValue / 4095) * 100);
    }

    // Determinar nivel de riesgo para calidad del aire
    if (sensors.airQuality && sensors.airQuality.value) {
      const aq = sensors.airQuality.value;
      if (aq <= 50) sensors.airQuality.riskLevel = "Bajo";
      else if (aq <= 100) sensors.airQuality.riskLevel = "Moderado";
      else if (aq <= 200) sensors.airQuality.riskLevel = "Alto";
      else sensors.airQuality.riskLevel = "Peligroso";
    }

    // Crear y guardar el documento
    const newReading = new SensorReading({
      deviceId,
      timestamp: parsedTimestamp,
      sensors
    });

    const savedReading = await newReading.save();

    return res.status(201).json({
      success: true,
      message: 'Lectura de sensor guardada correctamente',
      data: {
        id: savedReading._id,
        deviceId: savedReading.deviceId,
        timestamp: savedReading.timestamp,
        sensors: savedReading.sensors
      }
    });

  } catch (error: any) {
    console.error('Error guardando la lectura:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


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