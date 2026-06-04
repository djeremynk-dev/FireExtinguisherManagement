import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import {
  authenticate,
  authorize,
  validate
} from '@tzw/shared';
import {
  updateOwnProfileSchema,
  adminUpdateUserSchema,
  listUsersQuerySchema
} from '../validators/user.validator.js';

const router = Router();

// Self-service
router.get('/me', authenticate, UserController.me);
router.patch('/me', authenticate, validate(updateOwnProfileSchema), UserController.updateOwnProfile);

// Admin endpoints
router.get('/', authenticate, authorize('ADMIN'), validate(listUsersQuerySchema), UserController.list);
router.get('/:id', authenticate, authorize('ADMIN'), UserController.getById);
router.patch('/:id', authenticate, authorize('ADMIN'), validate(adminUpdateUserSchema), UserController.adminUpdateUser);
router.delete('/:id', authenticate, authorize('ADMIN'), UserController.remove);

export { router as userRoutes };