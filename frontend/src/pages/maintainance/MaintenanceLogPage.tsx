import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { maintenanceApi } from '../../api/maintenance';
import { extinguishersApi } from '../../api/extinguishers';
import { getErrorMessage } from '../../api/client';
import type { FireExtinguisher, MaintenanceLog } from '../../types';

const MaintenanceLogPage: React.FC = () => {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [extinguishers, setExtinguishers] = useState<FireExtinguisher[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    extinguisherId: '',
    maintenanceType: 'Routine Service',
    serviceDate: '',
    details: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    maintenanceApi.list().then((res) => setLogs(res.data.data || []));
    extinguishersApi.list().then((res) => setExtinguishers(res.data.data || []));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await maintenanceApi.create(form);
      setShowForm(false);
      setForm({
        extinguisherId: '',
        maintenanceType: 'Routine Service',
        serviceDate: '',
        details: '',
        notes: ''
      });
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#A02000]/20 outline-none';

  return (
    <div>
      <PageHeader
        title="Maintenance Logs"
        subtitle="Record actions taken, issues identified, and recommendations"
        action={
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-[#A02000] text-white text-sm font-semibold rounded-xl"
          >
            {showForm ? 'Cancel' : 'Log Maintenance'}
          </button>
        }
      />
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 mb-6 max-w-xl space-y-4">
          <select
            className={inputClass}
            value={form.extinguisherId}
            onChange={(e) => setForm({ ...form, extinguisherId: e.target.value })}
            required
          >
            <option value="">Select extinguisher</option>
            {extinguishers.map((e) => (
              <option key={e.id} value={e.id}>
                {e.serialNumber}
              </option>
            ))}
          </select>
          <input
            className={inputClass}
            placeholder="Action taken / maintenance type"
            value={form.maintenanceType}
            onChange={(e) => setForm({ ...form, maintenanceType: e.target.value })}
            required
          />
          <input
            type="date"
            className={inputClass}
            value={form.serviceDate}
            onChange={(e) => setForm({ ...form, serviceDate: e.target.value })}
            required
          />
          <textarea
            className={inputClass}
            placeholder="Issues identified and work performed"
            rows={3}
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            required
          />
          <textarea
            className={inputClass}
            placeholder="Notes and recommendations"
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <button type="submit" disabled={loading} className="px-6 py-2 bg-[#A02000] text-white rounded-xl font-bold">
            {loading ? 'Saving...' : 'Save Log'}
          </button>
        </form>
      )}
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex flex-wrap justify-between gap-2 mb-2">
              <span className="font-bold text-slate-900">{log.maintenanceType}</span>
              <span className="text-sm text-slate-500">{new Date(log.serviceDate).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-slate-700">{log.details}</p>
            {log.notes && <p className="text-xs text-slate-500 mt-2">Notes: {log.notes}</p>}
          </div>
        ))}
        {!logs.length && <p className="text-slate-500 text-sm">No maintenance records yet.</p>}
      </div>
    </div>
  );
};

export default MaintenanceLogPage;
