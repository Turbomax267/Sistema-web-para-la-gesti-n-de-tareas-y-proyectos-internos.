import { Router } from 'express';
import { param } from 'express-validator';
import { getUsuarioById, getUsuarios } from '../controllers/usuarios.controller';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();
const usuarioIdValidator = [param('id').isInt({ min: 1 }).withMessage('El id del usuario debe ser numérico')];

router.get('/', getUsuarios);
router.get('/:id', usuarioIdValidator, validateRequest, getUsuarioById);

export default router;
