import { Request, Response, NextFunction } from 'express';
import { listarUsuarios, obtenerUsuarioPorId } from '../services/usuarios.service';

export async function getUsuarios(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const usuarios = await listarUsuarios();
    res.status(200).json({
      success: true,
      message: 'Usuarios obtenidos correctamente',
      data: usuarios,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUsuarioById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const usuario = await obtenerUsuarioPorId(Number(req.params.id));
    res.status(200).json({
      success: true,
      message: 'Usuario obtenido correctamente',
      data: usuario,
    });
  } catch (error) {
    next(error);
  }
}

