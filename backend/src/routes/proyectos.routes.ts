import { Router } from 'express';
import {
  deleteProyecto,
  getProyectoById,
  getProyectos,
  postProyecto,
  putProyecto,
} from '../controllers/proyectos.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { proyectoIdValidator, proyectoValidator } from '../validators/proyecto.validator';

const router = Router();

router.get('/', getProyectos);
router.get('/:id', proyectoIdValidator, validateRequest, getProyectoById);
router.post('/', proyectoValidator, validateRequest, postProyecto);
router.put('/:id', [...proyectoIdValidator, ...proyectoValidator], validateRequest, putProyecto);
router.delete('/:id', proyectoIdValidator, validateRequest, deleteProyecto);

export default router;

