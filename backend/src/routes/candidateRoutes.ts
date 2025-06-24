import { Router } from 'express';
import { addCandidateController, getAllCandidates, getCandidateById } from '../presentation/controllers/candidateController';

const router = Router();

router.post('/', addCandidateController);

// NUEVO: Rutas GET
router.get('/', getAllCandidates);
router.get('/:id', getCandidateById);

export default router;
