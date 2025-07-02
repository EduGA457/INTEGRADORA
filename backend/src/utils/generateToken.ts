import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const generateAccessToken = (user: string) => {
    // Verifica que la variable de entorno exista
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
        throw new Error('JWT_ACCESS_SECRET no está definido en las variables de entorno');
    }

    return jwt.sign(
        { user }, // payload
        secret,   // secret key
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" // expiration
        }
    );
}