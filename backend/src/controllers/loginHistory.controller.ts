
import { Request, Response } from 'express';
import { LoginHistory } from '../models/loginHistory';

export const getLoginHistory = async (req: Request, res: Response) => {
    try {
        const loginHistory = await LoginHistory.find({}, { _id: 0, __v: 0 })
        .sort({ loginAt: -1 })
        .limit(100)
        .lean();
    
        if (loginHistory.length === 0) {
        return res.status(404).json({ message: 'No se encontró historial de inicio de sesión' });
        }
    
        return res.status(200).json(loginHistory);
    } catch (error) {
        console.error('Error al obtener el historial de inicio de sesión:', error);
        return res.status(500).json({
        error: 'Error interno del servidor'
        });
    }
};

// buscar por ID de usuario
export const getLoginHistoryByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params;      
    if (!userId) {
        return res.status(400).json({ error: 'El parámetro userId es obligatorio' });
    }
    try {
        const loginHistory = await LoginHistory.find({ userId }, { _id: 0, __v: 0 })
        .sort({ loginAt: -1 })
        .limit(100)
        .lean();

        if (loginHistory.length === 0) {
            return res.status(404).json({ message: 'No se encontró historial de inicio de sesión para el usuario especificado' });
        }

        return res.status(200).json(loginHistory);
    } catch (error) {
        console.error('Error al obtener el historial de inicio de sesión por userId:', error);
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }   
}