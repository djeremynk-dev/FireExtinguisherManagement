import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import { extinguishersApi } from '../../api/extinguishers';
import { getErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import type { FireExtinguisher } from '../../types';
import { extinguisherTypeLabels, extinguisherSizeLabels } from '../../utils/labels';

const ExtinguisherDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [item, setItem] = useState<FireExtinguisher | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    extinguishersApi
      .get(id)
      .then((res) => setItem(res.data.data || null))
      .catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  const handleDelete = async () => {
    if (!id || !confirm('Delete this extinguisher?')) return;
    try {
      await extinguishersApi.remove(id);
      navigate('/extinguishers');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (!item && !error) {
    return <p className="text-slate-500">Loading...</p>;
  }

  return (
    <div>
      <PageHeader
        title={item?.serialNumber || 'Extinguisher'}
        subtitle={item?.location}
        action={
          <div className="flex gap-2">
            {hasRole('ADMIN', 'INSPECTOR') && item && (
              <Link
                to={`/extinguishers/${item.id}/edit`}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold"
              >
                Edit
              </Link>
            )}
            {hasRole('ADMIN') && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold"
              >
                Delete
              </button>
            )}
          </div>
        }
      />
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {item && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Type</p>
            <p className="font-semibold">{extinguisherTypeLabels[item.type]}</p>
          </div>
          <div>
            <p className="text-slate-500">Size</p>
            <p className="font-semibold">{extinguisherSizeLabels[item.size]}</p>
          </div>
          <div>
            <p className="text-slate-500">Installation Date</p>
            <p className="font-semibold">{new Date(item.installationDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-slate-500">Expiry Date</p>
            <p className="font-semibold">{new Date(item.expiryDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-slate-500">Status</p>
            <p className="font-semibold">{item.status.replace(/_/g, ' ')}</p>
          </div>
          {item.notes && (
            <div className="md:col-span-2">
              <p className="text-slate-500">Notes</p>
              <p className="font-semibold">{item.notes}</p>
            </div>
          )}
        </div>
      )}
      <Link to="/extinguishers" className="inline-block mt-6 text-[#A02000] font-semibold text-sm">
        ← Back to list
      </Link>
    </div>
  );
};

export default ExtinguisherDetailsPage;
