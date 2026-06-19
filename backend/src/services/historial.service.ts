import { HistorialModel } from '../models/historial.model';
import { HistorialTarea } from '../types/api.types';

export async function registrarHistorial(payload: HistorialTarea): Promise<void> {
  await HistorialModel.create(payload);
}

export async function obtenerHistorialPorTarea(tareaId: number) {
  return HistorialModel.find({ tareaId }).sort({ fecha: -1 }).lean();
}

