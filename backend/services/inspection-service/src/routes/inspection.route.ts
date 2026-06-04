import { Router } from 'express';
import { InspectionController } from '../controllers/inspection.controller.js';
import { authenticate, authorize, validate } from '@tzw/shared';
import { scheduleInspectionSchema, updateInspectionSchema } from '../validators/inspection.validator.js';

const router = Router();

router.post('/', authenticate, authorize('ADMIN', 'INSPECTOR', 'USER'), validate(scheduleInspectionSchema), InspectionController.schedule);
router.get('/', authenticate, InspectionController.list);
router.get('/:id', authenticate, InspectionController.getById);
router.patch('/:id', authenticate, authorize('ADMIN', 'INSPECTOR'), validate(updateInspectionSchema), InspectionController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), InspectionController.remove);

export { router as inspectionRoutes };