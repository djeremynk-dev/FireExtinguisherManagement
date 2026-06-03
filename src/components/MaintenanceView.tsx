import React, { useState } from "react";
import { Wrench, Search, Clock, ShieldAlert, CheckSquare, Plus, AlertTriangle, User as UserIcon } from "lucide-react";
import { MaintenanceLog, User } from "../types";

interface MaintenanceViewProps {
  currentUser: User;
  maintenanceLogs: MaintenanceLog[];
  onOpenLogModal: () => void;
}

export default function MaintenanceView({
  currentUser,
  maintenanceLogs,
  onOpenLogModal,
}: MaintenanceViewProps) {
  const [search, setSearch] = useState("");

  const filtered = maintenanceLogs.filter((log) => {
    const serialNum = log.extinguisher?.serialNumber || "";
    const action = log.actionTaken || "";
    const issues = log.issuesIdentified || "";
    const notes = log.notes || "";
    const recommendations = log.recommendations || "";
    const building = log.extinguisher?.building || "";

    const matchesSearch =
      serialNum.toLowerCase().includes(search.toLowerCase()) ||
      action.toLowerCase().includes(search.toLowerCase()) ||
      issues.toLowerCase().includes(search.toLowerCase()) ||
      notes.toLowerCase().includes(search.toLowerCase()) ||
      recommendations.toLowerCase().includes(search.toLowerCase()) ||
      building.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  // Sort logs by date descending
  const sorted = [...filtered].sort((a, b) => new Date(b.maintenanceDate).getTime() - new Date(a.maintenanceDate).getTime());

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-950">Maintenance Audit Trails</h3>
          <p className="text-xs text-slate-500">Chronological history of physical repairs, pressure cylinders recharge operations and checks</p>
        </div>

        {(currentUser.role === "ADMIN" || currentUser.role === "INSPECTOR") && (
          <button
            onClick={onOpenLogModal}
            className="w-full sm:w-auto px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus size={14} /> Record Service Work
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={15} />
          </span>
          <input
            type="text"
            placeholder="Search maintenance logs by serial, actions, issues, location, building name..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:ring-1 focus:ring-orange-500 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Main timeline listing */}
      {sorted.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center border border-slate-100 shadow-sm text-slate-500 py-16">
          <Wrench className="mx-auto text-slate-300 mb-2" size={36} />
          <h5 className="font-bold text-slate-700 font-mono text-sm leading-tight">No historical service logs found</h5>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[240px] mx-auto">
            Try loosening your search terms or verify if any cylinder repairs have been completed by team inspectors
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {/* Left col: Extinguisher metadata */}
              <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0 pr-0 md:pr-4">
                <span className="text-[10px] uppercase font-bold text-orange-600 font-mono tracking-wider">
                  {log.extinguisher?.building || "Region Area"}
                </span>
                <h4 className="text-base font-extrabold text-slate-950 font-mono leading-none">
                  {log.extinguisher?.serialNumber || "Cylinder ID " + log.extinguisherId}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Clock size={12} /> {log.maintenanceDate}
                </p>
                <div className="pt-1.5 flex gap-1 items-center flex-wrap">
                  <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold font-mono">
                    {log.extinguisher?.type}
                  </span>
                  <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold font-mono">
                    Size: {log.extinguisher?.size}
                  </span>
                </div>
              </div>

              {/* Middle 2 cols: Issues & actions */}
              <div className="md:col-span-2 space-y-3.5 text-xs">
                {/* Issues Identified */}
                <div className="space-y-1">
                  <h5 className="font-bold text-slate-55 text-slate-500 uppercase tracking-wider font-mono text-[9px] flex items-center gap-1.5">
                    <ShieldAlert size={12} className="text-amber-500" /> Discovered Failures
                  </h5>
                  <p className="text-slate-900 font-semibold leading-relaxed bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/40">
                    {log.issuesIdentified}
                  </p>
                </div>

                {/* Actions Completed */}
                <div className="space-y-1">
                  <h5 className="font-bold text-slate-500 uppercase tracking-wider font-mono text-[9px] flex items-center gap-1.5">
                    <CheckSquare size={12} className="text-emerald-500" /> Actions Swapped / Repaired
                  </h5>
                  <p className="text-slate-800 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {log.actionTaken}
                  </p>
                </div>
              </div>

              {/* Right col: Inspector signer & Recommendations */}
              <div className="flex flex-col justify-between space-y-3.5 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-150/40">
                {/* Signer */}
                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase font-mono text-[8px] tracking-wider block">Checked & Signed by</span>
                  <p className="font-bold text-slate-900 leading-none">{log.inspector?.name || "Marcus Chen"}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{log.inspector?.email || "inspector@tzw.com"}</p>
                </div>

                {/* Recommendation brief */}
                {log.recommendations && (
                  <div className="space-y-1 border-t border-slate-200/50 pt-2 text-[11px] text-slate-600">
                    <strong className="text-[10px] text-slate-500 uppercase font-mono tracking-wide block">Auditor Suggests:</strong>
                    <p className="italic leading-snug">"{log.recommendations}"</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
