import { Schema, model } from 'mongoose';

export interface ISensorReading {
  deviceId: string;
  timestamp: Date;
  sensors: {
    ambientHumidity: {
      value: number;
      unit?: string;
    };
    ambientTemperature: {
      value: number;
      unit?: string;
    };
    airQuality: {
      value: number;
      unit: string;
      riskLevel?: string;
    };
    voltage: {
      value: number;
      unit?: string;
    };
    soilMoisture: {
      rawValue: number;
      percentage: number;
      unit?: string;
    };
  };
}

const sensorReadingSchema = new Schema<ISensorReading>({
  deviceId: { 
    type: String, 
    required: true,
    index: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  sensors: {
    // Humedad ambiental (DHT11)
    ambientHumidity: { 
      value: { 
        type: Number, 
        min: 0, 
        max: 100  
      },
      unit: { 
        type: String, 
        default: "%" 
      }
    },
    // Temperatura ambiental (DHT11)
    ambientTemperature: {
      value: { 
        type: Number,
        min: -40,  
        max: 80
      },
      unit: { 
        type: String, 
        default: "Celsius" 
      }
    },
    // Calidad del aire (MQ-2)
    airQuality: {
      value: { 
        type: Number,
      },
      unit: { 
        type: String, 
        default: "ppm" 
      },
      riskLevel: {  
        type: String,
        enum: ["Bajo", "Moderado", "Alto", "Peligroso"],
        default: "Bajo"
      }
    },
    // Voltaje (ADC del ESP32)
    voltage: {
      value: { 
        type: Number,
      },
      unit: { 
        type: String, 
        default: "V" 
      }
    },
    // Humedad del suelo (FC-28)
    soilMoisture: {
      rawValue: { 
        type: Number,
        min: 0,
        max: 4095  
      },
      percentage: {  
        type: Number,
        min: 0,
        max: 100
      },
      unit: { 
        type: String, 
        default: "%" 
      }
    }
  }
}, {
  autoIndex: true,
  versionKey: false
});


sensorReadingSchema.index({ 
  deviceId: 1, 
  timestamp: -1 
});

export const SensorReading = model<ISensorReading>('SensorReading', sensorReadingSchema,'sensor_readings');