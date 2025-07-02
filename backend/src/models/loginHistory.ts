
import { Document, Schema, model } from 'mongoose';

export interface ILoginHistory {
  userId: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  loginAt: Date;
  success: boolean;
  failureReason: string;
}


const LoginHistorySchema = new Schema<ILoginHistory>({
  userId: { 
    type: String, 
    required: true 
},
  email: { 
    type: String, 
    required: true 
},
  ipAddress: { 
    type: String, 
    required: true 
},
  userAgent: { 
    type: String, 
    required: true 
},
  loginAt: { 
    type: Date, 
    default: Date.now 
},
  success: {
     type: Boolean,
     required: true 
    },
  failureReason: { type: String }
});

export const LoginHistory = model<ILoginHistory>('LoginHistory', LoginHistorySchema, 'login_histories');