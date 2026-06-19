import { HistorialItem } from '../interfaces/historial.interface';
import { Tarea, TareaEstado, TareaFilters, TareaPayload } from '../interfaces/tarea.interface';
import { getHistorial, getProyectos, getTareas, getUsuarios, saveHistorial, saveTareas } from '../lib/mockData';
import { mockResponse } from './mockHelpers';

function enrichTarea(payload: TareaPayload, id: number): Tarea {
  const proyecto = getProyectos().find((item) => item.id_proyecto === payload.id_proyecto);
  const usuario = getUsuarios().find((item) => item.id_usuario === payload.id_responsable);

  return {
    id_tarea: id,
    ...payload,
    proyecto: proyecto?.nombre || 'Sin proyecto',
    responsable: usuario?.nombre || null,
  };
}

function registrarHistorial(item: HistorialItem): void {
  const historial = getHistorial();
  saveHistorial([item, ...historial]);
}

export async function fetchTareas(filters?: Partial<TareaFilters>) {
  let tareas = getTareas();

  if (filters?.proyecto) {
    tareas = tareas.filter((tarea) => String(tarea.id_proyecto) === filters.proyecto);
  }

  if (filters?.estado) {
    tareas = tareas.filter((tarea) => tarea.estado === filters.estado);
  }

  if (filters?.prioridad) {
    tareas = tareas.filter((tarea) => tarea.prioridad === filters.prioridad);
  }

  if (filters?.responsable) {
    tareas = tareas.filter((tarea) => String(tarea.id_responsable ?? '') === filters.responsable);
  }

  return mockResponse('Tareas obtenidas correctamente', tareas);
}

export async function createTarea(payload: TareaPayload) {
  const tareas = getTareas();
  const nextId = tareas.length > 0 ? Math.max(...tareas.map((tarea) => tarea.id_tarea)) + 1 : 1;
  const nuevaTarea = enrichTarea(payload, nextId);

  saveTareas([nuevaTarea, ...tareas]);

  registrarHistorial({
    _id: `h-${Date.now()}`,
    tareaId: nuevaTarea.id_tarea,
    accion: 'CREACION',
    campoModificado: 'tarea',
    valorAnterior: null,
    valorNuevo: nuevaTarea,
    descripcion: 'Se creó la tarea correctamente.',
    fecha: new Date().toISOString(),
  });

  return mockResponse('Tarea creada correctamente', nuevaTarea);
}

export async function updateTarea(id: number, payload: TareaPayload) {
  const tareas = getTareas();
  const tareaAnterior = tareas.find((tarea) => tarea.id_tarea === id);
  const tareaActualizada = enrichTarea(payload, id);

  saveTareas(tareas.map((tarea) => (tarea.id_tarea === id ? tareaActualizada : tarea)));

  registrarHistorial({
    _id: `h-${Date.now()}`,
    tareaId: id,
    accion: 'ACTUALIZACION',
    campoModificado: 'tarea',
    valorAnterior: tareaAnterior || null,
    valorNuevo: tareaActualizada,
    descripcion: 'Se actualizaron los datos de la tarea.',
    fecha: new Date().toISOString(),
  });

  return mockResponse('Tarea actualizada correctamente', tareaActualizada);
}

export async function patchEstadoTarea(id: number, estado: TareaEstado) {
  const tareas = getTareas();
  const tareaAnterior = tareas.find((tarea) => tarea.id_tarea === id);

  if (!tareaAnterior) {
    throw new Error('No se encontró la tarea solicitada');
  }

  const tareaActualizada: Tarea = {
    ...tareaAnterior,
    estado,
  };

  saveTareas(tareas.map((tarea) => (tarea.id_tarea === id ? tareaActualizada : tarea)));

  registrarHistorial({
    _id: `h-${Date.now()}`,
    tareaId: id,
    accion: 'CAMBIO_ESTADO',
    campoModificado: 'estado',
    valorAnterior: tareaAnterior.estado,
    valorNuevo: estado,
    descripcion: `La tarea cambió a ${estado}.`,
    fecha: new Date().toISOString(),
  });

  return mockResponse('Estado de la tarea actualizado correctamente', tareaActualizada);
}

export async function removeTarea(id: number) {
  const tareas = getTareas();
  const tareaAnterior = tareas.find((tarea) => tarea.id_tarea === id);
  saveTareas(tareas.filter((tarea) => tarea.id_tarea !== id));

  if (tareaAnterior) {
    registrarHistorial({
      _id: `h-${Date.now()}`,
      tareaId: id,
      accion: 'ELIMINACION',
      campoModificado: 'tarea',
      valorAnterior: tareaAnterior,
      valorNuevo: null,
      descripcion: 'Se eliminó la tarea seleccionada.',
      fecha: new Date().toISOString(),
    });
  }

  return mockResponse('Tarea eliminada correctamente', {});
}

export async function fetchHistorialTarea(id: number) {
  return mockResponse(
    'Historial obtenido correctamente',
    getHistorial().filter((item) => item.tareaId === id),
  );
}
