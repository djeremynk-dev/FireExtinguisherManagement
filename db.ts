import fs from "fs";
import path from "path";
import crypto from "crypto";

// Roles & Enums
export type Role = "ADMIN" | "INSPECTOR" | "USER";
export type ExtinguisherType = "Water" | "CO2" | "Foam" | "Dry Chemical";
export type ExtinguisherSize = "2.5 lb" | "5 lb" | "9 lb" | "12 lb";
export type ExtinguisherStatus = "ACTIVE" | "OVERDUE" | "NEED_MAINTENANCE" | "EXPIRED";
export type InspectionStatus = "SCHEDULED" | "COMPLETED" | "OVERDUE";

// Entities
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: string;
}

export interface FireExtinguisher {
  id: string;
  userId: string;
  serialNumber: string;
  location: string;
  building: string;
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
  userId: string;
  extinguisherId: string;
  inspectorId: string;
  inspectionDate: string;
  inspectionTime: string;
  status: InspectionStatus;
  notes?: string;
  completedAt?: string;
  createdAt: string;
}

export interface MaintenanceLog {
  id: string;
  userId: string;
  extinguisherId: string;
  inspectorId: string;
  actionTaken: string;
  maintenanceDate: string;
  issuesIdentified: string;
  notes?: string;
  recommendations?: string;
  createdAt: string;
}

export interface DatabaseState {
  users: User[];
  extinguishers: FireExtinguisher[];
  inspections: Inspection[];
  maintenanceLogs: MaintenanceLog[];
}

const DB_PATH = path.join(process.cwd(), "db.json");

// Pure JS Password Hashing helper using Node.js built-in crypto
export function hashPassword(password: string): string {
  const salt = "tzw_ltd_secret_salt_value";
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

const defaultState: DatabaseState = {
  users: [
    {
      id: "u1",
      email: "admin@tzw.com",
      passwordHash: hashPassword("password123"),
      firstName: "Sarah",
      lastName: "Jenkins",
      role: "ADMIN",
      createdAt: "2026-01-10T08:00:00Z",
    },
    {
      id: "u2",
      email: "inspector@tzw.com",
      passwordHash: hashPassword("password123"),
      firstName: "Marcus",
      lastName: "Chen",
      role: "INSPECTOR",
      createdAt: "2026-01-12T09:30:00Z",
    },
    {
      id: "u3",
      email: "user@tzw.com",
      passwordHash: hashPassword("password123"),
      firstName: "David",
      lastName: "Miller",
      role: "USER",
      createdAt: "2026-02-01T14:15:00Z",
    },
  ],
  extinguishers: [
    {
      id: "fe1",
      userId: "u1",
      serialNumber: "FE-2026-9901",
      building: "Building A",
      location: "Lobby Main Entrance",
      type: "Dry Chemical",
      size: "9 lb",
      installationDate: "2024-05-10",
      expiryDate: "2029-05-10",
      status: "ACTIVE",
      createdAt: "2024-05-10T10:00:00Z",
      updatedAt: "2026-05-20T11:00:00Z",
    },
    {
      id: "fe2",
      userId: "u1",
      serialNumber: "FE-2023-1102",
      building: "Building A",
      location: "Server Room - Floor 2",
      type: "CO2",
      size: "5 lb",
      installationDate: "2023-01-15",
      expiryDate: "2028-01-15",
      status: "ACTIVE",
      createdAt: "2023-01-15T12:00:00Z",
      updatedAt: "2026-05-10T09:00:00Z",
    },
    {
      id: "fe3",
      userId: "u1",
      serialNumber: "FE-2021-0841",
      building: "Building B",
      location: "Kitchen Breakroom - Floor 1",
      type: "Foam",
      size: "9 lb",
      installationDate: "2021-02-12",
      expiryDate: "2026-02-12", // Expired
      status: "EXPIRED",
      createdAt: "2021-02-12T15:00:00Z",
      updatedAt: "2026-02-12T15:00:00Z",
    },
    {
      id: "fe4",
      userId: "u1",
      serialNumber: "FE-2025-4509",
      building: "Building C",
      location: "Chemical Store - Warehouse East",
      type: "Dry Chemical",
      size: "12 lb",
      installationDate: "2025-06-01",
      expiryDate: "2030-06-01",
      status: "OVERDUE", // Has an overdue inspection scheduled
      createdAt: "2025-06-01T08:00:00Z",
      updatedAt: "2025-06-01T08:00:00Z",
    },
    {
      id: "fe5",
      userId: "u1",
      serialNumber: "FE-2025-8822",
      building: "Building A",
      location: "Parking Garage Pillar D4",
      type: "Water",
      size: "9 lb",
      installationDate: "2025-10-15",
      expiryDate: "2030-10-15",
      status: "NEED_MAINTENANCE",
      createdAt: "2025-10-15T11:00:00Z",
      updatedAt: "2026-05-18T16:00:00Z",
    },
  ],
  inspections: [
    {
      id: "ins1",
      userId: "u1",
      extinguisherId: "fe1",
      inspectorId: "u2",
      inspectionDate: "2026-05-20",
      inspectionTime: "11:00",
      status: "COMPLETED",
      notes: "Pressure gauge showing perfect range. Seal is intact. No rust identified.",
      completedAt: "2026-05-20T11:15:00Z",
      createdAt: "2026-05-01T10:00:00Z",
    },
    {
      id: "ins2",
      userId: "u1",
      extinguisherId: "fe4",
      inspectorId: "u2",
      inspectionDate: "2026-05-15", // Past date, still scheduled => Overdue
      inspectionTime: "14:00",
      status: "OVERDUE",
      createdAt: "2026-05-01T11:00:00Z",
    },
    {
      id: "ins3",
      userId: "u1",
      extinguisherId: "fe2",
      inspectorId: "u2",
      inspectionDate: "2026-06-10", // Upcoming scheduled
      inspectionTime: "10:30",
      status: "SCHEDULED",
      createdAt: "2026-06-01T09:00:00Z",
    },
    {
      id: "ins4",
      userId: "u1",
      extinguisherId: "fe5",
      inspectorId: "u2",
      inspectionDate: "2026-05-18",
      inspectionTime: "15:30",
      status: "COMPLETED",
      notes: "Pressure low, hose has minor cracking. Initiated maintenance activity.",
      completedAt: "2026-05-18T16:00:00Z",
      createdAt: "2026-05-10T12:00:00Z",
    },
  ],
  maintenanceLogs: [
    {
      id: "maint1",
      userId: "u1",
      extinguisherId: "fe5",
      inspectorId: "u2",
      actionTaken: "Replaced discharge hose and refilled pressure charge.",
      maintenanceDate: "2026-05-18",
      issuesIdentified: "Pressure gauge low, dry-rot weathering on hose.",
      notes: "Extinguisher performs safely now. Marked for monitoring due to exposure to outdoor elements.",
      recommendations: "Schedule next detailed inspection in 3 months.",
      createdAt: "2026-05-18T16:05:00Z",
    },
  ],
};

function readDb(): DatabaseState {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultState, null, 2), "utf8");
      return defaultState;
    }
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file, returning default", err);
    return defaultState;
  }
}

function writeDb(state: DatabaseState): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing to database file", err);
  }
}

// REST database utility wrapper
export const db = {
  getUsers: (): User[] => readDb().users,
  addUser: (user: User): void => {
    const s = readDb();
    s.users.push(user);
    writeDb(s);
  },
  updateUser: (id: string, update: Partial<Omit<User, "id" | "createdAt">>): User | null => {
    const s = readDb();
    const idx = s.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    s.users[idx] = { ...s.users[idx], ...update };
    writeDb(s);
    return s.users[idx];
  },
  getExtinguishers: (): FireExtinguisher[] => {
    const s = readDb();
    // Re-evaluate Overdue/Expired status based on today's date
    const today = new Date().toISOString().split("T")[0];
    let changed = false;
    const items = s.extinguishers.map((ext) => {
      let nextStatus = ext.status;
      if (ext.expiryDate <= today) {
        nextStatus = "EXPIRED";
      } else {
        // Find if has past scheduled or overdue inspections
        const list = s.inspections.filter((ins) => ins.extinguisherId === ext.id && ins.status !== "COMPLETED");
        const hasOverdueIns = list.some((ins) => ins.inspectionDate < today);
        if (hasOverdueIns) {
          nextStatus = "OVERDUE";
        } else if (ext.status === "EXPIRED" || ext.status === "OVERDUE") {
          // Recover back to active if fixed
          nextStatus = "ACTIVE";
        }
      }
      if (nextStatus !== ext.status) {
        ext.status = nextStatus;
        changed = true;
      }
      return ext;
    });
    if (changed) {
      writeDb(s);
    }
    return items;
  },
  getExtinguisherById: (id: string): FireExtinguisher | null => {
    const list = db.getExtinguishers();
    return list.find((e) => e.id === id) || null;
  },
  addExtinguisher: (ext: FireExtinguisher): void => {
    const s = readDb();
    s.extinguishers.push(ext);
    writeDb(s);
  },
  updateExtinguisher: (id: string, update: Partial<Omit<FireExtinguisher, "id" | "createdAt">>): FireExtinguisher | null => {
    const s = readDb();
    const idx = s.extinguishers.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    s.extinguishers[idx] = { ...s.extinguishers[idx], ...update, updatedAt: new Date().toISOString() };
    writeDb(s);
    return s.extinguishers[idx];
  },
  deleteExtinguisher: (id: string): boolean => {
    const s = readDb();
    const origLen = s.extinguishers.length;
    s.extinguishers = s.extinguishers.filter((e) => e.id !== id);
    // clean up linked scheduled inspections and logs
    s.inspections = s.inspections.filter((i) => i.extinguisherId !== id);
    s.maintenanceLogs = s.maintenanceLogs.filter((m) => m.extinguisherId !== id);
    writeDb(s);
    return s.extinguishers.length < origLen;
  },
  getInspections: (): Inspection[] => {
    const s = readDb();
    const today = new Date().toISOString().split("T")[0];
    let changed = false;
    // Auto-update past scheduled logs to overdue state if they are before today
    const items = s.inspections.map((ins) => {
      if (ins.status === "SCHEDULED" && ins.inspectionDate < today) {
        ins.status = "OVERDUE";
        changed = true;
      }
      return ins;
    });
    if (changed) {
      writeDb(s);
    }
    return items;
  },
  addInspection: (ins: Inspection): void => {
    const s = readDb();
    s.inspections.push(ins);
    writeDb(s);
  },
  updateInspection: (id: string, update: Partial<Omit<Inspection, "id" | "createdAt">>): Inspection | null => {
    const s = readDb();
    const idx = s.inspections.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    s.inspections[idx] = { ...s.inspections[idx], ...update };
    writeDb(s);
    return s.inspections[idx];
  },
  getMaintenanceLogs: (): MaintenanceLog[] => readDb().maintenanceLogs,
  addMaintenanceLog: (log: MaintenanceLog): void => {
    const s = readDb();
    s.maintenanceLogs.push(log);
    writeDb(s);
  },
};
