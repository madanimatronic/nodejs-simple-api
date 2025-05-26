import { User } from '@/types/User';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema<User>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  points: { type: Number, required: true },
});

export const UserModel = mongoose.model<User>('User', userSchema, 'users');
