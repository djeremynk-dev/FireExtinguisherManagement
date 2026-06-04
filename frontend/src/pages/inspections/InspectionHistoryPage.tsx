import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { inspectionsApi } from '../../api/inspections';
import { getErrorMessage } from '../../api/client';
import type { Inspection } from '../../types';

const InspectionHistoryPage: React.FC = () => {
  const [items, setItems] = useState<Inspection[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inspectionsApi
      .list()
      .then((res) => setItems(res.data.data || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Inspection History" subtitle="View scheduled and completed inspections" />
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Extinguisher ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading &&
                items.map((i) => (
                  <tr key={i.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-mono text-xs">{i.extinguisherId.slice(0, 8)}…</td>
                    <td className="px-4 py-3">{new Date(i.scheduledDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{i.scheduledTime}</td>
                    <td className="px-4 py-3">{i.status}</td>
                    <td className="px-4 py-3">{i.outcome}</td>
                  </tr>
                ))}
              {!loading && !items.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No inspections yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InspectionHistoryPage;
