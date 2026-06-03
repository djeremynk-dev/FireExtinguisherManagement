import React from "react";
import {
  FileText,
  Download,
  Printer,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { ReportStats, FireExtinguisher, Inspection, MaintenanceLog } from "../types";

interface ReportViewProps {
  stats: ReportStats | null;
  extinguishers: FireExtinguisher[];
  inspections: Inspection[];
  maintenance: MaintenanceLog[];
}

export default function ReportView({
  stats,
  extinguishers,
  inspections,
  maintenance,
}: ReportViewProps) {
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // ----------------------------------------------------
  // True CSV Export Functionality
  // ----------------------------------------------------
  const downloadInventoryCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Serial Number,Building,Location,Type,Size,Installation Date,Expiry Date,Status\n";
    
    extinguishers.forEach((e) => {
      const row = [
        e.id,
        e.serialNumber,
        `"${e.building}"`,
        `"${e.location}"`,
        e.type,
        e.size,
        e.installationDate,
        e.expiryDate,
        e.status
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TZW_Fire_Extinguisher_Inventory_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadInspectionsCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Extinguisher Serial,Building,Scheduled Date,Scheduled Time,Inspector,Status,Notes\n";

    inspections.forEach((ins) => {
      const row = [
        ins.id,
        ins.extinguisher?.serialNumber || ins.extinguisherId,
        `"${ins.extinguisher?.building || "Unknown"}"`,
        ins.inspectionDate,
        ins.inspectionTime,
        `"${ins.inspector?.name || "Marcus Chen"}"`,
        ins.status,
        `"${(ins.notes || "").replace(/"/g, '""')}"`
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TZW_Compliance_Inspections_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ----------------------------------------------------
  // Beautiful PDF Trigger using custom print layout template with brand Red
  // ----------------------------------------------------
  const handlePrintPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to export the PDF print view");
      return;
    }

    const todayDate = new Date().toISOString().split("T")[0];

    printWindow.document.write(`
      <html>
        <head>
          <title>TZW LTD - Fire Safety Compliance Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; padding: 40px; }
            .header { border-bottom: 3px solid #dc2626; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
            .logo { font-size: 24px; font-weight: 800; color: #0f172a; }
            .logo span { color: #dc2626; }
            .date { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; text-align: right; }
            h1 { font-size: 22px; margin: 0; color: #0f172a; }
            h2 { font-size: 15px; text-transform: uppercase; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; color: #475569; }
            .grid { display: grid; grid-template-cols: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
            .card { background: #f8fafc; border: 1px solid #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; }
            .card .num { font-size: 24px; font-weight: 800; color: #dc2626; }
            .card .label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
            th { background: #f1f5f9; text-transform: uppercase; font-weight: 700; color: #475569; border-bottom: 1px solid #cbd5e0; padding: 10px; text-align: left; }
            td { border-bottom: 1px solid #e2e8f0; padding: 10px; color: #334155; }
            .footer { margin-top: 60px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">TZW <span>LTD</span></div>
              <h1>Fire Safety Compliance Audit Report</h1>
            </div>
            <div class="date">
              Generated: ${todayDate}<br/>
              Status: ACTIVE AUDIT
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <div class="num">${stats.inventory.total}</div>
              <div class="label">Total Cylinders</div>
            </div>
            <div class="card">
              <div class="num">${stats.compliance.compliancePercentage}%</div>
              <div class="label">Compliance Score</div>
            </div>
            <div class="card">
              <div class="num">${stats.inspections.overdue}</div>
              <div class="label">Overdue Audits</div>
            </div>
            <div class="card">
              <div class="num">${stats.compliance.expired}</div>
              <div class="label">Expired Equipment</div>
            </div>
          </div>

          <h2>1. Active Equipment Inventory</h2>
          <table>
            <thead>
              <tr>
                <th>Serial Number</th>
                <th>Building / Deployment Side</th>
                <th>Type</th>
                <th>Size</th>
                <th>Expiration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${extinguishers.map(e => `
                <tr>
                  <td><strong>${e.serialNumber}</strong></td>
                  <td>${e.building} - ${e.location}</td>
                  <td>${e.type}</td>
                  <td>${e.size}</td>
                  <td>${e.expiryDate}</td>
                  <td><span style="font-weight:bold; color:${e.status === 'ACTIVE' ? '#10b981' : '#ef4444'}">${e.status}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <h2>2. Compliance Schedulers Log</h2>
          <table>
            <thead>
              <tr>
                <th>Extinguisher</th>
                <th>Assignee</th>
                <th>Safety Check Date</th>
                <th>Time</th>
                <th>Checklist Status</th>
              </tr>
            </thead>
            <tbody>
              ${inspections.map(i => `
                <tr>
                  <td><strong>${i.extinguisher?.serialNumber || i.extinguisherId}</strong></td>
                  <td>${i.inspector?.name || "Marcus Chen"}</td>
                  <td>${i.inspectionDate}</td>
                  <td>${i.inspectionTime}</td>
                  <td><span style="font-weight:bold;">${i.status}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="footer">
            TZW LTD Fire Safety Systems &bull; Licensed Inspections &bull; Compliance Management
          </div>
          <script>
            window.print();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 animate-bento-fade">
      {/* View Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-950 font-sans flex items-center gap-2">
            <FileText size={20} className="text-red-500" /> Compliance Reporting Hub
          </h3>
          <p className="text-xs text-slate-500">Download inventory files, check audits records logs and pull safety reviews</p>
        </div>

        {/* Action button triggers */}
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrintPDF}
            className="flex-1 sm:flex-initial px-4 py-2 bg-slate-950 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer animate-pulse"
          >
            <Printer size={14} /> Print PDF Audit
          </button>
        </div>
      </div>

      {/* Grid rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Quick Downloads panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
          <h4 className="text-xs font-black text-slate-955 uppercase tracking-wider font-mono">1. Download Raw Datasets</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Obtain standard compliant CSV spreadsheets containing complete system entries for external databases importation.
          </p>

          <div className="space-y-2 pt-2">
            {/* Download Button 1 */}
            <button
              onClick={downloadInventoryCSV}
              className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100/75 border border-slate-200 rounded-xl transition flex justify-between items-center text-xs text-slate-800 font-bold group cursor-pointer animate-bento-fade"
            >
              <div className="space-y-0.5">
                <span>Cylinders Inventory DB</span>
                <p className="text-[10px] text-slate-500 font-normal">Includes size, location, and type metrics</p>
              </div>
              <Download size={15} className="text-slate-400 group-hover:text-red-500 transition-colors" />
            </button>

            {/* Download Button 2 */}
            <button
              onClick={downloadInspectionsCSV}
              className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100/75 border border-slate-200 rounded-xl transition flex justify-between items-center text-xs text-slate-800 font-bold group cursor-pointer animate-bento-fade"
            >
              <div className="space-y-0.5">
                <span>Inspections Checklist Logs</span>
                <p className="text-[10px] text-slate-500 font-normal">Audit dates, notes observations details</p>
              </div>
              <Download size={15} className="text-slate-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Right 2 cols: Advanced Visual Reports */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Compliance Status and summaries */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-5">
            <h4 className="text-xs font-black text-slate-955 uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <ShieldCheck size={16} className="text-emerald-500" /> Compliance Index metrics
            </h4>

            {/* Layout parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 text-center space-y-1">
                <span className="text-[9px] uppercase font-bold text-slate-500 font-mono">Current Score</span>
                <h3 className="text-2xl font-black text-slate-955 font-mono">{stats.compliance.compliancePercentage}%</h3>
                <span className="text-[10px] text-emerald-600 font-semibold font-mono">OSHA COMPLIANT</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 text-center space-y-1">
                <span className="text-[9px] uppercase font-bold text-slate-500 font-mono">Expired Items</span>
                <h3 className={`text-2xl font-black font-mono ${stats.compliance.expired > 0 ? "text-red-500" : "text-slate-950"}`}>
                  {stats.compliance.expired}
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">Cylinders needing replace</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 text-center space-y-1">
                <span className="text-[9px] uppercase font-bold text-slate-500 font-mono">Missed Inspections</span>
                <h3 className={`text-2xl font-black font-mono ${stats.inspections.overdue > 0 ? "text-amber-500" : "text-slate-955"}`}>
                  {stats.inspections.overdue}
                </h3>
                <span className="text-[10px] text-slate-500">Overdue checklist files</span>
              </div>
            </div>

            {/* Text analysis brief */}
            <div className="p-3.5 bg-slate-950 text-slate-300 rounded-lg text-xs flex items-center justify-between gap-4 font-mono">
              <span className="text-red-400 font-bold">AUDIT HIGHLIGHTS:</span>
              <span className="text-[11px]">Need maintenance: {stats.compliance.needMaintenance} | Expiring in 12 months: {stats.compliance.upcomingExpirations}</span>
            </div>
          </div>

          {/* Graphical summary */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <BarChart3 size={16} className="text-red-500" /> Maintenance Frequency Breakdown
            </h4>

            {/* List breakdown of maintenance */}
            <div className="space-y-3">
              {extinguishers.slice(0, 4).map((e) => {
                const count = stats.maintenance.frequency[e.id] || 0;
                const pct = Math.max(10, Math.round((count / (stats.maintenance.totalLogs || 1)) * 100));

                return (
                  <div key={e.id} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-slate-700 font-medium font-mono">
                      <span>{e.serialNumber} ({e.building} - {e.location})</span>
                      <span className="text-slate-950 font-bold">{count} service interventions</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/30">
                      <div
                        className="bg-red-500 h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
