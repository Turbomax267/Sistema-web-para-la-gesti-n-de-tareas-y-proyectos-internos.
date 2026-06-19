import { Request, Response, NextFunction } from 'express';
import {
  actualizarTarea,
  cambiarEstadoTarea,
  crearTarea,
  eliminarTarea,
  listarHistorialTarea,
  listarTareas,
  obtenerTareaPorId,
} from '../services/tareas.service';
import { TareaFilters } from '../types/api.types';

export async function getTareas(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const filters: TareaFilters = {
      proyecto: req.query.proyecto ? Number(req.query.proyecto) : undefined,
      estado: req.query.estado as TareaFilters['estado'],
      prioridad: req.query.prioridad as TareaFilters['prioridad'],
      responsable: req.query.responsable ? Number(req.query.responsable) : undefined,
    };

    const tareas = await listarTareas(filters);
    res.status(200).json({
      success: true,
      message: 'Tareas obtenidas correctamente',
      data: tareas,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTareaById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tarea = await obtenerTareaPorId(Number(req.params.id));
    res.status(200).json({
      success: true,
      message: 'Tarea obtenida correctamente',
      data: tarea,
    });
  } catch (error) {
    next(error);
  }
}

export async function postTarea(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tarea = await crearTarea(req.body);
    res.status(201).json({
      success: true,
      message: 'Tarea creada correctamente',
      data: tarea,
    });
  } catch (error) {
    next(error);
  }
}

export async function putTarea(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tarea = await actualizarTarea(Number(req.params.id), req.body);
    res.status(200).json({
      success: true,
      message: 'Tarea actualizada correctamente',
      data: tarea,
    });
  } catch (error) {
    next(error);
  }
}

export async function patchEstadoTarea(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tarea = await cambiarEstadoTarea(Number(req.params.id), req.body.estado);
    res.status(200).json({
      success: true,
      message: 'Estado de la tarea actualizado correctamente',
      data: tarea,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTarea(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await eliminarTarea(Number(req.params.id));
    res.status(200).json({
      success: true,
      message: 'Tarea eliminada correctamente',
      data: {},
    });
  } catch (error) {
    next(error);
  }
}

export async function getHistorialTarea(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const historial = await listarHistorialTarea(Number(req.params.id));
    res.status(200).json({
      success: true,
      message: 'Historial obtenido correctamente',
      data: historial,
    });
  } catch (error) {
    next(error);
  }
}

