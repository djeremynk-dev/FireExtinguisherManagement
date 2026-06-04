import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Calendar, Wrench, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import { extinguishersApi } from '../../api/extinguishers';
import { inspectionsApi } from '../../api/inspections';
import { reportsApi } from '../../api/reports';
import { useAuth } from '../../context/AuthContext';
import type { FireExtinguisher, Inspection } from '../../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [extinguishers, setExtinguishers] = useState<FireExtinguisher[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [summary, setSummary] = useState({ extinguishers: 0, inspections: 0, maintenanceLogs: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [extRes, inspRes] = await Promise.all([
          extinguishersApi.list(),
          inspectionsApi.list()
        ]);
        setExtinguishers(extRes.data.data || []);
        setInspections(inspRes.data.data || []);
      } catch {
        /* dashboard still renders with zeros */
      }
      try {
        const rep = await reportsApi.summary();
        if (rep.data.data) setSummary(rep.data.data);
      } catch {
        /* optional for roles without report access */
      }
    };
    load();
  }, []);

  const expired = extinguishers.filter((e) => e.status === 'EXPIRED').length;
  const pendingInspections = inspections.filter((i) =>
    ['SCHEDULED', 'OVERDUE', 'IN_PROGRESS'].includes(i.status)
  ).length;

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.firstName}`}
        subtitle="Overview of your fire safety operations"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Extinguishers" value={extinguishers.length || summary.extinguishers} icon={Flame} />
        <StatCard label="Pending Inspections" value={pendingInspections} icon={Calendar} />
        <StatCard label="Maintenance Logs" value={summary.maintenanceLogs} icon={Wrench} />
        <StatCard label="Expired Units" value={expired} icon={AlertTriangle} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/extinguishers/new"
              className="px-4 py-2 bg-[#A02000] text-white text-sm font-semibold rounded-xl hover:bg-[#8B1A00]"
            >
              Register Extinguisher
            </Link>
            <Link
              to="/inspections/schedule"
              className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
            >
              Schedule Inspection
            </Link>
            <Link
              to="/reports"
              className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
            >
              View Reports
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Recent Extinguishers</h3>
          <ul className="space-y-3">
            {extinguishers.slice(0, 5).map((e) => (
              <li key={e.id} className="flex justify-between text-sm border-b border-slate-50 pb-2">
                <span className="font-medium text-slate-800">{e.serialNumber}</span>
                <span className="text-slate-500">{e.location}</span>
              </li>
            ))}
            {!extinguishers.length && (
              <p className="text-sm text-slate-500">No extinguishers registered yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
