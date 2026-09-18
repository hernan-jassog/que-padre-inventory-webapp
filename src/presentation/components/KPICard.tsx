import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  isAlert?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, trend, isAlert }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start justify-between transition-transform hover:-translate-y-1">
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
        <h3 className={`text-3xl font-bold ${isAlert ? 'text-red-500' : 'text-brand-black'}`}>
          {value}
        </h3>
        {trend && (
          <p className="text-xs text-gray-400 mt-2">
            <span className="text-green-500 font-medium">{trend}</span> vs mes pasado
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${isAlert ? 'bg-red-50 text-red-500' : 'bg-brand-yellow text-brand-black'}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};
