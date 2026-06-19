export interface HistorialItem {
  _id: string;
  tareaId: number;
  accion: string;
  campoModificado: string;
  valorAnterior: unknown;
  valorNuevo: unknown;
  descripcion: string;
  fecha: string;
}

