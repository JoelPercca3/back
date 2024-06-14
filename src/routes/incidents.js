import { Router } from 'express';
import { getIncidents, getIncidentById, createIncident, updateIncident, deleteIncident } from '../controllers/incidentsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getIncidents);
router.get('/:id', authenticateToken, getIncidentById);
router.post('/', authenticateToken, createIncident);
router.put('/:id', authenticateToken, updateIncident);
router.delete('/:id', authenticateToken, deleteIncident);

export default router;
