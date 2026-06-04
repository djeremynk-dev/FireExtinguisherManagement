import React from 'react';
import type { LucideIcon } from 'lucide-react';

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: string;
};

const StatCard: React.FC<Props> = ({ label, value, icon: Icon, accent = 'text-[#A02000]' }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-red-50 ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

export default StatCard;
