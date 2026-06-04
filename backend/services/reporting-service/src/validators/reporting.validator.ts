import { z } from 'zod';

export const dateRangeQuerySchema = z.object({
  query: z.object({
    from: z.string().optional(), // ISO date string
    to: z.string().optional()
  })
});

export const extinguisherStatsQuerySchema = z.object({
  query: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    status: z
      .enum(['ACTIVE', 'EXPIRED', 'NEEDS_INSPECTION', 'UNDER_MAINTENANCE', 'OUT_OF_SERVICE'])
      .optional(),
    location: z.string().optional()
  })
});

export const inspectionStatsQuerySchema = z.object({
  query: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    status: z
      .enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'OVERDUE', 'CANCELLED'])
      .optional(),
    outcome: z.enum(['PASSED', 'FAILED', 'PENDING']).optional()
  })
});

export const maintenanceStatsQuerySchema = z.object({
  query: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    status: z.enum(['PENDING', 'COMPLETED', 'OVERDUE', 'CANCELLED']).optional(),
    type: z.string().optional()
  })
});