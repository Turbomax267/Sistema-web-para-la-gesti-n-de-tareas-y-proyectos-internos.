import { body, param, query } from 'express-validator';

const estadosTarea = ['Pendiente', 'En Proceso', 'En Revisión', 'Finalizado'];
const prioridadesTarea = ['Baja', 'Media', 'Alta'];

export const tareaIdValidator = [
  param('id').isInt({ min: 1 }).withMessage('El id de la tarea debe ser numérico'),
];

export const tareaValidator = [
  body('titulo').trim().notEmpty().withMessage('El título de la tarea es obligatorio'),
  body('descripcion').optional({ values: 'falsy' }).isString().withMessage('La descripción debe ser texto'),
  body('estado').isIn(estadosTarea).withMessage('El estado de la tarea es inválido'),
  body('prioridad').isIn(prioridadesTarea).withMessage('La prioridad de la tarea es inválida'),
  body('fecha_limite')
    .optional({ nullable: true, values: 'falsy' })
    .isISO8601()
    .withMessage('La fecha límite es inválida'),
  body('id_proyecto').isInt({ min: 1 }).withMessage('La tarea debe estar asociada a un proyecto válido'),
  body('id_responsable')
    .optional({ nullable: true })
    .custom((value) => value === null || Number.isInteger(value))
    .withMessage('El responsable es inválido'),
];

export const tareaEstadoValidator = [
  body('estado').isIn(estadosTarea).withMessage('El estado de la tarea es inválido'),
];

export const tareaFilterValidator = [
  query('proyecto').optional().isInt({ min: 1 }).withMessage('El filtro proyecto es inválido'),
  query('responsable').optional().isInt({ min: 1 }).withMessage('El filtro responsable es inválido'),
  query('estado').optional().isIn(estadosTarea).withMessage('El filtro estado es inválido'),
  query('prioridad').optional().isIn(prioridadesTarea).withMessage('El filtro prioridad es inválido'),
];

