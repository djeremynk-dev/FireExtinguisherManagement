import { z } from 'zod';

export const createExtinguisherSchema = z.object({
  body: z.object({
    serialNumber: z.string().min(1, 'Serial number is required'),
    location: z.string().min(1, 'Location is required'),
    type: z.enum(['WATER', 'CO2', 'FOAM', 'DRY_CHEMICAL']),
    size: z.enum(['LB_2_5', 'LB_5', 'LB_9', 'LB_12']),
    installationDate: z.string().min(1, 'Installation date is required'),
    expiryDate: z.string().min(1, 'Expiry date is required'),
    status: z.enum(['ACTIVE', 'EXPIRED', 'NEEDS_INSPECTION', 'UNDER_MAINTENANCE', 'OUT_OF_SERVICE']).optional(),
    notes: z.string().optional()
  })
});

export const updateExtinguisherSchema = z.object({
  body: z.object({
    serialNumber: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    type: z.enum(['WATER', 'CO2', 'FOAM', 'DRY_CHEMICAL']).optional(),
    size: z.enum(['LB_2_5', 'LB_5', 'LB_9', 'LB_12']).optional(),
    installationDate: z.string().min(1).optional(),
    expiryDate: z.string().min(1).optional(),
    status: z.enum(['ACTIVE', 'EXPIRED', 'NEEDS_INSPECTION', 'UNDER_MAINTENANCE', 'OUT_OF_SERVICE']).optional(),
    notes: z.string().optional()
  })
});