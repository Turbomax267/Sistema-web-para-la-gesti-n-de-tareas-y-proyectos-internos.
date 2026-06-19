import { NextFunction, Request, Response } from 'express';
import { AppError } from '../types/api.types';

export function createAppError(message: string, statusCode = 500, details: string[] = []): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(createAppError('Ruta no encontrada', 404));
}

export function errorHandler(
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    errors: error.details || [],
  });
}

