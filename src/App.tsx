import React, { useState, useEffect } from "react";
import {
  Flame,
  LayoutDashboard,
  ShieldCheck,
  Building,
  Wrench,
  FileText,
  Users,
  UserCheck,
  LogOut,
  Menu,
  X,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  Plus,
  Calendar,
} from "lucide-react";

import { User, FireExtinguisher, Inspection, MaintenanceLog, ReportStats, Role } from "./types";

// Views components
import DashboardView from "./components/DashboardView";
import ExtinguisherView from "./components/ExtinguisherView";
import InspectionView from "./components/InspectionView";
import MaintenanceView from "./components/MaintenanceView";
import ReportView from "./components/ReportView";
import UserView from "./components/UserView";
import ProfileView from "./components/ProfileView";

export default function App() {
  // Session authentication states
  const [token, setToken] = useState<string | null>(localStorage.getItem("tzw_token"));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("tzw_user");
    return raw ? JSON.parse(raw) : null;
  });

  // Client Navigation
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Core inventories states
  const [extinguishers, setExtinguishers] = useState<FireExtinguisher[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceLog[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);

  // Authentication forms states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ firstName: "", lastName: "", email: "", password: "", role: "USER" as Role });
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password simulator
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Global modifiers triggers for shortcut redirections
  const [showAddExtModal, setShowAddExtModal] = useState(false);
  const [showScheduleInsModal, setShowScheduleInsModal] = useState(false);
  const [showLogMaintModal, setShowLogMaintModal] = useState(false);

  // Sync session lists upon login
  useEffect(() => {
    if (token && currentUser) {
      fetchCoreData();
    }
  }, [token, currentUser]);

  // Network API Fetchers
  const fetchCoreData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [resExt, resIns, resMaint, resStats] = await Promise.all([
        fetch("/api/extinguishers", { headers }),
        fetch("/api/inspections", { headers }),
        fetch("/api/maintenance", { headers }),
        fetch("/api/reports", { headers }),
      ]);

      if (resExt.ok && resIns.ok && resMaint.ok && resStats.ok) {
        const extData = await resExt.json();
        const insData = await resIns.json();
        const maintData = await resMaint.json();
        const statsData = await resStats.json();

        setExtinguishers(extData);
        setInspections(insData);
        setMaintenance(maintData);
        setStats(statsData);
      }

      // If user is Admin, also fetch user operator lists
      if (currentUser?.role === "ADMIN") {
        const resUsers = await fetch("/api/users", { headers });
        if (resUsers.ok) {
          const uList = await resUsers.json();
          setUsersList(uList);
        }
      }
    } catch (err) {
      console.error("Network synchronization parameters failure", err);
    } finally {
      setLoading(false);
    }
  };

  // Authentication API handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login parameters incorrect.");
      }

      localStorage.setItem("tzw_token", data.token);
      localStorage.setItem("tzw_user", JSON.stringify(data.user));
      setToken(data.token);
      setCurrentUser(data.user);
      setLoginForm({ email: "", password: "" });
      setActiveTab("dashboard");
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regForm),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed key registration checks.");
      }

      localStorage.setItem("tzw_token", data.token);
      localStorage.setItem("tzw_user", JSON.stringify(data.user));
      setToken(data.token);
      setCurrentUser(data.user);
      setRegForm({ firstName: "", lastName: "", email: "", password: "", role: "USER" });
      setIsRegistering(false);
      setActiveTab("dashboard");
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("tzw_token");
    localStorage.removeItem("tzw_user");
    setToken(null);
    setCurrentUser(null);
    setRecoveryCode(null);
    setShowForgot(false);
    setForgotEmail("");
    setExtinguishers([]);
    setInspections([]);
    setMaintenance([]);
    setStats(null);
    setActiveTab("dashboard");
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecoveryCode(null);
    try {
      const res = await fetch("/api/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed matching registered email parameters.");
      }
      setRecoveryCode(data.tempPassword);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Client CRUD API wrappers passed into views
  const handleAddExtinguisher = async (formData: any) => {
    try {
      const res = await fetch("/api/extinguishers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed matching serialization standards.");
        return false;
      }
      fetchCoreData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleUpdateExtinguisher = async (id: string, formData: any) => {
    try {
      const res = await fetch(`/api/extinguishers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed update sequence.");
        return false;
      }
      fetchCoreData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleDeleteExtinguisher = async (id: string) => {
    try {
      const res = await fetch(`/api/extinguishers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed termination sequence.");
        return false;
      }
      fetchCoreData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleScheduleInspection = async (formData: any) => {
    try {
      const res = await fetch("/api/inspections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed creating inspection parameters.");
        return false;
      }
      fetchCoreData();
      alert(data.message);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleCompleteInspection = async (id: string, notes: string, status: "COMPLETED" | "OVERDUE") => {
    try {
      const res = await fetch(`/api/inspections/${id}/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update compliance checkpoints.");
        return false;
      }
      fetchCoreData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleLogMaintenanceLog = async (formData: any) => {
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed logging service sequence.");
        return false;
      }
      fetchCoreData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Profile triggers
  const handleUpdateProfile = async (formData: { firstName: string; lastName: string; email: string }) => {
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Profile updates skipped.");
        return false;
      }
      localStorage.setItem("tzw_token", data.token);
      localStorage.setItem("tzw_user", JSON.stringify(data.user));
      setToken(data.token);
      setCurrentUser(data.user);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleChangePassword = async (payloadCheck: any) => {
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payloadCheck),
      });
      const data = await res.json();
      if (!res.ok) {
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Administrative User edits
  const handleAdminUpdateRole = async (userId: string, assignedRole: Role) => {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: assignedRole }),
      });
      const data = await res.json();
      if (!res.ok) return false;
      fetchCoreData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleAdminDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return false;
      fetchCoreData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };


  // Quick jump presets helper for developers and testers
  const handleLoadPresettedSecrets = (emailVal: string) => {
    setLoginForm({ email: emailVal, password: "password123" });
  };

  // Quick navigation routers
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView
            currentUser={currentUser!}
            extinguishers={extinguishers}
            inspections={inspections}
            maintenance={maintenance}
            stats={stats}
            onNavigate={(tab) => {
              setActiveTab(tab);
              setIsSidebarOpen(false);
            }}
            onOpenAddExtinguisher={() => {
              setActiveTab("extinguishers");
              setShowAddExtModal(true);
            }}
            onOpenScheduleInspection={() => {
              setActiveTab("extinguishers");
              setShowScheduleInsModal(true);
            }}
            onOpenLogMaintenance={() => {
              setActiveTab("extinguishers");
              setShowLogMaintModal(true);
            }}
          />
        );
      case "extinguishers":
        return (
          <ExtinguisherView
            currentUser={currentUser!}
            extinguishers={extinguishers}
            inspections={inspections}
            maintenance={maintenance}
            onAddExtinguisher={handleAddExtinguisher}
            onUpdateExtinguisher={handleUpdateExtinguisher}
            onDeleteExtinguisher={handleDeleteExtinguisher}
            onScheduleInspection={handleScheduleInspection}
            onLogMaintenance={handleLogMaintenanceLog}
            inspectors={usersList.length > 0 ? usersList : [currentUser!]}
            showAddModalDirectly={showAddExtModal}
            setShowAddModalDirectly={setShowAddExtModal}
            showMaintModalDirectly={showLogMaintModal}
            setShowMaintModalDirectly={setShowLogMaintModal}
            showScheduleModalDirectly={showScheduleInsModal}
            setShowScheduleModalDirectly={setShowScheduleInsModal}
          />
        );
      case "inspections":
        return (
          <InspectionView
            currentUser={currentUser!}
            inspections={inspections}
            onCompleteInspection={handleCompleteInspection}
          />
        );
      case "maintenance":
        return (
          <MaintenanceView
            currentUser={currentUser!}
            maintenanceLogs={maintenance}
            onOpenLogModal={() => {
              setActiveTab("extinguishers");
              setShowLogMaintModal(true);
            }}
          />
        );
      case "reports":
        return (
          <ReportView
            stats={stats}
            extinguishers={extinguishers}
            inspections={inspections}
            maintenance={maintenance}
          />
        );
      case "users":
        return (
          <UserView
            currentUser={currentUser!}
            usersList={usersList}
            onUpdateRole={handleAdminUpdateRole}
            onDeleteUser={handleAdminDeleteUser}
          />
        );
      case "profile":
        return (
          <ProfileView
            currentUser={currentUser!}
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={handleChangePassword}
          />
        );
      default:
        return <div>Overview not recognized.</div>;
    }
  };


  // ==========================================
  // LANDING PAGE SCREEN (UNAUTHENTICATED)
  // ==========================================
  if (!token || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
        
        {/* Background blobs decor */}
        <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-64 h-64 bg-radial from-red-650/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 w-64 h-64 bg-radial from-red-650/15 to-transparent blur-3xl pointer-events-none" />

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative z-10">
          
          {/* Left panel: Info Panel (Desktop layout) */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 p-8 text-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 text-red-400 text-[10px] font-bold tracking-widest uppercase border border-red-600/20 rounded-full font-mono">
                <Flame size={12} className="animate-pulse" /> Safety Inspection Team
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-black tracking-tight font-sans text-white leading-none">
                  TZW <span className="text-red-500">LTD</span>
                </h2>
                <h3 className="text-lg font-bold text-slate-200">Fire Extinguisher Management</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Migrating active assets logs, inspection schedules and maintenance tracking into an integrated microservices ecosystem format.
                </p>
              </div>
            </div>

            {/* Quick Presets Login buttons */}
            <div className="space-y-2.5 pt-8 border-t border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider block">
                ⭐ QUICK DEV CREDENTIAL PRESETS
              </span>
              <div className="space-y-1.5 text-xs text-slate-300">
                <button
                  type="button"
                  onClick={() => handleLoadPresettedSecrets("admin@tzw.com")}
                  className="w-full px-3 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition flex justify-between items-center font-semibold cursor-pointer"
                >
                  <span className="text-slate-35 font-semibold">Sarah Jenkins (ADMIN)</span>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded font-mono font-bold">Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLoadPresettedSecrets("inspector@tzw.com")}
                  className="w-full px-3 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition flex justify-between items-center font-semibold cursor-pointer"
                >
                  <span className="text-slate-35 font-semibold">Marcus Chen (INSPECTOR)</span>
                  <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded font-mono font-bold font-semibold">Inspector</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLoadPresettedSecrets("user@tzw.com")}
                  className="w-full px-3 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition flex justify-between items-center font-semibold cursor-pointer"
                >
                  <span className="text-slate-35 font-semibold">David Miller (CLIENT)</span>
                  <span className="text-[10px] bg-slate-500/10 text-slate-400 px-1.5 py-0.5 rounded font-mono font-bold font-semibold">User</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-500 text-center font-mono mt-1">Predefined passcodes are: password123</p>
            </div>
          </div>

          {/* Right panel: Active Auth Form */}
          <div className="md:col-span-7 p-8 bg-slate-900/60 flex flex-col justify-center space-y-6">
            
            {showForgot ? (
              // FORGOT PASSWORD SIMULATOR VIEW
              <div className="space-y-4 max-w-sm mx-auto w-full">
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-white tracking-tight">Recover Operator Passcode</h3>
                  <p className="text-xs text-slate-400 leading-normal">
                    Insert your coordination email matching the system database roster. The TZW alerts generator will dispatch temporary logins.
                  </p>
                </div>

                <form onSubmit={handleRecoverySubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Operations Email</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Mail size={14} />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="e.g. admin@tzw.com"
                        className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-red-500"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
                  >
                    Request Passcode Recovery
                  </button>
                </form>

                {/* Simulated alert results */}
                {recoveryCode && (
                  <div className="bg-red-600/10 border border-red-500/30 p-3 rounded-xl space-y-1 text-red-400 text-xs text-left animate-bento-fade">
                    <p className="font-bold">🔑 DEMO SIMULATOR DISPATCH RESULT:</p>
                    <p className="leading-snug">
                      Your temporary password is <strong className="text-white border-b-2 border-red-500 border-dashed font-mono px-1">{recoveryCode}</strong>. Try logging back in!
                    </p>
                  </div>
                )}

                <div className="pt-2 text-center">
                  <button
                    onClick={() => {
                      setShowForgot(false);
                      setRecoveryCode(null);
                    }}
                    className="text-xs font-semibold text-red-500 hover:text-red-400 transition"
                  >
                    Back to Operator Login
                  </button>
                </div>
              </div>
            ) : isRegistering ? (
              // USER SIGNUP FORM - Desktops/Tablets/Mobiles alignments
              <div className="space-y-5 max-w-md mx-auto w-full">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold tracking-tight text-white font-mono">Operator Registration</h3>
                  <p className="text-xs text-slate-400">Join TZW LTD safety coordinators group</p>
                </div>

                {authError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-xl text-xs font-semibold text-center">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-3.5 text-xs text-slate-400">
                  {/* Name grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400">First Name (*)</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
                        value={regForm.firstName}
                        onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400">Last Name (*)</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
                        value={regForm.lastName}
                        onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400">Coordination Email (*)</label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400">Secret Hashed Password (*)</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    />
                  </div>

                  {/* Role Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-35 text-slate-400">Default Authorized Role</label>
                    <select
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold text-xs"
                      value={regForm.role}
                      onChange={(e) => setRegForm({ ...regForm, role: e.target.value as Role })}
                    >
                      <option value="USER">USER (Operator / Client)</option>
                      <option value="INSPECTOR">INSPECTOR (Mechanic)</option>
                      <option value="ADMIN">ADMINISTRATOR (Full)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-2.5 bg-red-650 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs transition"
                  >
                    {loading ? "Authenticating security..." : "Submit Registration Operator Account"}
                  </button>
                </form>

                <div className="text-center pt-2 text-xs">
                  <span className="text-slate-400">Already have an active operator authorization? </span>
                  <button
                    onClick={() => setIsRegistering(false)}
                    className="text-red-500 font-bold hover:text-red-400 transition"
                  >
                    Log In
                  </button>
                </div>
              </div>
            ) : (
              // USER LOGIN FORM
              <div className="space-y-6 max-w-sm mx-auto w-full">
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-black text-white tracking-tight font-mono">Sign In</h3>
                  <p className="text-xs text-slate-400">Authenticate your TZW coordinator key credentials</p>
                </div>

                {authError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-xl text-xs font-semibold text-center">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-1 text-xs">
                    <label className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400">Operations Email</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Mail size={14} />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="e.g. coordinator@tzw.com"
                        className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-red-500"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400">Secure Password</label>
                      <button
                        type="button"
                        onClick={() => setShowForgot(true)}
                        className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase font-mono"
                      >
                        Help! Passcode lost?
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-55 text-slate-500">
                        <Lock size={14} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Your password passphrase"
                        className="w-full pl-9 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-red-500"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer shadow-md"
                  >
                    {loading ? "Decrypting credentials..." : "Validate Operator Credentials"}
                  </button>
                </form>

                <div className="text-center text-xs">
                  <span className="text-slate-400">Need TZW operator clearance? </span>
                  <button
                    onClick={() => setIsRegistering(true)}
                    className="text-red-500 font-bold hover:text-red-400 transition"
                  >
                    Register Here
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // OPERATIONAL MAIN SYSTEM PAGE (AUTHENTICATED)
  // ==========================================
  const menuItems = [
    { id: "dashboard", label: "Dashboard Portal", icon: LayoutDashboard },
    { id: "extinguishers", label: "Inventory Fleet", icon: Building },
    { id: "inspections", label: "Compliance Audits", icon: ShieldCheck },
    { id: "maintenance", label: "Repair Records", icon: Wrench },
    { id: "reports", label: "Reporting Center", icon: FileText },
    ...(currentUser.role === "ADMIN" ? [{ id: "users", label: "Users Directory", icon: Users }] : []),
    { id: "profile", label: "Operator Profile", icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* 1. SIDEBAR NAVIGATION - DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-950 text-white border-r border-slate-900 justify-between shrink-0">
        
        {/* Brand logo & operator briefing */}
        <div>
          <div className="p-6 border-b border-slate-900 flex items-center gap-2.5">
            <div className="bg-red-650 p-2 rounded-xl text-white shrink-0 shadow-lg border border-red-700/30">
              <Flame size={20} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight font-sans">
                TZW <span className="text-red-500">LTD</span>
              </h2>
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-widest leading-none font-mono">
                Safety Microservices
              </span>
            </div>
          </div>

          <nav className="p-4 space-y-1 pt-6 text-xs">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isAct = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left p-3 rounded-xl font-bold flex items-center gap-3 transition-all duration-200 ${
                    isAct
                      ? "bg-slate-900 text-white border border-slate-800 shadow-sm text-red-400"
                      : "text-slate-400 hover:bg-slate-900/60 hover:text-white"
                  }`}
                >
                  <Icon size={16} className={isAct ? "text-red-500" : "text-slate-400"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Operator panel foot & logout */}
        <div className="p-4 border-t border-slate-900 space-y-3">
          <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
            <div className="h-8 w-8 bg-red-600/10 text-red-400 font-extrabold flex items-center justify-center rounded-lg uppercase shrink-0 font-mono text-xs">
              {currentUser.firstName[0]}
              {currentUser.lastName[0]}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white truncate leading-tight">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold truncate">
                {currentUser.role}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left p-2 hover:bg-red-950/20 text-red-400 hover:text-red-300 rounded-xl font-bold text-xs flex items-center gap-2 transition"
          >
            <LogOut size={15} />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Mobile Header elements container */}
        <header className="lg:hidden bg-slate-950 p-4 text-white flex justify-between items-center shrink-0 border-b border-slate-900">
          <div className="flex items-center gap-2">
            <div className="bg-red-650 p-1.5 rounded-lg border border-red-750">
              <Flame size={16} className="text-white animate-pulse" />
            </div>
            <span className="font-extrabold text-sm tracking-tight font-sans">TZW Safety Portal</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 bg-slate-900 rounded-lg text-white"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </header>

        {/* 3. MOBILE SLIDEOUT SIDEBAR */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 animate-fade-in">
            <aside className="w-64 bg-slate-950 h-full p-4 flex flex-col justify-between border-r border-slate-905">
              <div>
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-900">
                  <span className="font-black font-sans text-white text-base">TZW LTD</span>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 text-slate-400 bg-slate-900 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>

                <nav className="space-y-1 text-xs">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isAct = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-xl font-bold flex items-center gap-3 transition-colors ${
                          isAct ? "bg-slate-900 text-red-400 border border-slate-800" : "text-slate-400"
                        }`}
                      >
                        <Icon size={15} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-900">
                <button
                  onClick={handleLogout}
                  className="w-full text-left p-2 text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-2"
                >
                  <LogOut size={14} /> Sign Out Session
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Primary Content View Area */}
        <main className="p-4 sm:p-6 lg:p-8 flex-grow">
          {renderTabContent()}
        </main>
      </div>

    </div>
  );
}
