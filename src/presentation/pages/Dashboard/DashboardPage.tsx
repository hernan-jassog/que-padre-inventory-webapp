import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { InventoryRepositoryImpl } from '../../../data/inventory/InventoryRepositoryImpl';
import type { DashboardKPIs } from '../../../data/inventory/InventoryRepositoryImpl';
import { KPICard } from '../../components/KPICard';
import { DollarSign, AlertTriangle, TrendingUp, Store } from 'lucide-react';

const inventoryRepo = new InventoryRepositoryImpl();

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(
    user?.role === 'MANAGER' ? user.branches[0] : null
  );

  useEffect(() => {
    const fetchKPIs = async () => {
      const data = await inventoryRepo.getDashboardKPIs(selectedBranch);
      setKpis(data);
    };
    fetchKPIs();
  }, [selectedBranch]);

  if (!kpis) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-brand-black">Resumen de Inventario</h2>
          <p className="text-gray-500 text-sm">Monitorea el valor y alertas de tus sucursales</p>
        </div>

        {user?.role === 'SUPER_ADMIN' && (
          <div className="flex items-center gap-2">
            <Store className="text-gray-400" size={20} />
            <select
              className="bg-white border border-gray-200 text-brand-black font-semibold rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              value={selectedBranch || ''}
              onChange={(e) => setSelectedBranch(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Consolidado (Todas)</option>
              <option value="1">Sucursal 1</option>
              <option value="2">Sucursal 2</option>
            </select>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Valor Total Inventario" 
          value={`$${kpis.totalValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend="+5.2%"
        />
        <KPICard 
          title="Alertas de Reorden" 
          value={kpis.itemsNeedingReorder}
          icon={AlertTriangle}
          isAlert={kpis.itemsNeedingReorder > 0}
        />
        <KPICard 
          title="Top Insumos (Por Valor)" 
          value={kpis.topItems.length}
          icon={TrendingUp}
        />
      </div>

      {/* Top 5 Items Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-brand-black">Top 5 Insumos con Mayor Valor</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="px-6 py-3 font-semibold">Insumo</th>
                <th className="px-6 py-3 font-semibold">Sucursal</th>
                <th className="px-6 py-3 font-semibold">Stock Actual</th>
                <th className="px-6 py-3 font-semibold">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {kpis.topItems.map((item) => (
                <tr key={`${item.id}-${item.branchId}`} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-brand-black">{item.product?.name}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold">
                      Sucursal {item.branchId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={item.stock <= (item.product?.minimumStock || 0) ? 'text-red-500 font-bold' : 'text-brand-black'}>
                        {item.stock} {item.product?.unit}
                      </span>
                      {item.stock <= (item.product?.minimumStock || 0) && <AlertTriangle size={14} className="text-red-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-brand-black font-semibold">
                    ${(item.stock * (item.product?.pricePerUnit || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              {kpis.topItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No hay insumos para mostrar.
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
