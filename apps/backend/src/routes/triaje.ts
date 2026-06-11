import { Router } from 'express';
import { procesarTriaje } from '../controllers/triajeController';

const router = Router();

/**
 * POST /api/v1/triaje
 * Body: TriajeInput (ver packages/shared/src/validators/triaje.ts)
 * Response: { ok, sessionId, semaforo, imc, timestamp }
 */
router.post('/', procesarTriaje);

export default router;
