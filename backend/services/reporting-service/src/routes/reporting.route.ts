import { Router } from 'express';
import { ReportingController } from '../controllers/reporting.controller.js';
import { authenticate, authorize, validate } from '@tzw/shared';
import {
  dateRangeQuerySchema,
  extinguisherStatsQuerySchema,
  inspectionStatsQuerySchema,
  maintenanceStatsQuerySchema
} from '../validators/reporting.validator.js';

const router = Router();

// All reporting endpoints require authentication; restrict some to admin if you prefer.
router.get(
  '/summary',
  authenticate,
  authorize('ADMIN', 'INSPECTOR'),
  validate(dateRangeQuerySchema),
  ReportingController.summary
);

router.get(
  '/extinguishers',
  authenticate,
  authorize('ADMIN', 'INSPECTOR'),
  validate(extinguisherStatsQuerySchema),
  ReportingController.extinguisherStats
);

router.get(
  '/inspections',
  authenticate,
  authorize('ADMIN', 'INSPECTOR'),
  validate(inspectionStatsQuerySchema),
  ReportingController.inspectionStats
);

router.get(
  '/maintenance',
  authenticate,
  authorize('ADMIN', 'INSPECTOR'),
  validate(maintenanceStatsQuerySchema),
  ReportingController.maintenanceStats
);

export { router as reportingRoutes };