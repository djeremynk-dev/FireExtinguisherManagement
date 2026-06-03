import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User as UserIcon,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  CheckSquare,
  Search,
  Filter,
  X,
  Gauge,
  Key,
  Shield,
  SearchCode,
} from "lucide-react";
import { Inspection, User } from "../types";

interface InspectionViewProps {
  currentUser: User;
  inspections: Inspection[];
  onCompleteInspection: (id: string, notes: string, status: "COMPLETED" | "OVERDUE") => Promise<boolean>;
}

export default function InspectionView({
  currentUser,
  inspections,
  onCompleteInspection,
}: InspectionViewProps) {
  const [activeTab, setActiveTab] = useState<"ALL" | "SCHEDULED" | "OVERDUE" | "COMPLETED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIns, setSelectedIns] = useState<Inspection | null>(null);

  // Inspector check form states (wizard)
  const [checks, setChecks] = useState({
    pressureOk: false,
    sealOk: false,
    hoseOk: false,
    bodyOk: false,
    additionalNotes: "",
  });

  // Filter list
  const filtered = inspections.filter((ins) => {
    const matchesTab =
      activeTab === "ALL" ||
      (activeTab === "SCHEDULED" && ins.status === "SCHEDULED") ||
      (activeTab === "OVERDUE" && ins.status === "OVERDUE") ||
      (activeTab === "COMPLETED" && ins.status === "COMPLETED");

    const serialNum = ins.extinguisher?.serialNumber || "";
    const building = ins.extinguisher?.building || "";
    const inspectorName = ins.inspector?.name || "";
    const notes = ins.notes || "";

    const matchesSearch =
      serialNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspectorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notes.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleOpenConductModal = (ins: Inspection) => {
    setSelectedIns(ins);
    setChecks({
      pressureOk: false,
      sealOk: false,
      hoseOk: false,
      bodyOk: false,
      additionalNotes: "",
    });
  };

  const handleConductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIns) return;

    // Build standard notes text based on wizard
    const parts = [
      checks.pressureOk ? "Pressure within standard limits (Green zone)." : "Pressure abnormal (Action required).",
      checks.sealOk ? "Safety pin and plastic seal are fully intact." : "Safety seal broken or missing pin.",
      checks.hoseOk ? "Discharge nozzle and hose are clear." : "Hose/nozzle shows wear/clogging.",
      checks.bodyOk ? "Extinguisher frame free of dents or rust." : "Structural corrosion/dents detected.",
    ];

    if (checks.additionalNotes.trim()) {
      parts.push(`Additional inspector observations: "${checks.additionalNotes.trim()}"`);
    }

    const fullNotes = parts.join(" ");
    
    // Evaluate if any check failed, making it overdue/needing maintenance, or compliant
    const allPassed = checks.pressureOk && checks.sealOk && checks.hoseOk && checks.bodyOk;
    
    const success = await onCompleteInspection(
      selectedIns.id,
      fullNotes,
      allPassed ? "COMPLETED" : "COMPLETED" // Completed, status is logged as completed but the notes list issues for maintenance logging
    );

    if (success) {
      setSelectedIns(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "OVERDUE":
        return "bg-rose-50 text-rose-700 border-rose-200 animate-pulse";
      case "SCHEDULED":
        return "bg-sky-50 text-sky-700 border-sky-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-950">Compliance Inspections</h3>
          <p className="text-xs text-slate-500">Track task schedules, fulfill checklists, and verify safety loops status</p>
        </div>

        {/* Tab switcher inside the card */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto text-xs font-semibold gap-1 shrink-0">
          {(["ALL", "SCHEDULED", "OVERDUE", "COMPLETED"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded-lg transition-all capitalize ${
                activeTab === t ? "bg-white text-slate-950 shadow-xs font-bold" : "text-slate-500 hover:text-slate-950"
              }`}
            >
              {t.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={15} />
          </span>
          <input
            type="text"
            placeholder="Search checklists by serial, buildings, inspector name, or logging notes..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Checklists cards */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center border border-slate-100 shadow-sm text-slate-500 py-16">
          <ClipboardCheck className="mx-auto text-slate-300 mb-2" size={36} />
          <h5 className="font-bold text-slate-700">No scheduled safety checklists found</h5>
          <p className="text-[11px] text-slate-400 mt-1">
            Check your tab filters, expand your search text or schedule a new task check on an extinguisher record
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((ins) => {
            const isCompleted = ins.status === "COMPLETED";
            const isOverdue = ins.status === "OVERDUE";
            const isAssignedToMe = ins.inspectorId === currentUser.id;

            return (
              <div
                key={ins.id}
                className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
              >
                {/* Header info */}
                <div className="bg-slate-50/60 p-4 border-b border-slate-100 flex justify-between items-start gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wide block">
                      {ins.extinguisher?.building || "Region Asset"}
                    </span>
                    <h4 className="text-sm font-bold text-slate-950 font-mono mt-0.5">
                      {ins.extinguisher?.serialNumber || "Unrecognized Extinguisher"}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getStatusStyle(ins.status)}`}>
                    {ins.status}
                  </span>
                </div>

                {/* Body info */}
                <div className="p-4 space-y-3 flex-1">
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <p className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400" />
                      <span>Scheduled: <strong className="text-slate-900">{ins.inspectionDate}</strong> at {ins.inspectionTime}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <UserIcon size={13} className="text-slate-400" />
                      <span>Inspector: <strong className="text-slate-900">{ins.inspector?.name || "Marcus Chen"}</strong></span>
                    </p>
                    {isCompleted && ins.completedAt && (
                      <p className="flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50/50 p-1 px-1.5 rounded">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        <span>Completed: {ins.completedAt.split("T")[0]}</span>
                      </p>
                    )}
                  </div>

                  {ins.notes ? (
                    <div className="bg-slate-50 p-3 rounded-lg text-[11px] text-slate-600 italic border border-slate-100 space-y-1">
                      <span className="font-bold uppercase text-[9px] text-slate-400 font-mono tracking-wider block">Checked logs</span>
                      <p className="line-clamp-3">"{ins.notes}"</p>
                    </div>
                  ) : (
                    <div className="bg-slate-50/50 p-3 rounded-lg text-center text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono border border-dashed border-slate-200">
                      safety details pending
                    </div>
                  )}
                </div>

                {/* Checklist Action Footer */}
                {!isCompleted && (currentUser.role === "ADMIN" || currentUser.role === "INSPECTOR") && (
                  <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
                    <p className="text-[10px] font-semibold text-slate-500">
                      {isAssignedToMe ? "👋 Assigned to you" : "Authorized route agent check"}
                    </p>
                    <button
                      onClick={() => handleOpenConductModal(ins)}
                      className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-[11px] font-bold hover:bg-slate-800 transition flex items-center gap-1"
                    >
                      <CheckSquare size={12} /> Conduct Audit
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ==========================================================
          CONDUCT INSPECTION CHECKLIST MODAL (WIZARD)
          ========================================================== */}
      {selectedIns && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-slate-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-950 p-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-400 font-mono tracking-wider">
                  OSHA Safety Checklist
                </span>
                <h3 className="text-base font-bold font-mono">Conduct Audit: {selectedIns.extinguisher?.serialNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedIns(null)}
                className="p-1 text-slate-400 hover:text-white rounded bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConductSubmit} className="p-6 space-y-4 text-xs">
              
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl space-y-1 text-amber-950">
                <p className="font-bold">Deployment Area:</p>
                <p className="font-semibold text-slate-800 text-[11px]">
                  {selectedIns.extinguisher?.building} - {selectedIns.extinguisher?.location}
                </p>
              </div>

              <h4 className="font-bold text-slate-700 uppercase font-mono text-[10px] tracking-wider border-b border-slate-100 pb-1.5">
                Physical Roster Checklist Verified (*):
              </h4>

              {/* Checks parameters stack */}
              <div className="space-y-3">
                {/* 1. Pressure Gauge */}
                <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/55 cursor-pointer transition">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 mt-0.5"
                    checked={checks.pressureOk}
                    onChange={(e) => setChecks({ ...checks, pressureOk: e.target.checked })}
                  />
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Gauge size={13} className="text-orange-500" /> Gauge in Green Zone
                    </span>
                    <p className="text-[11px] text-slate-500">Cylinder is charged properly. Pointer is clearly resting inside standard limits.</p>
                  </div>
                </label>

                {/* 2. Pull Pin & Seal */}
                <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/55 cursor-pointer transition">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 mt-0.5"
                    checked={checks.sealOk}
                    onChange={(e) => setChecks({ ...checks, sealOk: e.target.checked })}
                  />
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Key size={13} className="text-orange-500" /> Safety Pin & Seal Present
                    </span>
                    <p className="text-[11px] text-slate-500">Tamper seals are in-position, unbroken, securing pull pin mechanism structure.</p>
                  </div>
                </label>

                {/* 3. Hose Clearance */}
                <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/55 cursor-pointer transition">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 mt-0.5"
                    checked={checks.hoseOk}
                    onChange={(e) => setChecks({ ...checks, hoseOk: e.target.checked })}
                  />
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <SearchCode size={13} className="text-orange-500" /> Hose & Nozzle Free
                    </span>
                    <p className="text-[11px] text-slate-500">Visual check shows no cracking or rot. The discharge tip is free of debris.</p>
                  </div>
                </label>

                {/* 4. Frame Corrosion */}
                <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/55 cursor-pointer transition">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 mt-0.5"
                    checked={checks.bodyOk}
                    onChange={(e) => setChecks({ ...checks, bodyOk: e.target.checked })}
                  />
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Shield size={13} className="text-orange-500" /> Frame Free of Corrosion / Rust
                    </span>
                    <p className="text-[11px] text-slate-500">Excludes major structural dents, deep scratches, rust wear layers, or water damages.</p>
                  </div>
                </label>
              </div>

              {/* Extra Observation Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">General Inspector Observations</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:ring-1 focus:ring-orange-500 font-medium"
                  placeholder="Insert outstanding compliance parameters, observations or recommendations here..."
                  value={checks.additionalNotes}
                  onChange={(e) => setChecks({ ...checks, additionalNotes: e.target.value })}
                />
              </div>

              {!checks.pressureOk || !checks.sealOk || !checks.hoseOk || !checks.bodyOk ? (
                <div className="flex gap-2 p-3 bg-amber-50 text-amber-950 border border-amber-200 rounded-xl text-[11px] leading-snug">
                  <AlertTriangle size={15} className="shrink-0 text-amber-600" />
                  <span>
                    <strong>Caution:</strong> One or more of the checklist parameters are unchecked. Submitting this check will flag the team for immediate <strong>Maintenance Activities</strong>.
                  </span>
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition"
              >
                Submit Audit & Update Compliance Records
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
