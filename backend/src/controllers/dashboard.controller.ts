import { Request, Response, NextFunction } from 'express';
import { obtenerResumenDashboard } from '../services/dashboard.service';

export async function getDashboardResumen(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const resumen = await obtenerResumenDashboard();
    res.status(200).json({
      success: true,
      message: 'Resumen obtenido correctamente',
      data: resumen,
    });
  } catch (error) {
    next(error);
  }
}

