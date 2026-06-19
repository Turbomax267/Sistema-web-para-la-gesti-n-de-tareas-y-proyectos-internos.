import { body, param } from 'express-validator';

const estadosProyecto = ['Planificado', 'Activo', 'Pausado', 'Finalizado'];

export const proyectoIdValidator = [
  param('id').isInt({ min: 1 }).withMessage('El id del proyecto debe ser numérico'),
];

export const proyectoValidator = [
  body('nombre').trim().notEmpty().withMessage('El nombre del proyecto es obligatorio'),
  body('descripcion').optional({ values: 'falsy' }).isString().withMessage('La descripción debe ser texto'),
  body('fecha_inicio').isISO8601().withMessage('La fecha de inicio es inválida'),
  body('fecha_fin')
    .optional({ nullable: true, values: 'falsy' })
    .isISO8601()
    .withMessage('La fecha de fin es inválida'),
  body('estado').isIn(estadosProyecto).withMessage('El estado del proyecto es inválido'),
  body().custom((value) => {
    if (value.fecha_fin && value.fecha_inicio && new Date(value.fecha_fin) < new Date(value.fecha_inicio)) {
      throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
    }
    return true;
  }),
];

