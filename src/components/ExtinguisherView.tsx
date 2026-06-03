import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Calendar,
  Wrench,
  Building,
  Pin,
  Clock,
  Briefcase,
  Layers,
  AlertOctagon,
  X,
  History,
  CheckCircle2,
} from "lucide-react";
import { FireExtinguisher, ExtinguisherType, ExtinguisherSize, User, Inspection, MaintenanceLog } from "../types";

interface ExtinguisherViewProps {
  currentUser: User;
  extinguishers: FireExtinguisher[];
  inspections: Inspection[];
  maintenance: MaintenanceLog[];
  onAddExtinguisher: (data: any) => Promise<boolean>;
  onUpdateExtinguisher: (id: string, data: any) => Promise<boolean>;
  onDeleteExtinguisher: (id: string) => Promise<boolean>;
  onScheduleInspection: (data: any) => Promise<boolean>;
  onLogMaintenance: (data: any) => Promise<boolean>;
  inspectors: User[];
  
  // Modal handlers forwarded for fast-actions
  showAddModalDirectly: boolean;
  setShowAddModalDirectly: (val: boolean) => void;
  showScheduleModalDirectly: boolean;
  setShowScheduleModalDirectly: (val: boolean) => void;
  showMaintModalDirectly: boolean;
  setShowMaintModalDirectly: (val: boolean) => void;
}

export default function ExtinguisherView({
  currentUser,
  extinguishers,
  inspections,
  maintenance,
  onAddExtinguisher,
  onUpdateExtinguisher,
  onDeleteExtinguisher,
  onScheduleInspection,
  onLogMaintenance,
  inspectors,
  showAddModalDirectly,
  setShowAddModalDirectly,
  showScheduleModalDirectly,
  setShowScheduleModalDirectly,
  showMaintModalDirectly,
  setShowMaintModalDirectly,
}: ExtinguisherViewProps) {
  // Filters & State
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterBuilding, setFilterBuilding] = useState<string>("ALL");
  const [selectedExt, setSelectedExt] = useState<FireExtinguisher | null>(null);

  // Modal display
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showMaintModal, setShowMaintModal] = useState(false);

  // Form states
  const [addForm, setAddForm] = useState({
    serialNumber: "",
    building: "Building A",
    location: "",
    type: "Dry Chemical" as ExtinguisherType,
    size: "5 lb" as ExtinguisherSize,
    installationDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // default 5 years out
  });

  const [editForm, setEditForm] = useState({
    id: "",
    serialNumber: "",
    building: "",
    location: "",
    type: "Dry Chemical" as ExtinguisherType,
    size: "5 lb" as ExtinguisherSize,
    installationDate: "",
    expiryDate: "",
    status: "ACTIVE" as any,
  });

  const [scheduleForm, setScheduleForm] = useState({
    extinguisherId: "",
    inspectionDate: new Date().toISOString().split("T")[0],
    inspectionTime: "10:00",
    inspectorId: inspectors[0]?.id || "",
  });

  const [maintForm, setMaintForm] = useState({
    extinguisherId: "",
    actionTaken: "",
    maintenanceDate: new Date().toISOString().split("T")[0],
    issuesIdentified: "",
    recommendations: "",
    notes: "",
  });

  // Unique list of buildings for filters
  const buildings = Array.from(new Set(extinguishers.map((e) => e.building)));

  // Filtered List
  const filtered = extinguishers.filter((e) => {
    const matchesSearch =
      e.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.building.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === "ALL" || e.type === filterType;
    const matchesStatus = filterStatus === "ALL" || e.status === filterStatus;
    const matchesBuilding = filterBuilding === "ALL" || e.building === filterBuilding;

    return matchesSearch && matchesType && matchesStatus && matchesBuilding;
  });

  // Action wrappers with alerts
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.serialNumber || !addForm.location || !addForm.building) {
      alert("Please fill in all required fields.");
      return;
    }
    const success = await onAddExtinguisher(addForm);
    if (success) {
      setShowAddModal(false);
      setShowAddModalDirectly(false);
      // Reset
      setAddForm({
        serialNumber: "",
        building: "Building A",
        location: "",
        type: "Dry Chemical",
        size: "5 lb",
        installationDate: new Date().toISOString().split("T")[0],
        expiryDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      });
    }
  };

  const handleEditClick = (ext: FireExtinguisher) => {
    setEditForm({
      id: ext.id,
      serialNumber: ext.serialNumber,
      building: ext.building,
      location: ext.location,
      type: ext.type,
      size: ext.size,
      installationDate: ext.installationDate,
      expiryDate: ext.expiryDate,
      status: ext.status,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onUpdateExtinguisher(editForm.id, editForm);
    if (success) {
      setShowEditModal(false);
      if (selectedExt?.id === editForm.id) {
        setSelectedExt({ ...selectedExt, ...editForm });
      }
    }
  };

  const handleDeleteClick = async (id: string, serial: string) => {
    if (confirm(`Are you absolutely sure you want to remove fire extinguisher ${serial} from registered service logs?`)) {
      const success = await onDeleteExtinguisher(id);
      if (success && selectedExt?.id === id) {
        setSelectedExt(null);
      }
    }
  };

  const handleOpenScheduleModal = (ext: FireExtinguisher) => {
    setScheduleForm({
      extinguisherId: ext.id,
      inspectionDate: new Date().toISOString().split("T")[0],
      inspectionTime: "10:00",
      inspectorId: inspectors[0]?.id || "",
    });
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onScheduleInspection(scheduleForm);
    if (success) {
      setShowScheduleModal(false);
      setShowScheduleModalDirectly(false);
    }
  };

  const handleOpenMaintModal = (ext: FireExtinguisher) => {
    setMaintForm({
      extinguisherId: ext.id,
      actionTaken: "",
      maintenanceDate: new Date().toISOString().split("T")[0],
      issuesIdentified: "",
      recommendations: "",
      notes: "",
    });
    setShowMaintModal(true);
  };

  const handleMaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onLogMaintenance(maintForm);
    if (success) {
      setShowMaintModal(false);
      setShowMaintModalDirectly(false);
    }
  };

  // Status Badges Styling Utility
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">ACTIVE</span>;
      case "OVERDUE":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono tracking-wide bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">OVERDUE</span>;
      case "NEED_MAINTENANCE":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono tracking-wide bg-amber-100 text-amber-800 border border-amber-300">MAINT REQ</span>;
      case "EXPIRED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono tracking-wide bg-rose-50 text-rose-700 border border-rose-200">EXPIRED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header operations bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-slate-950">Regional Fire Extinguishers</h3>
          <p className="text-xs text-slate-500">Inventory assets registry and real-time maintenance states</p>
        </div>

        {currentUser.role === "ADMIN" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus size={16} /> Register Fire Extinguisher
          </button>
        )}
      </div>

      {/* Grid: 3 Cols filter/search lists, 1 Col side detail drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main List Section (left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search serial numbers, buildings, or specific locations..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium border border-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-slate-50/60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter selectors row */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-50">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1 font-mono">
                <Filter size={10} /> filter by:
              </span>

              {/* Type dropdown */}
              <select
                className="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-semibold bg-white text-slate-700 hover:bg-slate-50"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="ALL">All Types</option>
                <option value="Water">Water</option>
                <option value="CO2">CO₂</option>
                <option value="Foam">Foam</option>
                <option value="Dry Chemical">Dry Chemical</option>
              </select>

              {/* Status dropdown */}
              <select
                className="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-semibold bg-white text-slate-700 hover:bg-slate-50"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="OVERDUE">Overdue</option>
                <option value="NEED_MAINTENANCE">Needs Maintenance</option>
                <option value="EXPIRED">Expired</option>
              </select>

              {/* Building dropdown */}
              <select
                className="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-semibold bg-white text-slate-700 hover:bg-slate-50"
                value={filterBuilding}
                onChange={(e) => setFilterBuilding(e.target.value)}
              >
                <option value="ALL">All Buildings</option>
                {buildings.map((bl) => (
                  <option key={bl} value={bl}>
                    {bl}
                  </option>
                ))}
              </select>

              {/* Reset active button */}
              {(filterType !== "ALL" || filterStatus !== "ALL" || filterBuilding !== "ALL") && (
                <button
                  onClick={() => {
                    setFilterType("ALL");
                    setFilterStatus("ALL");
                    setFilterBuilding("ALL");
                  }}
                  className="px-2 py-1 text-[10px] font-bold text-orange-600 hover:bg-orange-50 rounded"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Core Table List */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 font-mono">
                    <th className="py-3 px-4">Serial Number</th>
                    <th className="py-3 px-4">Deployment Area</th>
                    <th className="py-3 px-4">Specification</th>
                    <th className="py-3 px-4">Safety Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">
                        <div className="space-y-1.5">
                          <AlertOctagon className="mx-auto text-slate-300" size={32} />
                          <h5 className="font-bold">No assets found matching filters</h5>
                          <p className="text-[11px] text-slate-400">Try loosening your search terms or filter settings</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((ext) => {
                      const isSel = selectedExt?.id === ext.id;
                      return (
                        <tr
                          key={ext.id}
                          className={`hover:bg-slate-50/60 transition-colors cursor-pointer ${
                            isSel ? "bg-orange-50/40 border-l-2 border-l-orange-500" : ""
                          }`}
                          onClick={() => setSelectedExt(ext)}
                        >
                          {/* Serial */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-950 font-mono">{ext.serialNumber}</span>
                          </td>
                          {/* Location */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <span className="font-semibold text-slate-800">{ext.building}</span>
                              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Building size={10} /> {ext.location}
                              </p>
                            </div>
                          </td>
                          {/* Spec */}
                          <td className="py-3.5 px-4 text-slate-600">
                            <div className="space-y-0.5">
                              <span className="font-bold font-mono text-[10px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">
                                {ext.type}
                              </span>
                              <p className="text-[11px] text-slate-500 font-mono">Size: {ext.size}</p>
                            </div>
                          </td>
                          {/* Status */}
                          <td className="py-3.5 px-4">{getStatusBadge(ext.status)}</td>
                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenScheduleModal(ext)}
                                title="Schedule Inspection"
                                className="p-1.5 bg-slate-50 rounded-lg text-slate-700 hover:bg-slate-200 transition"
                              >
                                <Calendar size={13} />
                              </button>
                              
                              {(currentUser.role === "ADMIN" || currentUser.role === "INSPECTOR") && (
                                <button
                                  onClick={() => handleOpenMaintModal(ext)}
                                  title="Log Maintenance"
                                  className="p-1.5 bg-slate-50 rounded-lg text-slate-700 hover:bg-slate-200 transition"
                                >
                                  <Wrench size={13} />
                                </button>
                              )}

                              {(currentUser.role === "ADMIN" || currentUser.role === "INSPECTOR") && (
                                <button
                                  onClick={() => handleEditClick(ext)}
                                  title="Edit Extinguisher Record"
                                  className="p-1.5 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition"
                                >
                                  <Edit3 size={13} />
                                </button>
                              )}

                              {currentUser.role === "ADMIN" && (
                                <button
                                  onClick={() => handleDeleteClick(ext.id, ext.serialNumber)}
                                  title="Delete Record"
                                  className="p-1.5 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Details Drawer/Panel (right 1 col) */}
        <div>
          {selectedExt ? (
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-5 sticky top-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[9px] uppercase font-bold text-orange-600 font-mono tracking-widest leading-none">
                    Asset Details
                  </span>
                  <h4 className="text-base font-extrabold text-slate-950 font-mono leading-tight">
                    {selectedExt.serialNumber}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedExt(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded bg-slate-50"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Specs Stack */}
              <div className="space-y-3.5 text-xs">
                {/* Deployment */}
                <div className="flex gap-2">
                  <Pin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-500 uppercase font-mono text-[9px] tracking-wide">
                      Installation Area
                    </h5>
                    <p className="font-semibold text-slate-850">
                      {selectedExt.building}, {selectedExt.location}
                    </p>
                  </div>
                </div>

                {/* Specs */}
                <div className="flex gap-2">
                  <Layers size={15} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-500 uppercase font-mono text-[9px] tracking-wide">
                      Safety Class & Size
                    </h5>
                    <p className="font-semibold text-slate-850">
                      {selectedExt.type} Class - {selectedExt.size} Capacity
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex gap-2">
                  <Clock size={15} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-500 uppercase font-mono text-[9px] tracking-wide">
                      Service Lifecycle
                    </h5>
                    <p className="font-medium text-slate-700">
                      Installed: <span className="font-bold text-slate-900">{selectedExt.installationDate}</span>
                    </p>
                    <p className="font-medium text-slate-700">
                      Expiration: <span className="font-bold text-rose-600">{selectedExt.expiryDate}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* History Subsections */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1">
                  <History size={11} /> Service Loops History
                </h5>

                {/* Complete History Timeline */}
                <div className="space-y-3.5 text-xs">
                  {/* Inspections */}
                  <div>
                    <h6 className="font-bold text-slate-800 mb-1">Checklists:</h6>
                    {inspections.filter((i) => i.extinguisherId === selectedExt.id).length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">No scheduled inspection history.</p>
                    ) : (
                      <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                        {inspections
                          .filter((i) => i.extinguisherId === selectedExt.id)
                          .map((ins) => (
                            <div key={ins.id} className="p-2 bg-slate-50 rounded border border-slate-100 text-[11px] space-y-1">
                              <div className="flex justify-between font-semibold">
                                <span className="text-slate-850">{ins.inspectionDate}</span>
                                <span className={ins.status === "COMPLETED" ? "text-emerald-600" : "text-amber-600 font-bold"}>
                                  {ins.status}
                                </span>
                              </div>
                              {ins.notes && <p className="text-slate-500 italic">"{ins.notes}"</p>}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Maintenance */}
                  <div>
                    <h6 className="font-bold text-slate-800 mb-1">Maintenance interventions:</h6>
                    {maintenance.filter((m) => m.extinguisherId === selectedExt.id).length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">No historical service actions logged.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {maintenance
                          .filter((m) => m.extinguisherId === selectedExt.id)
                          .map((log) => (
                            <div key={log.id} className="p-2 bg-orange-50/40 rounded border border-orange-100 text-[11px] space-y-1">
                              <div className="flex justify-between font-bold text-orange-950">
                                <span>{log.maintenanceDate}</span>
                                <span>REPAIR</span>
                              </div>
                              <p className="text-slate-700">{log.actionTaken}</p>
                              {log.issuesIdentified && (
                                <p className="text-slate-500 text-[10px]">Issue: {log.issuesIdentified}</p>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200 text-center text-slate-500 py-16">
              <Building className="mx-auto text-slate-300 mb-2" size={32} />
              <h5 className="font-bold text-slate-700">No Asset Selected</h5>
              <p className="text-[11px] text-slate-400 max-w-[180px] mx-auto mt-1">
                Select an extinguisher from the table roster to inspect localized blueprints and active safety histories
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ==========================================================
          MODALS START HERE
          ========================================================== */}

      {/* 1. Register Extinguisher Modal */}
      {(showAddModal || showAddModalDirectly) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-slate-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-950 p-5 text-white flex justify-between items-center">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider font-mono text-orange-400">Roster Setup</h4>
                <h3 className="text-lg font-bold">Register Fire Extinguisher</h3>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowAddModalDirectly(false);
                }}
                className="p-1 text-slate-400 hover:text-white rounded bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              {/* Serial Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Serial Number (*)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FE-2026-XXXX"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-orange-500 bg-slate-50"
                  value={addForm.serialNumber}
                  onChange={(e) => setAddForm({ ...addForm, serialNumber: e.target.value })}
                />
              </div>

              {/* Building & Location Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Building (*)</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                    value={addForm.building}
                    onChange={(e) => setAddForm({ ...addForm, building: e.target.value })}
                  >
                    <option value="Building A">Building A</option>
                    <option value="Building B">Building B</option>
                    <option value="Building C">Building C</option>
                    <option value="Building D">Building D</option>
                    <option value="Main Tech Center">Main Tech Center</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Location (*)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lobby Left Wall"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-orange-500 bg-slate-50"
                    value={addForm.location}
                    onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
                  />
                </div>
              </div>

              {/* Type and Size Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Extinguisher Type</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                    value={addForm.type}
                    onChange={(e) => setAddForm({ ...addForm, type: e.target.value as ExtinguisherType })}
                  >
                    <option value="Water">Water Class A</option>
                    <option value="CO2">CO₂ Class B/C</option>
                    <option value="Foam">Foam Class A/B</option>
                    <option value="Dry Chemical">Dry Chemical A/B/C</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Cylinder Size</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                    value={addForm.size}
                    onChange={(e) => setAddForm({ ...addForm, size: e.target.value as ExtinguisherSize })}
                  >
                    <option value="2.5 lb">2.5 lb</option>
                    <option value="5 lb">5.5 lb (5 lb)</option>
                    <option value="9 lb">9.0 lb (9 lb)</option>
                    <option value="12 lb">12.0 lb (12 lb)</option>
                  </select>
                </div>
              </div>

              {/* Install and Expiry dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Installation Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-orange-500 bg-slate-50"
                    value={addForm.installationDate}
                    onChange={(e) => setAddForm({ ...addForm, installationDate: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Expiry Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-orange-500 bg-slate-50"
                    value={addForm.expiryDate}
                    onChange={(e) => setAddForm({ ...addForm, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition shadow-sm"
              >
                Complete Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Extinguisher Record Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-slate-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-950 p-5 text-white flex justify-between items-center">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider font-mono text-orange-400">Inventory Mod</h4>
                <h3 className="text-lg font-bold">Edit Extinguisher Parameters</h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {/* Serial Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Serial Number (*)</label>
                <input
                  type="text"
                  required
                  placeholder="FE-XXXX"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-orange-500 bg-slate-50"
                  value={editForm.serialNumber}
                  onChange={(e) => setEditForm({ ...editForm, serialNumber: e.target.value })}
                />
              </div>

              {/* Building & Location Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Building</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-orange-500 bg-slate-50"
                    value={editForm.building}
                    onChange={(e) => setEditForm({ ...editForm, building: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Location</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-orange-500 bg-slate-50"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  />
                </div>
              </div>

              {/* Type & Size */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Extinguisher Type</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as ExtinguisherType })}
                  >
                    <option value="Water">Water</option>
                    <option value="CO2">CO₂</option>
                    <option value="Foam">Foam</option>
                    <option value="Dry Chemical">Dry Chemical</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Cylinder Size</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                    value={editForm.size}
                    onChange={(e) => setEditForm({ ...editForm, size: e.target.value as ExtinguisherSize })}
                  >
                    <option value="2.5 lb">2.5 lb</option>
                    <option value="5 lb">5 lb</option>
                    <option value="9 lb">9 lb</option>
                    <option value="12 lb">12 lb</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Installation</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50"
                    value={editForm.installationDate}
                    onChange={(e) => setEditForm({ ...editForm, installationDate: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Safety Expiration</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50"
                    value={editForm.expiryDate}
                    onChange={(e) => setEditForm({ ...editForm, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Status override options */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Primary Status Override</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                >
                  <option value="ACTIVE">ACTIVE (Fully Operational)</option>
                  <option value="OVERDUE">OVERDUE (Inspection Missed)</option>
                  <option value="NEED_MAINTENANCE">NEED_MAINTENANCE (Repair Logs Scheduled)</option>
                  <option value="EXPIRED">EXPIRED (Lifecycle Exceeded)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition"
              >
                Save Record Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Schedule Inspection Modal */}
      {(showScheduleModal || showScheduleModalDirectly) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-slate-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-950 p-5 text-white flex justify-between items-center">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider font-mono text-orange-400">Compliance Scheduling</h4>
                <h3 className="text-lg font-bold">Schedule Extinguisher Inspection</h3>
              </div>
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setShowScheduleModalDirectly(false);
                }}
                className="p-1 text-slate-400 hover:text-white rounded bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
              
              {/* Select Extinguisher if direct scheduling */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Fire Extinguisher (*)</label>
                {scheduleForm.extinguisherId ? (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium">
                    <p className="font-bold text-slate-900 font-mono">
                      {extinguishers.find((e) => e.id === scheduleForm.extinguisherId)?.serialNumber || "Loading..."}
                    </p>
                    <p className="text-slate-500 font-medium">
                      {extinguishers.find((e) => e.id === scheduleForm.extinguisherId)?.building} - {extinguishers.find((e) => e.id === scheduleForm.extinguisherId)?.location}
                    </p>
                  </div>
                ) : (
                  <select
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                    value={scheduleForm.extinguisherId}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, extinguisherId: e.target.value })}
                  >
                    <option value="">-- Choose Cylinder --</option>
                    {extinguishers.map((ext) => (
                      <option key={ext.id} value={ext.id}>
                        {ext.serialNumber} - {ext.building} ({ext.location})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Inspection Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50"
                    value={scheduleForm.inspectionDate}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, inspectionDate: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Inspection Time</label>
                  <input
                    type="time"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50"
                    value={scheduleForm.inspectionTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, inspectionTime: e.target.value })}
                  />
                </div>
              </div>

              {/* Assinee Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Assign Inspector (*)</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                  value={scheduleForm.inspectorId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, inspectorId: e.target.value })}
                >
                  <option value="">-- Assigner --</option>
                  {inspectors.map((ins) => (
                    <option key={ins.id} value={ins.id}>
                      {ins.firstName} {ins.lastName} ({ins.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 text-blue-900 rounded-xl text-[11px] leading-relaxed">
                <strong>System Dispatch Trigger:</strong> TZW LTD Automated Dispatcher will distribute real-time alerts to the assigned inspector's dashboard instantly upon submission.
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition shadow-sm"
              >
                Schedule & Notify Personnel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Log Maintenance Activity Modal */}
      {(showMaintModal || showMaintModalDirectly) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-slate-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-950 p-5 text-white flex justify-between items-center">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider font-mono text-orange-400">Service Logging</h4>
                <h3 className="text-lg font-bold">Record Maintenance Intervention</h3>
              </div>
              <button
                onClick={() => {
                  setShowMaintModal(false);
                  setShowMaintModalDirectly(false);
                }}
                className="p-1 text-slate-400 hover:text-white rounded bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleMaintSubmit} className="p-6 space-y-3.5">
              
              {/* Select Extinguisher */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Target Extinguisher</label>
                {maintForm.extinguisherId ? (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium">
                    <p className="font-bold text-slate-900 font-mono">
                      {extinguishers.find((e) => e.id === maintForm.extinguisherId)?.serialNumber || "Loading..."}
                    </p>
                    <p className="text-slate-500 font-medium">
                      {extinguishers.find((e) => e.id === maintForm.extinguisherId)?.building} - {extinguishers.find((e) => e.id === maintForm.extinguisherId)?.location}
                    </p>
                  </div>
                ) : (
                  <select
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                    value={maintForm.extinguisherId}
                    onChange={(e) => setMaintForm({ ...maintForm, extinguisherId: e.target.value })}
                  >
                    <option value="">-- Select Cylinder Cylinder --</option>
                    {extinguishers.map((ext) => (
                      <option key={ext.id} value={ext.id}>
                        {ext.serialNumber} - {ext.building} ({ext.location})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Date of maintenance & Issues identified */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Service Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50"
                    value={maintForm.maintenanceDate}
                    onChange={(e) => setMaintForm({ ...maintForm, maintenanceDate: e.target.value })}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Issues Identified (*)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Broken nozzle, gauge zeroed out"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-slate-50 focus:ring-1 focus:ring-orange-500"
                    value={maintForm.issuesIdentified}
                    onChange={(e) => setMaintForm({ ...maintForm, issuesIdentified: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Taken */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Action Taken (*)</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe repair efforts and components swapped (e.g. fully recharged and swapped cracked valve seal)..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-slate-50 focus:ring-1 focus:ring-orange-500"
                  value={maintForm.actionTaken}
                  onChange={(e) => setMaintForm({ ...maintForm, actionTaken: e.target.value })}
                />
              </div>

              {/* Recommendations and Notes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Recommendations</label>
                  <input
                    type="text"
                    placeholder="e.g. Schedule visual check in 30 days"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-slate-50"
                    value={maintForm.recommendations}
                    onChange={(e) => setMaintForm({ ...maintForm, recommendations: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">General Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Standard compliance check OK"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-slate-50"
                    value={maintForm.notes}
                    onChange={(e) => setMaintForm({ ...maintForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-100 text-amber-950 rounded-xl text-[10px] leading-relaxed flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Post-log action:</strong> Writing this log will automatically advance the target fire extinguisher's status back to <strong>ACTIVE (Fully Compliant)</strong>.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition"
              >
                Log Service Work Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
