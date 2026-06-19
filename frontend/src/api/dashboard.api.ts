import { getProyectos, getTareas } from '../lib/mockData';
import { mockResponse } from './mockHelpers';

export async function fetchDashboard() {
  const tareas = getTareas();
  const proyectos = getProyectos();

  return mockResponse('Resumen obtenido correctamente', {
    totalProyectos: proyectos.length,
    proyectosActivos: proyectos.filter((proyecto) => proyecto.estado === 'Activo').length,
    totalTareas: tareas.length,
    tareasPendientes: tareas.filter((tarea) => tarea.estado === 'Pendiente').length,
    tareasEnProceso: tareas.filter((tarea) => tarea.estado === 'En Proceso').length,
    tareasEnRevision: tareas.filter((tarea) => tarea.estado === 'En Revisión').length,
    tareasFinalizadas: tareas.filter((tarea) => tarea.estado === 'Finalizado').length,
    proximasTareas: [...tareas]
      .filter((tarea) => Boolean(tarea.fecha_limite))
      .sort((left, right) => String(left.fecha_limite).localeCompare(String(right.fecha_limite)))
      .slice(0, 5),
  });
}
