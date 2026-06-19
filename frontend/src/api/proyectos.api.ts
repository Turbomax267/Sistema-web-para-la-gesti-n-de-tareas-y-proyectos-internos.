import { Proyecto, ProyectoPayload } from '../interfaces/proyecto.interface';
import { getProyectos, getTareas, saveProyectos } from '../lib/mockData';
import { mockResponse } from './mockHelpers';

export async function fetchProyectos() {
  return mockResponse('Proyectos obtenidos correctamente', getProyectos());
}

export async function createProyecto(payload: ProyectoPayload) {
  const proyectos = getProyectos();
  const nuevoProyecto: Proyecto = {
    id_proyecto: proyectos.length > 0 ? Math.max(...proyectos.map((proyecto) => proyecto.id_proyecto)) + 1 : 1,
    ...payload,
  };

  saveProyectos([nuevoProyecto, ...proyectos]);
  return mockResponse('Proyecto creado correctamente', nuevoProyecto);
}

export async function updateProyecto(id: number, payload: ProyectoPayload) {
  const proyectos = getProyectos();
  const proyectoActualizado: Proyecto = {
    id_proyecto: id,
    ...payload,
  };

  saveProyectos(proyectos.map((proyecto) => (proyecto.id_proyecto === id ? proyectoActualizado : proyecto)));
  return mockResponse('Proyecto actualizado correctamente', proyectoActualizado);
}

export async function removeProyecto(id: number) {
  const tareasRelacionadas = getTareas().filter((tarea) => tarea.id_proyecto === id);

  if (tareasRelacionadas.length > 0) {
    throw new Error('No se puede eliminar el proyecto porque tiene tareas asociadas');
  }

  const proyectos = getProyectos();
  saveProyectos(proyectos.filter((proyecto) => proyecto.id_proyecto !== id));
  return mockResponse('Proyecto eliminado correctamente', {});
}
