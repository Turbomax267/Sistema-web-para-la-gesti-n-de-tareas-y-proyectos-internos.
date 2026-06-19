import { RowDataPacket } from 'mysql2';
import { mysqlPool } from '../config/mysql';
import { DashboardData, DashboardSummary, TareaDetalle } from '../types/api.types';

export async function obtenerResumenDashboard(): Promise<DashboardData> {
  const [summaryRows] = await mysqlPool.execute<(DashboardSummary & RowDataPacket)[]>(
    `SELECT
      (SELECT COUNT(*) FROM proyectos) AS totalProyectos,
      (SELECT COUNT(*) FROM proyectos WHERE estado = 'Activo') AS proyectosActivos,
      (SELECT COUNT(*) FROM tareas) AS totalTareas,
      (SELECT COUNT(*) FROM tareas WHERE estado = 'Pendiente') AS tareasPendientes,
      (SELECT COUNT(*) FROM tareas WHERE estado = 'En Proceso') AS tareasEnProceso,
      (SELECT COUNT(*) FROM tareas WHERE estado = 'En Revisión') AS tareasEnRevision,
      (SELECT COUNT(*) FROM tareas WHERE estado = 'Finalizado') AS tareasFinalizadas`,
  );

  const [upcomingRows] = await mysqlPool.execute<(TareaDetalle & RowDataPacket)[]>(
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
     WHERE t.fecha_limite IS NOT NULL
     ORDER BY t.fecha_limite ASC
     LIMIT 5`,
  );

  return {
    ...summaryRows[0],
    proximasTareas: upcomingRows,
  };
}

