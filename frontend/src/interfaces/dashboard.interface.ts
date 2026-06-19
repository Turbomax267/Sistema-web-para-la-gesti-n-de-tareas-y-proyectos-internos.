import { Tarea } from './tarea.interface';

export interface DashboardSummary {
  totalProyectos: number;
  proyectosActivos: number;
  totalTareas: number;
  tareasPendientes: number;
  tareasEnProceso: number;
  tareasEnRevision: number;
  tareasFinalizadas: number;
  proximasTareas: Tarea[];
}

