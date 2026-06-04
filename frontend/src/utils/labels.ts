import type { ExtinguisherSize, ExtinguisherStatus, ExtinguisherType } from '../types';

export const extinguisherTypeLabels: Record<ExtinguisherType, string> = {
  WATER: 'Water',
  CO2: 'CO₂',
  FOAM: 'Foam',
  DRY_CHEMICAL: 'Dry Chemical'
};

export const extinguisherSizeLabels: Record<ExtinguisherSize, string> = {
  LB_2_5: '2.5 lb',
  LB_5: '5 lb',
  LB_9: '9 lb',
  LB_12: '12 lb'
};

export const extinguisherStatusLabels: Record<ExtinguisherStatus, string> = {
  ACTIVE: 'Active',
  EXPIRED: 'Expired',
  NEEDS_INSPECTION: 'Needs Inspection',
  UNDER_MAINTENANCE: 'Under Maintenance',
  OUT_OF_SERVICE: 'Out of Service'
};

export const statusColor: Record<ExtinguisherStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  EXPIRED: 'bg-red-100 text-red-800',
  NEEDS_INSPECTION: 'bg-amber-100 text-amber-800',
  UNDER_MAINTENANCE: 'bg-blue-100 text-blue-800',
  OUT_OF_SERVICE: 'bg-slate-100 text-slate-800'
};
