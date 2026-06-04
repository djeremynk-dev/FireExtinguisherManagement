import express from "express";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import { createServer as createViteServer } from "vite";
import {
  db,
  hashPassword,
  Role,
  User,
  ExtinguisherType,
  ExtinguisherStatus,
  InspectionStatus,
  ExtinguisherSize,
} from "./db.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Token Secret
const TOKEN_SECRET = "tzw-ltd-super-jwt-secret-signing-key-2026";

// Simple Secure Token Utils simulating JWT
function generateToken(user: Omit<User, "passwordHash">): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })
  ).toString("base64");
  
  const signature = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64");
    
  return `${header}.${payload}.${signature}`;
}

function verifyToken(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    
    const expectedSig = crypto
      .createHmac("sha256", TOKEN_SECRET)
      .update(`${header}.${payload}`)
      .digest("base64");
      
    if (signature !== expectedSig) return null;
    
    const decodedPayload = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
    if (Date.now() > decodedPayload.exp) return null; // Expired
    return decodedPayload;
  } catch (err) {
    return null;
  }
}

// Authentication Middleware
function authenticate(req: express.Request & { user?: any }, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No authorization token provided." });
  }
  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Invalid or expired authorization token." });
  }
  req.user = payload;
  next();
}

// RBAC Authorization Middleware creator
function authorize(roles: Role[]) {
  return (req: express.Request & { user?: any }, res: express.Response, next: express.NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied. Insufficient role permissions." });
    }
    next();
  };
}

// ==========================================
// Swagger / OpenAPI documentation spec
// ==========================================
const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "TZW LTD - Fire Extinguisher Management API Microservices",
    description: "RESTful endpoints for managing Users, Authentication, Fire Extinguishers, Inspections, Maintenance Logs, and Real-time Reports.",
    version: "1.0.0-micro",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string", description: "User's first name" },
                  lastName: { type: "string", description: "User's last name" },
                  email: { type: "string", format: "email", description: "User's email address" },
                  password: { type: "string", format: "password", description: "User's password" },
                  role: { type: "string", enum: ["ADMIN", "INSPECTOR", "USER"], description: "User role" },
                },
                required: ["firstName", "lastName", "email", "password"],
              },
            },
          },
        },
        responses: {
          "201": { description: "User registered successfully" },
          "400": { description: "Validation failure or duplicate user" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Authenticate user and get JWT",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email", description: "User's email address" },
                  password: { type: "string", format: "password", description: "User's password" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Login successful with token" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/api/extinguishers": {
      get: {
        summary: "Retrieve all fire extinguishers",
        tags: ["Extinguishers"],
        responses: {
          "200": { description: "List of fire extinguishers" },
        },
      },
      post: {
        summary: "Register an extinguisher (Admin only)",
        tags: ["Extinguishers"],
        responses: {
          "201": { description: "Extinguisher registered successfully" },
        },
      },
    },
    "/api/extinguishers/{id}": {
      get: {
        summary: "Get details for an extinguisher",
        tags: ["Extinguishers"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Extinguisher details" },
          "404": { description: "Extinguisher not found" },
        },
      },
      put: {
        summary: "Modify extinguisher fields (Admin/Inspector)",
        tags: ["Extinguishers"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Extinguisher updated successfully" },
          "404": { description: "Extinguisher not found" },
        },
      },
      delete: {
        summary: "Remove extinguisher (Admin only)",
        tags: ["Extinguishers"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Extinguisher deleted successfully" },
          "404": { description: "Extinguisher not found" },
        },
      },
    },
    "/api/inspections": {
      get: {
        summary: "View scheduled/completed inspections",
        tags: ["Inspections"],
        responses: {
          "200": { description: "List of inspections" },
        },
      },
      post: {
        summary: "Schedule new inspection",
        tags: ["Inspections"],
        responses: {
          "201": { description: "Inspection scheduled successfully" },
        },
      },
    },
    "/api/maintenance": {
      get: {
        summary: "Get maintenance logs history",
        tags: ["Maintenance"],
        responses: {
          "200": { description: "List of maintenance logs" },
        },
      },
      post: {
        summary: "Record maintenance action (Inspector/Admin)",
        tags: ["Maintenance"],
        responses: {
          "201": { description: "Maintenance log created successfully" },
        },
      },
    },
    "/api/reports": {
      get: {
        summary: "Fetch inventory, compliance, statistics (Admin/Inspector)",
        tags: ["Reports"],
        responses: {
          "200": { description: "Report data" },
        },
      },
    },
  },
};

// JSON API Docs endpoint (for programmatic access)
app.get("/api/docs/json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json(swaggerSpec);
});

// Set up Swagger UI with serialized spec
app.use("/api/docs", swaggerUi.serve);
app.get("/api/docs", swaggerUi.setup(null, {
  swaggerOptions: {
    url: "/api/docs/json",        // Let Swagger UI fetch the JSON spec
  },
  customCss: '.swagger-ui { font-family: system-ui, -apple-system, sans-serif; }',
}));
app.get("/api/docs/json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json(swaggerSpec);
});

// ==========================================================
// ACTIVITY 2: USER MANAGEMENT & AUTH SERVICE ENDPOINTS
// ==========================================================

// Register User
app.post("/api/auth/register", (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "First Name, Last Name, Email, and Password are required." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUsers = db.getUsers();
  if (existingUsers.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return res.status(400).json({ error: "An account with this email address already exists." });
  }

  const assignedRole: Role = role && ["ADMIN", "INSPECTOR", "USER"].includes(role) ? role : "USER";

  const newUser: User = {
    id: "usr-" + crypto.randomUUID().slice(0, 8),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    role: assignedRole,
    createdAt: new Date().toISOString(),
  };

  db.addUser(newUser);

  const { passwordHash, ...userResponse } = newUser;
  const token = generateToken(userResponse);

  return res.status(201).json({
    message: "User account created successfully.",
    user: userResponse,
    token,
  });
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = db.getUsers().find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: "Invalid email or password combination." });
  }

  const { passwordHash, ...userResponse } = user;
  const token = generateToken(userResponse);

  return res.json({
    message: "Login successful.",
    user: userResponse,
    token,
  });
});

// Get Current Profile
app.get("/api/auth/me", authenticate, (req: any, res) => {
  const curUser = db.getUsers().find((u) => u.id === req.user.id);
  if (!curUser) {
    return res.status(404).json({ error: "User profile not found." });
  }
  const { passwordHash, ...userResponse } = curUser;
  return res.json(userResponse);
});

// Update Profile General Info
app.put("/api/auth/profile", authenticate, (req: any, res) => {
  const { firstName, lastName, email } = req.body;
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: "First Name, Last Name and Email are required properties." });
  }
  
  const normalizedEmail = email.toLowerCase().trim();
  const existingWithEmail = db.getUsers().find((u) => u.email.toLowerCase() === normalizedEmail && u.id !== req.user.id);
  if (existingWithEmail) {
    return res.status(400).json({ error: "This email address is already in use by another user." });
  }

  const updated = db.updateUser(req.user.id, {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
  });

  if (!updated) {
    return res.status(404).json({ error: "Failed to update profile." });
  }

  const { passwordHash, ...userResponse } = updated;
  const newToken = generateToken(userResponse);

  return res.json({
    message: "Profile updated successfully.",
    user: userResponse,
    token: newToken,
  });
});

// Change Password
app.put("/api/auth/password", authenticate, (req: any, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Current password and new password are required." });
  }

  const targetUser = db.getUsers().find((u) => u.id === req.user.id);
  if (!targetUser) {
    return res.status(404).json({ error: "User profile not found." });
  }

  if (targetUser.passwordHash !== hashPassword(oldPassword)) {
    return res.status(400).json({ error: "Incorrect current password." });
  }

  db.updateUser(req.user.id, {
    passwordHash: hashPassword(newPassword),
  });

  return res.json({ message: "Password updated successfully." });
});

// Simulator Forgotten Password Reset Recovery Token
app.post("/api/auth/recover", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Please provide an email address." });
  }
  const user = db.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ error: "No user found with this email address." });
  }
  // Simulate recovery token email
  const tempPassword = "TZW-" + Math.floor(100000 + Math.random() * 900000);
  db.updateUser(user.id, {
    passwordHash: hashPassword(tempPassword),
  });
  return res.json({
    message: `Recovery email matches database. A temporary password has been dispatched to ${email}.`,
    tempPassword, // Return for demo and simulation purposes in developer sandbox
  });
});

// Admin User Management Endpoint
app.get("/api/users", authenticate, authorize(["ADMIN"]), (req, res) => {
  const list = db.getUsers().map(({ passwordHash, ...u }) => u);
  return res.json(list);
});

// Admin Update User Role
app.put("/api/users/:id/role", authenticate, authorize(["ADMIN"]), (req, res) => {
  const { role } = req.body;
  if (!role || !["ADMIN", "INSPECTOR", "USER"].includes(role)) {
    return res.status(400).json({ error: "Invalid role value." });
  }
  const updated = db.updateUser(req.params.id, { role });
  if (!updated) {
    return res.status(404).json({ error: "User not found." });
  }
  const { passwordHash, ...u } = updated;
  return res.json({ message: `User role changed successfully to ${role}`, user: u });
});

// Admin Delete User
app.delete("/api/users/:id", authenticate, authorize(["ADMIN"]), (req, res) => {
  const s = db.getUsers();
  const u = s.find((x) => x.id === req.params.id);
  if (!u) {
    return res.status(404).json({ error: "User not found." });
  }
  if (u.id === "u1") {
    return res.status(400).json({ error: "System constraint: Primary admin account cannot be deleted." });
  }
  // Quick direct filter write
  const rawDb = JSON.parse(fs.readFileSync(path.join(process.cwd(), "db.json"), "utf8"));
  rawDb.users = rawDb.users.filter((x: any) => x.id !== req.params.id);
  fs.writeFileSync(path.join(process.cwd(), "db.json"), JSON.stringify(rawDb, null, 2), "utf8");
  return res.json({ message: "User deleted successfully." });
});


// ==========================================================
// ACTIVITY 3: FIRE EXTINGUISHER MANAGEMENT SERVICE & COMMONS
// ==========================================================

// Register/Create new fire extinguisher
app.post("/api/extinguishers", authenticate, authorize(["ADMIN"]), (req: any, res) => {
  const { serialNumber, location, building, type, size, installationDate, expiryDate } = req.body;

  if (!serialNumber || !location || !building || !type || !size || !installationDate || !expiryDate) {
    return res.status(400).json({ error: "All properties (serialNumber, location, building, type, size, installationDate, expiryDate) are required." });
  }

  // Check duplicate Serial within user's extinguishers
  const all = db.getExtinguishers();
  if (all.some((e) => e.userId === req.user.id && e.serialNumber.trim().toUpperCase() === serialNumber.trim().toUpperCase())) {
    return res.status(400).json({ error: `A fire extinguisher with Serial Number ${serialNumber} is already registered.` });
  }

  const newExt: any = {
    id: "ext-" + crypto.randomUUID().slice(0, 8),
    userId: req.user.id,
    serialNumber: serialNumber.toUpperCase().trim(),
    building: building.trim(),
    location: location.trim(),
    type,
    size,
    installationDate,
    expiryDate,
    status: "ACTIVE", // Freshly registered, let standard date evaluation calculate it
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.addExtinguisher(newExt);
  return res.status(201).json({
    message: "Fire extinguisher registered successfully in inventory.",
    extinguisher: newExt,
  });
});

// List All Extinguishers
app.get("/api/extinguishers", authenticate, (req: any, res) => {
  const all = db.getExtinguishers();
  const userExtinguishers = all.filter((e) => e.userId === req.user.id);
  return res.json(userExtinguishers);
});

// Get Extinguisher Details by ID
app.get("/api/extinguishers/:id", authenticate, (req: any, res) => {
  const ext = db.getExtinguisherById(req.params.id);
  if (!ext || ext.userId !== req.user.id) {
    return res.status(404).json({ error: "Fire extinguisher profile not found." });
  }
  return res.json(ext);
});

// Update Extinguisher (Accessible to Admin and Inspectors)
app.put("/api/extinguishers/:id", authenticate, authorize(["ADMIN", "INSPECTOR"]), (req: any, res) => {
  const { serialNumber, location, building, type, size, installationDate, expiryDate, status } = req.body;
  const ext = db.getExtinguisherById(req.params.id);
  if (!ext || ext.userId !== req.user.id) {
    return res.status(404).json({ error: "Fire extinguisher not found." });
  }

  if (serialNumber) {
    const all = db.getExtinguishers();
    const dup = all.find((e) => e.userId === req.user.id && e.serialNumber.trim().toUpperCase() === serialNumber.trim().toUpperCase() && e.id !== req.params.id);
    if (dup) {
      return res.status(400).json({ error: `Serial Number ${serialNumber} is already taken by another unit.` });
    }
  }

  const updated = db.updateExtinguisher(req.params.id, {
    ...(serialNumber && { serialNumber: serialNumber.trim() }),
    ...(location && { location: location.trim() }),
    ...(building && { building: building.trim() }),
    ...(type && { type }),
    ...(size && { size }),
    ...(installationDate && { installationDate }),
    ...(expiryDate && { expiryDate }),
    ...(status && { status }),
  });

  return res.json({
    message: "Fire extinguisher record modified successfully.",
    extinguisher: updated,
  });
});

// Delete Extinguisher (Admin only)
app.delete("/api/extinguishers/:id", authenticate, authorize(["ADMIN"]), (req: any, res) => {
  const ext = db.getExtinguisherById(req.params.id);
  if (!ext || ext.userId !== req.user.id) {
    return res.status(404).json({ error: "Fire extinguisher not found." });
  }
  const deleted = db.deleteExtinguisher(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Fire extinguisher not found." });
  }
  return res.json({ message: "Fire extinguisher deleted and fully unlinked from database lists." });
});

// ----------------------------------------------------------
// F. Inspection Scheduling Endpoints
// ----------------------------------------------------------

// Add/Schedule an inspection
app.post("/api/inspections", authenticate, (req: any, res) => {
  const { extinguisherId, inspectionDate, inspectionTime, inspectorId } = req.body;

  if (!extinguisherId || !inspectionDate || !inspectionTime || !inspectorId) {
    return res.status(400).json({ error: "extinguisherId, inspectionDate, inspectionTime, and inspectorId are all required fields." });
  }

  const ext = db.getExtinguisherById(extinguisherId);
  if (!ext || ext.userId !== req.user.id) {
    return res.status(404).json({ error: "Extinguisher not found." });
  }

  const inspectors = db.getUsers().filter((u) => u.role === "INSPECTOR" || u.role === "ADMIN");
  const targetInspector = inspectors.find((ins) => ins.id === inspectorId);
  if (!targetInspector) {
    return res.status(400).json({ error: "A valid inspector or administrator must be assigned." });
  }

  const scheduledIns: any = {
    id: "ins-" + crypto.randomUUID().slice(0, 8),
    userId: req.user.id,
    extinguisherId,
    inspectorId,
    inspectionDate,
    inspectionTime,
    status: "SCHEDULED",
    createdAt: new Date().toISOString(),
  };

  db.addInspection(scheduledIns);

  // Notify Relevant Personnel (Simulated trigger log)
  console.log(`[TZW SYSTEM-ALERT] Notification dispatched to Inspector ${targetInspector.firstName} ${targetInspector.lastName} (${targetInspector.email}) and Administrator Sarah Jenkins for upcoming inspection scheduled for Extinguisher ${ext.serialNumber} on ${inspectionDate} at ${inspectionTime}.`);

  return res.status(201).json({
    message: `Inspection scheduled successfully. Notification sent to Inspector ${targetInspector.firstName} and team.`,
    inspection: scheduledIns,
  });
});

// List All Inspections
app.get("/api/inspections", authenticate, (req: any, res) => {
  const inspections = db.getInspections();
  
  // Filter by user and attach joined extinguisher and user metadata
  const enriched = inspections
    .filter((ins) => ins.userId === req.user.id)
    .map((ins) => {
      const ext = db.getExtinguisherById(ins.extinguisherId);
      const inspector = db.getUsers().find((u) => u.id === ins.inspectorId);
      return {
        ...ins,
        extinguisher: ext ? { serialNumber: ext.serialNumber, building: ext.building, location: ext.location } : null,
        inspector: inspector ? { name: `${inspector.firstName} ${inspector.lastName}`, email: inspector.email } : null,
      };
    });
  
  return res.json(enriched);
});

// Update/Log Complete Inspection Result (Accessible to Inspector/Admin)
app.put("/api/inspections/:id/complete", authenticate, authorize(["ADMIN", "INSPECTOR"]), (req: any, res) => {
  const { notes, status } = req.body; // status could be COMPLETED or OVERDUE
  const ins = db.getInspections().find((i) => i.id === req.params.id);
  if (!ins || ins.userId !== req.user.id) {
    return res.status(404).json({ error: "Scheduled inspection was not found." });
  }

  const completionStatus = status || "COMPLETED";

  const updatedAction = db.updateInspection(req.params.id, {
    status: completionStatus,
    notes,
    completedAt: completionStatus === "COMPLETED" ? new Date().toISOString() : undefined,
  });

  // Adjust fire extinguisher status back to ACTIVE if completed without critical issues
  if (completionStatus === "COMPLETED") {
    db.updateExtinguisher(ins.extinguisherId, {
      status: "ACTIVE", // Recovered from Overdue on success
    });
  }

  return res.json({
    message: `Inspection marked as ${completionStatus}.`,
    inspection: updatedAction,
  });
});

// ----------------------------------------------------------
// G. Maintenance Logging Endpoints
// ----------------------------------------------------------

// Create Maintenance Log
app.post("/api/maintenance", authenticate, authorize(["ADMIN", "INSPECTOR"]), (req: any, res) => {
  const { extinguisherId, actionTaken, maintenanceDate, issuesIdentified, notes, recommendations } = req.body;

  if (!extinguisherId || !actionTaken || !maintenanceDate || !issuesIdentified) {
    return res.status(400).json({ error: "extinguisherId, actionTaken, maintenanceDate, and issuesIdentified are required fields." });
  }

  const ext = db.getExtinguisherById(extinguisherId);
  if (!ext || ext.userId !== req.user.id) {
    return res.status(404).json({ error: "Fire extinguisher not found." });
  }

  const newLog: any = {
    id: "maint-" + crypto.randomUUID().slice(0, 8),
    userId: req.user.id,
    extinguisherId,
    inspectorId: req.user.id,
    actionTaken,
    maintenanceDate,
    issuesIdentified,
    notes: notes || "",
    recommendations: recommendations || "",
    createdAt: new Date().toISOString(),
  };

  db.addMaintenanceLog(newLog);

  // Synchronously update extinguisher state to active style
  db.updateExtinguisher(extinguisherId, { status: "ACTIVE" });

  return res.status(201).json({
    message: "Maintenance service activity logged successfully. Extinguisher status updated to ACTIVE.",
    log: newLog,
  });
});

// List All Maintenance Services Logs
app.get("/api/maintenance", authenticate, (req: any, res) => {
  const logs = db.getMaintenanceLogs();
  
  const enriched = logs
    .filter((lg) => lg.userId === req.user.id)
    .map((lg) => {
      const ext = db.getExtinguisherById(lg.extinguisherId);
      const inspector = db.getUsers().find((u) => u.id === lg.inspectorId);
      return {
        ...lg,
        extinguisher: ext ? { serialNumber: ext.serialNumber, building: ext.building, location: ext.location, type: ext.type, size: ext.size } : null,
        inspector: inspector ? { name: `${inspector.firstName} ${inspector.lastName}`, email: inspector.email } : null,
      };
    });

  return res.json(enriched);
});


// ==========================================================
// ACTIVITY 4: REPORTING SERVICE ENDPOINTS
// ==========================================================

app.get("/api/reports", authenticate, (req: any, res) => {
  const allExtinguishers = db.getExtinguishers();
  const allInspections = db.getInspections();
  const allLogs = db.getMaintenanceLogs();
  
  // Filter all data by current user
  const extinguishers = allExtinguishers.filter((e) => e.userId === req.user.id);
  const inspections = allInspections.filter((i) => i.userId === req.user.id);
  const logs = allLogs.filter((l) => l.userId === req.user.id);
  
  // 1. Inventory counts
  const total = extinguishers.length;
  const typesCount: Record<string, number> = {};
  const sizesCount: Record<string, number> = {};
  const buildingCount: Record<string, number> = {};
  
  extinguishers.forEach((e) => {
    typesCount[e.type] = (typesCount[e.type] || 0) + 1;
    sizesCount[e.size] = (sizesCount[e.size] || 0) + 1;
    buildingCount[e.building] = (buildingCount[e.building] || 0) + 1;
  });

  // 2. Inspection breakdown
  const pending = inspections.filter((i) => i.status === "SCHEDULED").length;
  const completed = inspections.filter((i) => i.status === "COMPLETED").length;
  const overdue = inspections.filter((i) => i.status === "OVERDUE").length;

  // 3. Compliance status query
  const expired = extinguishers.filter((e) => e.status === "EXPIRED").length;
  
  // Upcoming expirations within next 12 months
  const today = new Date();
  const twelveMonthsFromNow = new Date();
  twelveMonthsFromNow.setMonth(today.getMonth() + 12);
  
  const upcomingExpirations = extinguishers.filter((e) => {
    const expiry = new Date(e.expiryDate);
    return expiry > today && expiry <= twelveMonthsFromNow;
  }).length;

  const activeCount = extinguishers.filter((e) => e.status === "ACTIVE").length;
  const needMaintCount = extinguishers.filter((e) => e.status === "NEED_MAINTENANCE").length;
  
  const compliantCount = activeCount;
  const complianceStatus = total > 0 ? Math.round((compliantCount / total) * 100) : 100;

  // 4. Maintenance frequency by ID
  const maintFrequency: Record<string, number> = {};
  logs.forEach((l) => {
    maintFrequency[l.extinguisherId] = (maintFrequency[l.extinguisherId] || 0) + 1;
  });

  const recentMaintenance = logs
    .map((lg) => {
      const ext = db.getExtinguisherById(lg.extinguisherId);
      return {
        id: lg.id,
        extinguisherSerialNumber: ext ? ext.serialNumber : "Unknown",
        building: ext ? ext.building : "Unknown",
        location: ext ? ext.location : "Unknown",
        actionTaken: lg.actionTaken,
        maintenanceDate: lg.maintenanceDate,
      };
    })
    .sort((a, b) => new Date(b.maintenanceDate).getTime() - new Date(a.maintenanceDate).getTime())
    .slice(0, 5);

  return res.json({
    inventory: {
      total,
      types: typesCount,
      sizes: sizesCount,
      buildings: buildingCount,
    },
    inspections: {
      pending,
      completed,
      overdue,
    },
    compliance: {
      expired,
      upcomingExpirations,
      needMaintenance: needMaintCount,
      active: activeCount,
      compliancePercentage: complianceStatus,
    },
    maintenance: {
      totalLogs: logs.length,
      frequency: maintFrequency,
      recent: recentMaintenance,
    },
  });
});


// ==========================================
// VITE CLIENT INTEGRATION
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Serving development server with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build from static assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TZW LTD Fire Extinguisher System running on http://localhost:${PORT}`);
  });
}

startServer();
