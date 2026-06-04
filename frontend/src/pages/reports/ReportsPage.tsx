import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { reportsApi } from '../../api/reports';
import { getErrorMessage } from '../../api/client';

const ReportsPage: React.FC = () => {
  const [summary, setSummary] = useState<Record<string, number> | null>(null);
  const [extStats, setExtStats] = useState<unknown>(null);
  const [inspStats, setInspStats] = useState<unknown>(null);
  const [maintStats, setMaintStats] = useState<unknown>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [s, e, i, m] = await Promise.all([
          reportsApi.summary(),
          reportsApi.extinguisherStats(),
          reportsApi.inspectionStats(),
          reportsApi.maintenanceStats()
        ]);
        setSummary(s.data.data as Record<string, number>);
        setExtStats(e.data.data);
        setInspStats(i.data.data);
        setMaintStats(m.data.data);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };
    load();
  }, []);

  const exportCsv = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Extinguishers', String(summary?.extinguishers ?? 0)],
      ['Inspections', String(summary?.inspections ?? 0)],
      ['Maintenance Logs', String(summary?.maintenanceLogs ?? 0)]
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tzw-report-summary.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Real-time inventory, inspection, compliance, and maintenance analytics"
        action={
          <button
            type="button"
            onClick={exportCsv}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50"
          >
            Export CSV
          </button>
        }
      />
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {summary &&
          Object.entries(summary).map(([key, val]) => (
            <div key={key} className="bg-white rounded-2xl border p-5 shadow-sm">
              <p className="text-sm text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
              <p className="text-3xl font-bold text-[#A02000] mt-1">{val}</p>
            </div>
          ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { title: 'Inventory / Extinguishers', data: extStats },
          { title: 'Inspections', data: inspStats },
          { title: 'Maintenance', data: maintStats }
        ].map(({ title, data }) => (
          <div key={title} className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-3">{title}</h3>
            <pre className="text-xs text-slate-600 overflow-auto max-h-64 bg-slate-50 p-3 rounded-lg">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
