import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export async function connectMongoDB(): Promise<void> {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/gestor_proyectos';
  await mongoose.connect(mongoUri);
}

