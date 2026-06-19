export type ProyectoEstado = 'Planificado' | 'Activo' | 'Pausado' | 'Finalizado';

export interface Proyecto {
  id_proyecto: number;
  nombre: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_fin: string | null;
  estado: ProyectoEstado;
  created_at?: string;
  updated_at?: string;
}

export interface ProyectoPayload {
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: ProyectoEstado;
}

