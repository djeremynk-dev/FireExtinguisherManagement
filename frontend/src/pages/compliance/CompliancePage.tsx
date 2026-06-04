import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { extinguishersApi } from '../../api/extinguishers';
import type { FireExtinguisher } from '../../types';
import { statusColor } from '../../utils/labels';

const CompliancePage: React.FC = () => {
  const [items, setItems] = useState<FireExtinguisher[]>([]);

  useEffect(() => {
    extinguishersApi.list().then((res) => setItems(res.data.data || []));
  }, []);

  const now = new Date();
  const in30 = new Date();
  in30.setDate(now.getDate() + 30);

  const expired = items.filter((e) => e.status === 'EXPIRED' || new Date(e.expiryDate) < now);
  const upcoming = items.filter((e) => {
    const exp = new Date(e.expiryDate);
    return exp >= now && exp <= in30;
  });
  const compliant = items.filter(
    (e) => e.status === 'ACTIVE' && new Date(e.expiryDate) > in30
  );

  const Section = ({
    title,
    data,
    empty
  }: {
    title: string;
    data: FireExtinguisher[];
    empty: string;
  }) => (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-4">{title} ({data.length})</h3>
      <ul className="space-y-2">
        {data.map((e) => (
          <li key={e.id} className="flex flex-wrap justify-between gap-2 text-sm border-b border-slate-50 pb-2">
            <span className="font-medium">{e.serialNumber}</span>
            <span className="text-slate-500">{e.location}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor[e.status]}`}>
              Expires {new Date(e.expiryDate).toLocaleDateString()}
            </span>
          </li>
        ))}
        {!data.length && <p className="text-sm text-slate-500">{empty}</p>}
      </ul>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Compliance Monitoring"
        subtitle="Track expired units, upcoming expirations, and compliance status"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Section title="Expired" data={expired} empty="No expired extinguishers." />
        <Section title="Upcoming Expirations (30 days)" data={upcoming} empty="No upcoming expirations." />
        <Section title="Compliant" data={compliant} empty="No compliant records loaded." />
      </div>
    </div>
  );
};

export default CompliancePage;
