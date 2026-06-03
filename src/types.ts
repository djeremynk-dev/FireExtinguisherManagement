export type Role = "ADMIN" | "INSPECTOR" | "USER";
export type ExtinguisherType = "Water" | "CO2" | "Foam" | "Dry Chemical";
export type ExtinguisherSize = "2.5 lb" | "5 lb" | "9 lb" | "12 lb";
export type ExtinguisherStatus = "ACTIVE" | "OVERDUE" | "NEED_MAINTENANCE" | "EXPIRED";
export type InspectionStatus = "SCHEDULED" | "COMPLETED" | "OVERDUE";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: string;
}

export interface FireExtinguisher {
  id: string;
  serialNumber: string;
  building: string;
  location: string;
  type: ExtinguisherType;
  size: ExtinguisherSize;
  installationDate: string;
  expiryDate: string;
  status: ExtinguisherStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Inspection {
  id: string;
  extinguisherId: string;
  inspectorId: string;
  inspectionDate: string;
  inspectionTime: string;
  status: InspectionStatus;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  // Enriched properties
  extinguisher?: {
    serialNumber: string;
    building: string;
    location: string;
  } | null;
  inspector?: {
    name: string;
    email: string;
  } | null;
}

export interface MaintenanceLog {
  id: string;
  extinguisherId: string;
  inspectorId: string;
  actionTaken: string;
  maintenanceDate: string;
  issuesIdentified: string;
  notes?: string;
  recommendations?: string;
  createdAt: string;
  // Enriched properties
  extinguisher?: {
    serialNumber: string;
    building: string;
    location: string;
    type: string;
    size: string;
  } | null;
  inspector?: {
    name: string;
    email: string;
  } | null;
}

export interface ReportStats {
  inventory: {
    total: number;
    types: Record<string, number>;
    sizes: Record<string, number>;
    buildings: Record<string, number>;
  };
  inspections: {
    pending: number;
    completed: number;
    overdue: number;
  };
  compliance: {
    expired: number;
    upcomingExpirations: number;
    needMaintenance: number;
    active: number;
    compliancePercentage: number;
  };
  maintenance: {
    totalLogs: number;
    frequency: Record<string, number>;
    recent: Array<{
      id: string;
      extinguisherSerialNumber: string;
      building: string;
      location: string;
      actionTaken: string;
      maintenanceDate: string;
    }>;
  };
}
