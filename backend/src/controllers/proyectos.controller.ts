import { Request, Response, NextFunction } from 'express';
import {
  actualizarProyecto,
  crearProyecto,
  eliminarProyecto,
  listarProyectos,
  obtenerProyectoPorId,
} from '../services/proyectos.service';

export async function getProyectos(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const proyectos = await listarProyectos();
    res.status(200).json({
      success: true,
      message: 'Proyectos obtenidos correctamente',
      data: proyectos,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProyectoById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const proyecto = await obtenerProyectoPorId(Number(req.params.id));
    res.status(200).json({
      success: true,
      message: 'Proyecto obtenido correctamente',
      data: proyecto,
    });
  } catch (error) {
    next(error);
  }
}

export async function postProyecto(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const proyecto = await crearProyecto(req.body);
    res.status(201).json({
      success: true,
      message: 'Proyecto creado correctamente',
      data: proyecto,
    });
  } catch (error) {
    next(error);
  }
}

export async function putProyecto(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const proyecto = await actualizarProyecto(Number(req.params.id), req.body);
    res.status(200).json({
      success: true,
      message: 'Proyecto actualizado correctamente',
      data: proyecto,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProyecto(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await eliminarProyecto(Number(req.params.id));
    res.status(200).json({
      success: true,
      message: 'Proyecto eliminado correctamente',
      data: {},
    });
  } catch (error) {
    next(error);
  }
}

