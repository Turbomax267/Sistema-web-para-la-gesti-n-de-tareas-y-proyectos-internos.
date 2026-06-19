import { HistorialItem } from '../interfaces/historial.interface';
import { Proyecto } from '../interfaces/proyecto.interface';
import { Tarea } from '../interfaces/tarea.interface';
import { Usuario } from '../interfaces/usuario.interface';

const STORAGE_KEYS = {
  proyectos: 'gp_proyectos',
  tareas: 'gp_tareas',
  usuarios: 'gp_usuarios',
  historial: 'gp_historial',
};

const defaultUsuarios: Usuario[] = [
  { id_usuario: 1, nombre: 'Ana Torres', correo: 'ana@startup.com', cargo: 'Project Manager' },
  { id_usuario: 2, nombre: 'Luis Rojas', correo: 'luis@startup.com', cargo: 'Backend Developer' },
  { id_usuario: 3, nombre: 'Maria Paredes', correo: 'maria@startup.com', cargo: 'Frontend Developer' },
  { id_usuario: 4, nombre: 'Jorge Salazar', correo: 'jorge@startup.com', cargo: 'QA Analyst' },
  { id_usuario: 5, nombre: 'Camila Diaz', correo: 'camila@startup.com', cargo: 'Product Designer' },
];

const defaultProyectos: Proyecto[] = [
  {
    id_proyecto: 1,
    nombre: 'Portal de clientes',
    descripcion: 'Rediseño del portal de autogestión para clientes.',
    fecha_inicio: '2026-06-01',
    fecha_fin: '2026-08-15',
    estado: 'Activo',
  },
  {
    id_proyecto: 2,
    nombre: 'App de metricas',
    descripcion: 'Tablero analitico para seguimiento de KPIs internos.',
    fecha_inicio: '2026-05-20',
    fecha_fin: '2026-07-30',
    estado: 'Pausado',
  },
  {
    id_proyecto: 3,
    nombre: 'Automatizacion de soporte',
    descripcion: 'Flujo de tickets frecuentes y respuestas automatizadas.',
    fecha_inicio: '2026-06-10',
    fecha_fin: '',
    estado: 'Planificado',
  },
];

const defaultTareas: Tarea[] = [
  {
    id_tarea: 1,
    titulo: 'Definir roadmap del portal',
    descripcion: 'Alinear hitos y entregables con stakeholders.',
    estado: 'En Proceso',
    prioridad: 'Alta',
    fecha_limite: '2026-06-24',
    id_proyecto: 1,
    id_responsable: 1,
    proyecto: 'Portal de clientes',
    responsable: 'Ana Torres',
  },
  {
    id_tarea: 2,
    titulo: 'Implementar API de clientes',
    descripcion: 'Construir endpoints para perfil y facturacion.',
    estado: 'Pendiente',
    prioridad: 'Alta',
    fecha_limite: '2026-06-28',
    id_proyecto: 1,
    id_responsable: 2,
    proyecto: 'Portal de clientes',
    responsable: 'Luis Rojas',
  },
  {
    id_tarea: 3,
    titulo: 'Disenar modulo de reportes',
    descripcion: 'Diseño UI inicial del modulo de reportes.',
    estado: 'En Revisión',
    prioridad: 'Media',
    fecha_limite: '2026-06-25',
    id_proyecto: 2,
    id_responsable: 3,
    proyecto: 'App de metricas',
    responsable: 'Maria Paredes',
  },
  {
    id_tarea: 4,
    titulo: 'Pruebas del tablero KPI',
    descripcion: 'Validar metricas y consistencia de datos.',
    estado: 'Pendiente',
    prioridad: 'Media',
    fecha_limite: '2026-06-27',
    id_proyecto: 2,
    id_responsable: 4,
    proyecto: 'App de metricas',
    responsable: 'Jorge Salazar',
  },
  {
    id_tarea: 5,
    titulo: 'Mapa de tickets frecuentes',
    descripcion: 'Levantamiento de incidencias para automatizacion.',
    estado: 'Finalizado',
    prioridad: 'Baja',
    fecha_limite: '2026-06-10',
    id_proyecto: 3,
    id_responsable: 5,
    proyecto: 'Automatizacion de soporte',
    responsable: 'Camila Diaz',
  },
];

const defaultHistorial: HistorialItem[] = [
  {
    _id: 'h1',
    tareaId: 1,
    accion: 'CREACION',
    campoModificado: 'tarea',
    valorAnterior: null,
    valorNuevo: { titulo: 'Definir roadmap del portal' },
    descripcion: 'Se creó la tarea inicial del proyecto.',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    _id: 'h2',
    tareaId: 1,
    accion: 'CAMBIO_ESTADO',
    campoModificado: 'estado',
    valorAnterior: 'Pendiente',
    valorNuevo: 'En Proceso',
    descripcion: 'La tarea pasó a En Proceso.',
    fecha: new Date().toISOString(),
  },
];

function writeStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function cloneData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function readStorage<T>(key: string, fallback: T, shouldRehydrate?: (value: T) => boolean): T {
  const raw = localStorage.getItem(key);

  if (!raw) {
    const seeded = cloneData(fallback);
    writeStorage(key, seeded);
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw) as T;

    if (shouldRehydrate && shouldRehydrate(parsed)) {
      const seeded = cloneData(fallback);
      writeStorage(key, seeded);
      return seeded;
    }

    return parsed;
  } catch {
    const seeded = cloneData(fallback);
    writeStorage(key, seeded);
    return seeded;
  }
}

function shouldSeedCollection<T>(value: T): boolean {
  return !Array.isArray(value) || value.length === 0;
}

export function initMockData(forceReset = false): void {
  if (forceReset) {
    writeStorage(STORAGE_KEYS.usuarios, cloneData(defaultUsuarios));
    writeStorage(STORAGE_KEYS.proyectos, cloneData(defaultProyectos));
    writeStorage(STORAGE_KEYS.tareas, cloneData(defaultTareas));
    writeStorage(STORAGE_KEYS.historial, cloneData(defaultHistorial));
    return;
  }

  readStorage(STORAGE_KEYS.usuarios, defaultUsuarios, shouldSeedCollection);
  readStorage(STORAGE_KEYS.proyectos, defaultProyectos, shouldSeedCollection);
  readStorage(STORAGE_KEYS.tareas, defaultTareas, shouldSeedCollection);
  readStorage(STORAGE_KEYS.historial, defaultHistorial, shouldSeedCollection);
}

export function getUsuarios(): Usuario[] {
  return readStorage(STORAGE_KEYS.usuarios, defaultUsuarios, shouldSeedCollection);
}

export function getProyectos(): Proyecto[] {
  return readStorage(STORAGE_KEYS.proyectos, defaultProyectos, shouldSeedCollection);
}

export function saveProyectos(proyectos: Proyecto[]): void {
  writeStorage(STORAGE_KEYS.proyectos, proyectos);
}

export function getTareas(): Tarea[] {
  return readStorage(STORAGE_KEYS.tareas, defaultTareas, shouldSeedCollection);
}

export function saveTareas(tareas: Tarea[]): void {
  writeStorage(STORAGE_KEYS.tareas, tareas);
}

export function getHistorial(): HistorialItem[] {
  return readStorage(STORAGE_KEYS.historial, defaultHistorial, shouldSeedCollection);
}

export function saveHistorial(historial: HistorialItem[]): void {
  writeStorage(STORAGE_KEYS.historial, historial);
}

export function resetMockDemo(): void {
  initMockData(true);
}
