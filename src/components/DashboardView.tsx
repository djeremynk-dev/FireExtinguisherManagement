import React from "react";
import {
  ShieldAlert,
  Wrench,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Building,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Zap,
} from "lucide-react";
import { FireExtinguisher, Inspection, MaintenanceLog, ReportStats, User } from "../types";

interface DashboardProps {
  currentUser: User;
  extinguishers: FireExtinguisher[];
  inspections: Inspection[];
  maintenance: MaintenanceLog[];
  stats: ReportStats | null;
  onNavigate: (view: string) => void;
  onOpenAddExtinguisher: () => void;
  onOpenScheduleInspection: () => void;
  onOpenLogMaintenance: () => void;
}

export default function DashboardView({
  currentUser,
  extinguishers,
  inspections,
  maintenance,
  stats,
  onNavigate,
  onOpenAddExtinguisher,
  onOpenScheduleInspection,
  onOpenLogMaintenance,
}: DashboardProps) {
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-650"></div>
      </div>
    );
  }

  // Calculate compliance status percentage color
  const compColor =
    stats.compliance.compliancePercentage >= 90
      ? "text-emerald-500 stroke-emerald-500"
      : stats.compliance.compliancePercentage >= 75
      ? "text-amber-500 stroke-amber-500"
      : "text-rose-500 stroke-rose-500";

  // Quick info lists
  const pendingInspections = inspections
    .filter((ins) => ins.status !== "COMPLETED")
    .sort((a, b) => new Date(a.inspectionDate).getTime() - new Date(b.inspectionDate).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-bento-fade">
      {/* Welcome Banner - Top Bento Widget */}
      <div className="bg-slate-900 rounded-xl p-6 text-white shadow-sm relative overflow-hidden border border-slate-800">
        <div className="relative z-10 space-y-2">
          <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-500/20 font-mono tracking-wider">
            {currentUser.role} CHANNEL
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
            Welcome, {currentUser.firstName} {currentUser.lastName}
          </h2>
          <p className="text-slate-400 max-w-xl text-xs leading-relaxed">
            TZW LTD Fire Safety Inspectorate is maintaining <span className="text-white font-bold font-mono">{stats.inventory.total}</span> fire safety assets in our microservices core directory.
          </p>
        </div>
        {/* Subtle decorative vector graphic background */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-red-650/10 to-transparent opacity-40 pointer-events-none" />
      </div>

      {/* Bento Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Assets */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-350 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">
              Asset Fleet Size
            </span>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-700 group-hover:bg-slate-950 group-hover:text-white transition-colors border border-slate-100">
              <Building size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-slate-950 font-mono tracking-tight leading-none">
              {stats.inventory.total}
            </h3>
            <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
              <TrendingUp size={11} className="text-emerald-500" />
              <span>Active regional safety installations</span>
            </p>
          </div>
        </div>

        {/* Card 2: Overdue Inspections */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-350 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">
              Anomalies Tracked
            </span>
            <div className={`p-2 rounded-lg text-red-600 border ${stats.inspections.overdue > 0 ? "bg-red-50 border-red-100 animate-pulse" : "bg-slate-50 border-slate-100"}`}>
              <ShieldAlert size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-slate-950 font-mono tracking-tight leading-none">
              {stats.inspections.overdue + stats.compliance.expired}
            </h3>
            <p className="text-[10px] text-slate-500 flex items-center gap-1.5 font-medium">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${stats.inspections.overdue > 0 ? "bg-red-500" : "bg-emerald-500"}`} />
              <span>
                {stats.inspections.overdue} overdue / {stats.compliance.expired} expired
              </span>
            </p>
          </div>
        </div>

        {/* Card 3: Pending Scheduled */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-350 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">
              In Queue audits
            </span>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-700 group-hover:bg-slate-950 group-hover:text-white transition-colors border border-slate-100">
              <Calendar size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-slate-950 font-mono tracking-tight leading-none">
              {stats.inspections.pending}
            </h3>
            <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
              <Clock size={11} className="text-slate-400" />
              <span>Verification loops programmed</span>
            </p>
          </div>
        </div>

        {/* Card 4: Compliance Index */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-350 transition-all duration-300">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">
              Overall Health rating
            </span>
            <div className="p-1.5 bg-slate-50 rounded-lg text-slate-700 border border-slate-100">
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black text-slate-950 font-mono tracking-tight leading-none">
              {stats.compliance.compliancePercentage}%
            </h3>
            {/* Simple Radial Donut SVG Icon */}
            <div className="relative w-9 h-9">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 stroke-current"
                  strokeWidth="4"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${compColor} stroke-current`}
                  strokeWidth="4"
                  strokeDasharray={`${stats.compliance.compliancePercentage}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Action shortcuts row for Quick Workflow */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-wrap gap-3 items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse"></span>
          <span className="text-[10px] font-black text-slate-800 uppercase font-mono tracking-wider">SYSTEM QUICK SHORTCUTS</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentUser.role === "ADMIN" && (
            <button
              onClick={onOpenAddExtinguisher}
              className="px-3.5 py-1.5 bg-slate-955 bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus size={13} className="text-red-400" /> Register Extinguisher
            </button>
          )}
          {(currentUser.role === "ADMIN" || currentUser.role === "USER") && (
            <button
              onClick={onOpenScheduleInspection}
              className="px-3.5 py-1.5 bg-white text-slate-800 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Calendar size={13} className="text-slate-500" /> Schedule Audit
            </button>
          )}
          {(currentUser.role === "ADMIN" || currentUser.role === "INSPECTOR") && (
            <button
              onClick={onOpenLogMaintenance}
              className="px-3.5 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Wrench size={13} /> Log Maintenance
            </button>
          )}
        </div>
      </div>

      {/* Two Columns Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 col: Visual charts and metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inventory Distribution Panel */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-950 font-sans">In-Service Inventory Breakdown</h4>
                <p className="text-[11px] text-slate-500">Distribution frequency across building sites and hazard types</p>
              </div>
              <button
                onClick={() => onNavigate("extinguishers")}
                className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1 transition"
              >
                View Logistics <ArrowRight size={14} />
              </button>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="space-y-4 pt-1">
              <h5 className="text-[10px] font-bold text-slate-550 font-mono uppercase tracking-wider">Inventory by Fire Hazard Class</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(stats.inventory.types).map(([key, count]) => {
                  const pct = Math.max(8, Math.round((count / stats.inventory.total) * 100));
                  return (
                    <div key={key} className="space-y-1.5 p-3 bg-slate-50/60 rounded-xl border border-slate-200/30">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700 text-[11px]">{key}</span>
                        <span className="text-slate-950 font-mono text-[11px] font-bold">{count} units ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-200/60 h-2.5 rounded-full overflow-hidden border border-slate-200/20">
                        <div
                          className="bg-red-600 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sizes Summary Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-sm">
              {Object.entries(stats.inventory.sizes).map(([key, count]) => (
                <div key={key} className="text-center py-2 space-y-0.5 border-r border-slate-800 last:border-0">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold">{key} SIZE</span>
                  <div className="text-lg font-black text-red-400 font-mono">{count}</div>
                  <span className="text-[9px] text-slate-400">units live</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Recent Activity list */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-950">Recent Trails & Repair Logs</h4>
                <p className="text-[11px] text-slate-500">Service logs maintaining status safety check clearance</p>
              </div>
              <button
                onClick={() => onNavigate("maintenance")}
                className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1 transition"
              >
                Log Archive <ArrowRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {stats.maintenance.recent.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center pb-0">No maintenance logs recorded yet.</p>
              ) : (
                stats.maintenance.recent.map((log) => (
                  <div key={log.id} className="py-3 flex sm:items-center justify-between gap-4 text-xs last:pb-0">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-950 font-mono text-[11px]">{log.extinguisherSerialNumber}</span>
                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] font-semibold border border-slate-200/40">
                          {log.building}
                        </span>
                      </div>
                      <p className="text-slate-600 line-clamp-1">{log.actionTaken}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-slate-950 font-mono text-[11px]">{log.maintenanceDate}</p>
                      <p className="text-[9px] font-bold text-emerald-600 uppercase font-mono tracking-wider">Service verified</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 col: Pending calendars / Alerts */}
        <div className="space-y-6">
          {/* Actionable Urgent Alerts Box */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-950">Microservice Health Roster</h4>
            
            <div className="space-y-3">
              {stats.compliance.expired > 0 && (
                <div className="flex gap-3 p-3 bg-red-50 rounded-xl border border-red-100 text-red-900 text-xs">
                  <AlertTriangle className="text-red-600 shrink-0" size={18} />
                  <div className="space-y-0.5">
                    <h5 className="font-bold">{stats.compliance.expired} Expired Equipment</h5>
                    <p className="text-[10px] text-red-700 leading-normal">Shelf safety periods breached. Require urgent replacements.</p>
                  </div>
                </div>
              )}

              {stats.inspections.overdue > 0 && (
                <div className="flex gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 text-xs">
                  <AlertTriangle className="text-amber-655 text-amber-600 shrink-0" size={18} />
                  <div className="space-y-0.5">
                    <h5 className="font-bold">{stats.inspections.overdue} Missed Inspections</h5>
                    <p className="text-[10px] text-amber-700 leading-normal font-medium">Scheduled extinguisher safety audits missed safety compliance deadlines.</p>
                  </div>
                </div>
              )}

              {stats.compliance.expired === 0 && stats.inspections.overdue === 0 && (
                <div className="flex gap-3 p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900 text-xs shadow-xs">
                  <CheckCircle2 className="text-emerald-600 shrink-0" size={18} />
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-emerald-950">Ecosystem Highly Compliant</h5>
                    <p className="text-[10px] text-emerald-700 leading-normal">Zero overdue inspections. 100% active fire extinguisher coverage.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Schedulers Feed */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="text-sm font-bold text-slate-950">Next Programmed Audits</h4>
              <button
                onClick={() => onNavigate("inspections")}
                className="text-red-600 hover:text-red-700 text-xs font-bold transition font-sans"
              >
                Audits Planner
              </button>
            </div>

            <div className="space-y-3">
              {pendingInspections.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No future scheduled inspections.</p>
              ) : (
                pendingInspections.map((ins) => (
                  <div
                    key={ins.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 hover:bg-slate-100/50 transition-colors space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-bold text-slate-950 font-mono text-[11px]">
                          {ins.extinguisher?.serialNumber || "Asset " + ins.extinguisherId}
                        </p>
                        <p className="text-[10px] text-slate-600">
                          {ins.extinguisher?.building} - {ins.extinguisher?.location}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                        ins.status === "OVERDUE" 
                          ? "bg-rose-50 border-rose-150 text-rose-700" 
                          : "bg-sky-50 border-sky-150 text-sky-700"
                      }`}>
                        {ins.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[10px] pt-1.5 border-t border-slate-200/30">
                      <span className="flex items-center gap-1 font-medium text-slate-600">
                        <Calendar size={11} className="text-slate-400" /> {ins.inspectionDate}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-slate-600">
                        <Clock size={11} className="text-slate-400" /> {ins.inspectionTime}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
