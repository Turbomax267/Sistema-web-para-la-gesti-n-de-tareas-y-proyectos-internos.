import { Schema, model } from 'mongoose';

const historialSchema = new Schema(
  {
    tareaId: { type: Number, required: true },
    accion: { type: String, required: true },
    campoModificado: { type: String, required: true },
    valorAnterior: { type: Schema.Types.Mixed, default: null },
    valorNuevo: { type: Schema.Types.Mixed, default: null },
    descripcion: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
  },
  {
    collection: 'historial_tareas',
    versionKey: false,
  },
);

historialSchema.index({ tareaId: 1, fecha: -1 });

export const HistorialModel = model('HistorialTarea', historialSchema);

