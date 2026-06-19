export type ProyectoEstado = 'Planificado' | 'Activo' | 'Pausado' | 'Finalizado';
export type TareaEstado = 'Pendiente' | 'En Proceso' | 'En Revisión' | 'Finalizado';
export type TareaPrioridad = 'Baja' | 'Media' | 'Alta';

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: string[];
}

export interface AppError extends Error {
  statusCode?: number;
  details?: string[];
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  cargo: string | null;
  created_at: string;
  updated_at: string;
}

export interface Proyecto {
  id_proyecto: number;
  nombre: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_fin: string | null;
  estado: ProyectoEstado;
  created_at: string;
  updated_at: string;
}

export interface ProyectoPayload {
  nombre: string;
  descripcion?: string | null;
  fecha_inicio: string;
  fecha_fin?: string | null;
  estado: ProyectoEstado;
}

export interface Tarea {
  id_tarea: number;
  titulo: string;
  descripcion: string | null;
  estado: TareaEstado;
  prioridad: TareaPrioridad;
  fecha_limite: string | null;
  id_proyecto: number;
  id_responsable: number | null;
  created_at: string;
  updated_at: string;
}

export interface TareaDetalle extends Tarea {
  proyecto: string;
  responsable: string | null;
}

export interface TareaPayload {
  titulo: string;
  descripcion?: string | null;
  estado: TareaEstado;
  prioridad: TareaPrioridad;
  fecha_limite?: string | null;
  id_proyecto: number;
  id_responsable?: number | null;
}

export interface TareaEstadoPayload {
  estado: TareaEstado;
}

export interface DashboardSummary {
  totalProyectos: number;
  proyectosActivos: number;
  totalTareas: number;
  tareasPendientes: number;
  tareasEnProceso: number;
  tareasEnRevision: number;
  tareasFinalizadas: number;
}

export interface DashboardData extends DashboardSummary {
  proximasTareas: TareaDetalle[];
}

export interface HistorialTarea {
  _id?: string;
  tareaId: number;
  accion: string;
  campoModificado: string;
  valorAnterior: unknown;
  valorNuevo: unknown;
  descripcion: string;
  fecha: Date;
}

export interface TareaFilters {
  proyecto?: number;
  estado?: TareaEstado;
  prioridad?: TareaPrioridad;
  responsable?: number;
}

