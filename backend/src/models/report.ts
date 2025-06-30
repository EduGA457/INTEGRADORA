import { model, Schema, Document } from 'mongoose';

export interface IReport extends Document {
    userId: string;
    timestamp: Date;
    reportType: string;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    data: {
        [key: string]: any;
    };
    status: string;
    createDate: Date;
    solutionDate: Date;
}

const reportSchema = new Schema<IReport>({
    userId: {
        type: String,
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    reportType: {
        type: String,
        required: true,
        enum: ['URGENTE', 'Comun'],
        default: 'Comun'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: (val: number[]) => val.length === 2, // Validación para asegurarse de que las coordenadas son un array de dos números
            }
        }
    },
    data: {
        type: Schema.Types.Mixed,
        required: true,
        default: {}
    },
    status:{
        type: String,
        required: true,
        enum: ['PENDIENTE', 'EN_PROCESO', 'RESUELTO'],
        default: 'PENDIENTE'
    },
    createDate: {
        type: Date,
        default: () => new Date()
    },
    solutionDate: {
        type: Date,
        default: null 
    }
});

// Índice para que fincione como geolocalizacion 
reportSchema.index({ location: '2dsphere' });

export const Report = model<IReport>('Report', reportSchema, 'report');
