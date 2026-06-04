import React from 'react';

type Props = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

const PageHeader: React.FC<Props> = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default PageHeader;
