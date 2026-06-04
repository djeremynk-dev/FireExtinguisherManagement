import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import { extinguishersApi } from '../../api/extinguishers';
import { getErrorMessage } from '../../api/client';
import type { ExtinguisherSize, ExtinguisherStatus, ExtinguisherType } from '../../types';

const defaultForm = {
  serialNumber: '',
  location: '',
  type: 'DRY_CHEMICAL' as ExtinguisherType,
  size: 'LB_5' as ExtinguisherSize,
  installationDate: '',
  expiryDate: '',
  status: 'ACTIVE' as ExtinguisherStatus,
  notes: ''
};

const ExtinguisherFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    extinguishersApi.get(id).then((res) => {
      const d = res.data.data;
      if (d) {
        setForm({
          serialNumber: d.serialNumber,
          location: d.location,
          type: d.type,
          size: d.size,
          installationDate: d.installationDate.slice(0, 10),
          expiryDate: d.expiryDate.slice(0, 10),
          status: d.status,
          notes: d.notes || ''
        });
      }
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit && id) {
        await extinguishersApi.update(id, form);
      } else {
        await extinguishersApi.create(form);
      }
      navigate('/extinguishers');
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
        title={isEdit ? 'Edit Extinguisher' : 'Register Extinguisher'}
        subtitle="Enter equipment details for tracking and compliance"
      />
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 max-w-2xl space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase">Serial Number *</label>
          <input
            className={inputClass}
            value={form.serialNumber}
            onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
            required
            disabled={isEdit}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase">Location *</label>
          <input
            className={inputClass}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase">Type</label>
            <select
              className={inputClass}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ExtinguisherType })}
            >
              <option value="WATER">Water</option>
              <option value="CO2">CO₂</option>
              <option value="FOAM">Foam</option>
              <option value="DRY_CHEMICAL">Dry Chemical</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase">Size</label>
            <select
              className={inputClass}
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value as ExtinguisherSize })}
            >
              <option value="LB_2_5">2.5 lb</option>
              <option value="LB_5">5 lb</option>
              <option value="LB_9">9 lb</option>
              <option value="LB_12">12 lb</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase">Installation Date</label>
            <input
              type="date"
              className={inputClass}
              value={form.installationDate}
              onChange={(e) => setForm({ ...form, installationDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase">Expiry Date</label>
            <input
              type="date"
              className={inputClass}
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              required
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase">Status</label>
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ExtinguisherStatus })}
          >
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="NEEDS_INSPECTION">Needs Inspection</option>
            <option value="UNDER_MAINTENANCE">Under Maintenance</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>
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
          className="w-full sm:w-auto px-6 py-3 bg-[#A02000] text-white font-bold rounded-xl disabled:opacity-70"
        >
          {loading ? 'Saving...' : isEdit ? 'Update' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default ExtinguisherFormPage;
