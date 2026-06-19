import { Router } from 'express';
import {
  deleteTarea,
  getHistorialTarea,
  getTareaById,
  getTareas,
  patchEstadoTarea,
  postTarea,
  putTarea,
} from '../controllers/tareas.controller';
import { validateRequest } from '../middlewares/validateRequest';
import {
  tareaEstadoValidator,
  tareaFilterValidator,
  tareaIdValidator,
  tareaValidator,
} from '../validators/tarea.validator';

const router = Router();

router.get('/', tareaFilterValidator, validateRequest, getTareas);
router.get('/:id', tareaIdValidator, validateRequest, getTareaById);
router.post('/', tareaValidator, validateRequest, postTarea);
router.put('/:id', [...tareaIdValidator, ...tareaValidator], validateRequest, putTarea);
router.patch('/:id/estado', [...tareaIdValidator, ...tareaEstadoValidator], validateRequest, patchEstadoTarea);
router.delete('/:id', tareaIdValidator, validateRequest, deleteTarea);
router.get('/:id/historial', tareaIdValidator, validateRequest, getHistorialTarea);

export default router;

