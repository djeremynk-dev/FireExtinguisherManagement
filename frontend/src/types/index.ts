export type UserRole = 'ADMIN' | 'INSPECTOR' | 'USER';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  role: UserRole;
  isActive?: boolean;
  isEmailVerified?: boolean;
  jobTitle?: string | null;
  department?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type ExtinguisherType = 'WATER' | 'CO2' | 'FOAM' | 'DRY_CHEMICAL';
export type ExtinguisherSize = 'LB_2_5' | 'LB_5' | 'LB_9' | 'LB_12';
export type ExtinguisherStatus =
  | 'ACTIVE'
  | 'EXPIRED'
  | 'NEEDS_INSPECTION'
  | 'UNDER_MAINTENANCE'
  | 'OUT_OF_SERVICE';

export interface FireExtinguisher {
  id: string;
  serialNumber: string;
  location: string;
  type: ExtinguisherType;
  size: ExtinguisherSize;
  installationDate: string;
  expiryDate: string;
  status: ExtinguisherStatus;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type InspectionStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'OVERDUE'
  | 'CANCELLED';

export type InspectionOutcome = 'PASSED' | 'FAILED' | 'PENDING';

export interface Inspection {
  id: string;
  extinguisherId: string;
  inspectorId?: string | null;
  scheduledDate: string;
  scheduledTime: string;
  actualDate?: string | null;
  findings?: string | null;
  status: InspectionStatus;
  outcome: InspectionOutcome;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceLog {
  id: string;
  extinguisherId: string;
  inspectorId?: string | null;
  maintenanceType: string;
  serviceDate: string;
  details: string;
  status: string;
  nextServiceDue?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
