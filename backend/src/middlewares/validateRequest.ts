import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export function validateRequest(req: Request, res: Response, next: NextFunction): void {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Datos inválidos',
      errors: result.array().map((issue) => issue.msg),
    });
    return;
  }

  next();
}

