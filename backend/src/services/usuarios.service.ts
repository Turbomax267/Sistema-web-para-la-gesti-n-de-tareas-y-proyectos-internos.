import { RowDataPacket } from 'mysql2';
import { mysqlPool } from '../config/mysql';
import { Usuario } from '../types/api.types';
import { createAppError } from '../middlewares/errorHandler';

export async function listarUsuarios(): Promise<Usuario[]> {
  const [rows] = await mysqlPool.execute<(Usuario & RowDataPacket)[]>(
    `SELECT id_usuario, nombre, correo, cargo, created_at, updated_at
     FROM usuarios
     ORDER BY nombre ASC`,
  );

  return rows;
}

export async function obtenerUsuarioPorId(id: number): Promise<Usuario> {
  const [rows] = await mysqlPool.execute<(Usuario & RowDataPacket)[]>(
    `SELECT id_usuario, nombre, correo, cargo, created_at, updated_at
     FROM usuarios
     WHERE id_usuario = ?`,
    [id],
  );

  const usuario = rows[0];
  if (!usuario) {
    throw createAppError('Usuario no encontrado', 404);
  }

  return usuario;
}

