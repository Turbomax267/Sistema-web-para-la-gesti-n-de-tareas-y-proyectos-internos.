import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { mysqlPool } from '../config/mysql';
import { createAppError } from '../middlewares/errorHandler';
import { obtenerHistorialPorTarea, registrarHistorial } from './historial.service';
import { obtenerUsuarioPorId } from './usuarios.service';
import { validarProyectoExiste } from './proyectos.service';
import { HistorialTarea, Tarea, TareaDetalle, TareaEstado, TareaFilters, TareaPayload } from '../types/api.types';

const CAMPO_LABELS: Record<string, string> = {
  titulo: 'título',
  descripcion: 'descripción',
  estado: 'estado',
  prioridad: 'prioridad',
  fecha_limite: 'fecha límite',
  id_proyecto: 'proyecto asociado',
  id_responsable: 'responsable',
};

async function validarRelacionTarea(payload: TareaPayload): Promise<void> {
  await validarProyectoExiste(payload.id_proyecto);
  if (payload.id_responsable) {
    await obtenerUsuarioPorId(payload.id_responsable);
  }
}

export async function listarTareas(filters: TareaFilters = {}): Promise<TareaDetalle[]> {
  const whereClauses: string[] = [];
  const values: Array<number | string> = [];

  if (filters.proyecto) {
    whereClauses.push('t.id_proyecto = ?');
    values.push(filters.proyecto);
  }

  if (filters.estado) {
    whereClauses.push('t.estado = ?');
    values.push(filters.estado);
  }

  if (filters.prioridad) {
    whereClauses.push('t.prioridad = ?');
    values.push(filters.prioridad);
  }

  if (filters.responsable) {
    whereClauses.push('t.id_responsable = ?');
    values.push(filters.responsable);
  }

  const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const [rows] = await mysqlPool.execute<(TareaDetalle & RowDataPacket)[]>(
    `SELECT
      t.id_tarea,
      t.titulo,
      t.descripcion,
      t.estado,
      t.prioridad,
      t.fecha_limite,
      t.id_proyecto,
      t.id_responsable,
      t.created_at,
      t.updated_at,
      p.nombre AS proyecto,
      u.nombre AS responsable
     FROM tareas t
     INNER JOIN proyectos p ON t.id_proyecto = p.id_proyecto
     LEFT JOIN usuarios u ON t.id_responsable = u.id_usuario
     ${where}
     ORDER BY
      CASE WHEN t.fecha_limite IS NULL THEN 1 ELSE 0 END,
      t.fecha_limite ASC,
      t.created_at DESC`,
    values,
  );

  return rows;
}

export async function obtenerTareaPorId(id: number): Promise<TareaDetalle> {
  const [rows] = await mysqlPool.execute<(TareaDetalle & RowDataPacket)[]>(
    `SELECT
      t.id_tarea,
      t.titulo,
      t.descripcion,
      t.estado,
      t.prioridad,
      t.fecha_limite,
      t.id_proyecto,
      t.id_responsable,
      t.created_at,
      t.updated_at,
      p.nombre AS proyecto,
      u.nombre AS responsable
     FROM tareas t
     INNER JOIN proyectos p ON t.id_proyecto = p.id_proyecto
     LEFT JOIN usuarios u ON t.id_responsable = u.id_usuario
     WHERE t.id_tarea = ?`,
    [id],
  );

  const tarea = rows[0];
  if (!tarea) {
    throw createAppError('Tarea no encontrada', 404);
  }

  return tarea;
}

async function obtenerTareaBasePorId(id: number): Promise<Tarea> {
  const [rows] = await mysqlPool.execute<(Tarea & RowDataPacket)[]>(
    `SELECT id_tarea, titulo, descripcion, estado, prioridad, fecha_limite, id_proyecto, id_responsable, created_at, updated_at
     FROM tareas
     WHERE id_tarea = ?`,
    [id],
  );

  const tarea = rows[0];
  if (!tarea) {
    throw createAppError('Tarea no encontrada', 404);
  }

  return tarea;
}

function buildDescripcionCambio(campo: string, anterior: unknown, nuevo: unknown): string {
  return `Se actualizó el ${CAMPO_LABELS[campo] || campo} de "${String(anterior ?? 'sin valor')}" a "${String(nuevo ?? 'sin valor')}"`;
}

async function registrarCambios(tareaId: number, cambios: HistorialTarea[]): Promise<void> {
  for (const cambio of cambios) {
    await registrarHistorial({ ...cambio, tareaId });
  }
}

export async function crearTarea(payload: TareaPayload): Promise<TareaDetalle> {
  await validarRelacionTarea(payload);

  const [result] = await mysqlPool.execute<ResultSetHeader>(
    `INSERT INTO tareas (titulo, descripcion, estado, prioridad, fecha_limite, id_proyecto, id_responsable)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.titulo,
      payload.descripcion || null,
      payload.estado,
      payload.prioridad,
      payload.fecha_limite || null,
      payload.id_proyecto,
      payload.id_responsable || null,
    ],
  );

  await registrarHistorial({
    tareaId: result.insertId,
    accion: 'CREACION',
    campoModificado: 'tarea',
    valorAnterior: null,
    valorNuevo: payload,
    descripcion: 'Se creó la tarea',
    fecha: new Date(),
  });

  return obtenerTareaPorId(result.insertId);
}

export async function actualizarTarea(id: number, payload: TareaPayload): Promise<TareaDetalle> {
  const tareaActual = await obtenerTareaBasePorId(id);
  await validarRelacionTarea(payload);

  await mysqlPool.execute(
    `UPDATE tareas
     SET titulo = ?, descripcion = ?, estado = ?, prioridad = ?, fecha_limite = ?, id_proyecto = ?, id_responsable = ?
     WHERE id_tarea = ?`,
    [
      payload.titulo,
      payload.descripcion || null,
      payload.estado,
      payload.prioridad,
      payload.fecha_limite || null,
      payload.id_proyecto,
      payload.id_responsable || null,
      id,
    ],
  );

  const cambios: HistorialTarea[] = [];
  const nuevosValores: Record<string, unknown> = {
    titulo: payload.titulo,
    descripcion: payload.descripcion || null,
    estado: payload.estado,
    prioridad: payload.prioridad,
    fecha_limite: payload.fecha_limite || null,
    id_proyecto: payload.id_proyecto,
    id_responsable: payload.id_responsable || null,
  };

  Object.entries(nuevosValores).forEach(([campo, nuevo]) => {
    const anterior = tareaActual[campo as keyof Tarea];
    if (String(anterior ?? '') !== String(nuevo ?? '')) {
      cambios.push({
        tareaId: id,
        accion: campo === 'estado' ? 'CAMBIO_ESTADO' : campo === 'prioridad' ? 'CAMBIO_PRIORIDAD' : 'ACTUALIZACION',
        campoModificado: campo,
        valorAnterior: anterior,
        valorNuevo: nuevo,
        descripcion: buildDescripcionCambio(campo, anterior, nuevo),
        fecha: new Date(),
      });
    }
  });

  if (cambios.length > 0) {
    await registrarCambios(id, cambios);
  }

  return obtenerTareaPorId(id);
}

export async function cambiarEstadoTarea(id: number, estado: TareaEstado): Promise<TareaDetalle> {
  const tareaActual = await obtenerTareaBasePorId(id);

  await mysqlPool.execute('UPDATE tareas SET estado = ? WHERE id_tarea = ?', [estado, id]);

  if (tareaActual.estado !== estado) {
    await registrarHistorial({
      tareaId: id,
      accion: 'CAMBIO_ESTADO',
      campoModificado: 'estado',
      valorAnterior: tareaActual.estado,
      valorNuevo: estado,
      descripcion: buildDescripcionCambio('estado', tareaActual.estado, estado),
      fecha: new Date(),
    });
  }

  return obtenerTareaPorId(id);
}

export async function eliminarTarea(id: number): Promise<void> {
  const tareaActual = await obtenerTareaBasePorId(id);

  await mysqlPool.execute('DELETE FROM tareas WHERE id_tarea = ?', [id]);

  await registrarHistorial({
    tareaId: id,
    accion: 'ELIMINACION',
    campoModificado: 'tarea',
    valorAnterior: tareaActual,
    valorNuevo: null,
    descripcion: 'Se eliminó la tarea',
    fecha: new Date(),
  });
}

export async function listarHistorialTarea(id: number) {
  await obtenerTareaBasePorId(id);
  return obtenerHistorialPorTarea(id);
}

