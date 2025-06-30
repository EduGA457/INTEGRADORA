import { Request, Response } from 'express';
import { Report } from '../models/report';

//  Obtener todos los reportes con filtros opcionales
export const getAllReports = async (req: Request, res: Response) => {
    try {
        const { status, reportType } = req.query;
        const filter: any = {};
        
        if (status) filter.status = status;
        if (reportType) filter.reportType = reportType;
        
        const reports = await Report.find(filter);
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los reportes', error });
    }
};

// Filtrar reportes por id del usuario
export const getReportsByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const reports = await Report.find({ userId });
        
        if (reports.length === 0) {
            return res.status(404).json({ message: 'No se encontraron reportes para este usuario' });
        }
        
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los reportes', error });
    }
};

//  Búsqueda para reportes cercanos a una ubicación
export const getReportsNearLocation = async (req: Request, res: Response) => {
    try {
        const { longitude, latitude, maxDistance = 1000, status, reportType } = req.query;
        
        if (!longitude || !latitude) {
            return res.status(400).json({ message: 'Se requieren longitud y latitud' });
        }

        const filter: any = {
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude as string), parseFloat(latitude as string)]
                    },
                    $maxDistance: parseFloat(maxDistance as string)
                }
            }
        };

        if (status) filter.status = status;
        if (reportType) filter.reportType = reportType;

        const reports = await Report.find(filter);
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error en la búsqueda geoespacial', error });
    }
};

//  Actualizar estado de un reporte
export const updateReportStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status || !['PENDIENTE', 'EN_PROCESO', 'RESUELTO'].includes(status)) {
            return res.status(400).json({ message: 'Estado no válido' });
        }
        const updateData: any = { status };
        if (status === 'RESUELTO') {
            updateData.solutionDate = new Date();
        }
        const updatedReport = await Report.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedReport) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }

        res.status(200).json(updatedReport);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al actualizar el reporte', 
            error: error instanceof Error ? error.message : error 
        });
    }
};

//  Obtener reportes por rango de fechas
export const getReportsByDateRange = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, status, reportType } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Se requieren fechas de inicio y fin' });
        }

        const filter: any = {
            createDate: {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string)
            }
        };

        if (status) filter.status = status;
        if (reportType) filter.reportType = reportType;

        const reports = await Report.find(filter);

        if (reports.length === 0) {
            return res.status(404).json({ message: 'No se encontraron reportes en este rango' });
        }

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener reportes por fecha', error });
    }
};