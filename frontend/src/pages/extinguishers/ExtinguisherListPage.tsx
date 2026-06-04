import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { extinguishersApi } from '../../api/extinguishers';
import { getErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import type { FireExtinguisher } from '../../types';
import { extinguisherTypeLabels, extinguisherSizeLabels, statusColor } from '../../utils/labels';

const ExtinguisherListPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [items, setItems] = useState<FireExtinguisher[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    extinguishersApi
      .list()
      .then((res) => setItems(res.data.data || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Fire Extinguishers"
        subtitle="Manage inventory across all facilities"
        action={
          hasRole('ADMIN', 'INSPECTOR') ? (
            <Link
              to="/extinguishers/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#A02000] text-white text-sm font-semibold rounded-xl"
            >
              <Plus className="w-4 h-4" />
              Add New
            </Link>
          ) : undefined
        }
      />
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Serial</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3 hidden md:table-cell">Type</th>
                <th className="px-4 py-3 hidden lg:table-cell">Size</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading &&
                items.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{item.serialNumber}</td>
                    <td className="px-4 py-3">{item.location}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {extinguisherTypeLabels[item.type]}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {extinguisherSizeLabels[item.size]}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[item.status]}`}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/extinguishers/${item.id}`} className="text-[#A02000] font-semibold hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              {!loading && !items.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No extinguishers found.
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

export default ExtinguisherListPage;
