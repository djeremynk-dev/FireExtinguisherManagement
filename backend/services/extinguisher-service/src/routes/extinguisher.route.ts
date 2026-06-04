import { Router } from 'express';
import { ExtinguisherController } from '../controllers/extinguisher.controller.js';
import { authenticate, authorize, validate } from '@tzw/shared';
import { createExtinguisherSchema, updateExtinguisherSchema } from '../validators/extinguisher.validator.js';

const router = Router();

router.post('/', authenticate, authorize('ADMIN', 'INSPECTOR'), validate(createExtinguisherSchema), ExtinguisherController.create);
router.get('/', authenticate, ExtinguisherController.list);
router.get('/:id', authenticate, ExtinguisherController.getById);
router.patch('/:id', authenticate, authorize('ADMIN', 'INSPECTOR'), validate(updateExtinguisherSchema), ExtinguisherController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), ExtinguisherController.remove);

export { router as extinguisherRoutes };