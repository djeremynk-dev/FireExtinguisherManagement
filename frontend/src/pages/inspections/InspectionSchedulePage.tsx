import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { inspectionsApi } from '../../api/inspections';
import { extinguishersApi } from '../../api/extinguishers';
import { getErrorMessage } from '../../api/client';
import type { FireExtinguisher } from '../../types';

const InspectionSchedulePage: React.FC = () => {
  const [extinguishers, setExtinguishers] = useState<FireExtinguisher[]>([]);
  const [form, setForm] = useState({
    extinguisherId: '',
    scheduledDate: '',
    scheduledTime: '09:00',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    extinguishersApi.list().then((res) => setExtinguishers(res.data.data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await inspectionsApi.schedule(form);
      setSuccess('Inspection scheduled successfully. Relevant personnel will be notified.');
      setForm({ extinguisherId: '', scheduledDate: '', scheduledTime: '09:00', notes: '' });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#A02000]/20 focus:border-[#A02000] outline-none';

  return (
    <div>
      <PageHeader
        title="Schedule Inspection"
        subtitle="Select equipment, date, and time for the next inspection"
      />
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-700 text-sm mb-4 bg-green-50 px-3 py-2 rounded-lg">{success}</p>}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 max-w-xl space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase">Fire Extinguisher *</label>
          <select
            className={inputClass}
            value={form.extinguisherId}
            onChange={(e) => setForm({ ...form, extinguisherId: e.target.value })}
            required
          >
            <option value="">Select extinguisher</option>
            {extinguishers.map((e) => (
              <option key={e.id} value={e.id}>
                {e.serialNumber} — {e.location}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase">Inspection Date *</label>
            <input
              type="date"
              className={inputClass}
              value={form.scheduledDate}
              onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase">Inspection Time *</label>
            <input
              type="time"
              className={inputClass}
              value={form.scheduledTime}
              onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
              required
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase">Notes</label>
          <textarea
            className={inputClass}
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#A02000] text-white font-bold rounded-xl disabled:opacity-70"
        >
          {loading ? 'Scheduling...' : 'Schedule Inspection'}
        </button>
      </form>
    </div>
  );
};

export default InspectionSchedulePage;
