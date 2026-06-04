import { Router } from 'express';
import { MaintenanceController } from '../controllers/maintainance.controller.js';
import { authenticate, authorize, validate } from '@tzw/shared';
import { createMaintenanceSchema, updateMaintenanceSchema } from '../validators/maintainance.validator.js';

const router = Router();

router.post('/', authenticate, authorize('ADMIN', 'INSPECTOR'), validate(createMaintenanceSchema), MaintenanceController.create);
router.get('/', authenticate, MaintenanceController.list);
router.get('/:id', authenticate, MaintenanceController.getById);
router.patch('/:id', authenticate, authorize('ADMIN', 'INSPECTOR'), validate(updateMaintenanceSchema), MaintenanceController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), MaintenanceController.remove);

export { router as maintenanceRoutes };