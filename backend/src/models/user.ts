import { model, Schema, Document, Types } from "mongoose";
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    _id: Types.ObjectId;
    username: string;
    password: string;
    email: string;
    phone: string;
    role: string;
    status: boolean;
    createDate: Date;
    deleteDate: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    name: { 
        type: String, 
        required: true 
    },
    username: { 
        type: String, 
        required: true,
        unique: true 
    },
    password: { 
        type: String, 
        required: true,
        select: false 
    },
    email: { 
        type: String, 
        required: true,
        unique: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },
    status: { 
        type: Boolean, 
        default: true 
    },
    createDate: {
        type: Date,
        default: () => new Date()
    },
    deleteDate: {
        type: Date
    }
}, {
    timestamps: true,
    versionKey: false 
});

userSchema.pre<IUser>('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>('User', userSchema, 'user');



