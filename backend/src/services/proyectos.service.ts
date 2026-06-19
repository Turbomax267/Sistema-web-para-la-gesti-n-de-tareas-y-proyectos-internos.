import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { mysqlPool } from '../config/mysql';
import { createAppError } from '../middlewares/errorHandler';
import { Proyecto, ProyectoPayload } from '../types/api.types';

export async function listarProyectos(): Promise<Proyecto[]> {
  const [rows] = await mysqlPool.execute<(Proyecto & RowDataPacket)[]>(
    `SELECT id_proyecto, nombre, descripcion, fecha_inicio, fecha_fin, estado, created_at, updated_at
     FROM proyectos
     ORDER BY created_at DESC`,
  );
  return rows;
}

export async function obtenerProyectoPorId(id: number): Promise<Proyecto> {
  const [rows] = await mysqlPool.execute<(Proyecto & RowDataPacket)[]>(
    `SELECT id_proyecto, nombre, descripcion, fecha_inicio, fecha_fin, estado, created_at, updated_at
     FROM proyectos
     WHERE id_proyecto = ?`,
    [id],
  );

  const proyecto = rows[0];
  if (!proyecto) {
    throw createAppError('Proyecto no encontrado', 404);
  }

  return proyecto;
}

export async function crearProyecto(payload: ProyectoPayload): Promise<Proyecto> {
  const [result] = await mysqlPool.execute<ResultSetHeader>(
    `INSERT INTO proyectos (nombre, descripcion, fecha_inicio, fecha_fin, estado)
     VALUES (?, ?, ?, ?, ?)`,
    [
      payload.nombre,
      payload.descripcion || null,
      payload.fecha_inicio,
      payload.fecha_fin || null,
      payload.estado,
    ],
  );

  return obtenerProyectoPorId(result.insertId);
}

export async function actualizarProyecto(id: number, payload: ProyectoPayload): Promise<Proyecto> {
  await obtenerProyectoPorId(id);

  await mysqlPool.execute(
    `UPDATE proyectos
     SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?
     WHERE id_proyecto = ?`,
    [
      payload.nombre,
      payload.descripcion || null,
      payload.fecha_inicio,
      payload.fecha_fin || null,
      payload.estado,
      id,
    ],
  );

  return obtenerProyectoPorId(id);
}

export async function eliminarProyecto(id: number): Promise<void> {
  await obtenerProyectoPorId(id);

  const [rows] = await mysqlPool.execute<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM tareas WHERE id_proyecto = ?',
    [id],
  );

  if (Number(rows[0].total) > 0) {
    throw createAppError('No se puede eliminar el proyecto porque tiene tareas asociadas', 409);
  }

  await mysqlPool.execute('DELETE FROM proyectos WHERE id_proyecto = ?', [id]);
}

export async function validarProyectoExiste(id: number): Promise<void> {
  const [rows] = await mysqlPool.execute<RowDataPacket[]>(
    'SELECT id_proyecto FROM proyectos WHERE id_proyecto = ?',
    [id],
  );

  if (rows.length === 0) {
    throw createAppError('Proyecto inexistente', 404);
  }
}

