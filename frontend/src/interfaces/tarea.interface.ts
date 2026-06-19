export type TareaEstado = 'Pendiente' | 'En Proceso' | 'En Revisión' | 'Finalizado';
export type TareaPrioridad = 'Baja' | 'Media' | 'Alta';

export interface Tarea {
  id_tarea: number;
  titulo: string;
  descripcion: string | null;
  estado: TareaEstado;
  prioridad: TareaPrioridad;
  fecha_limite: string | null;
  id_proyecto: number;
  id_responsable: number | null;
  proyecto: string;
  responsable: string | null;
}

export interface TareaPayload {
  titulo: string;
  descripcion: string;
  estado: TareaEstado;
  prioridad: TareaPrioridad;
  fecha_limite: string;
  id_proyecto: number;
  id_responsable: number | null;
}

export interface TareaFilters {
  proyecto: string;
  estado: string;
  prioridad: string;
  responsable: string;
}

