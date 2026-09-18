import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { InventoryRepositoryImpl } from '../../../data/inventory/InventoryRepositoryImpl';
import type { InventoryItem } from '../../../core/entities/Inventory';
import { Store, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

const inventoryRepo = new InventoryRepositoryImpl();

export const InventoryPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(
    user?.role === 'MANAGER' ? user.branches[0] : null
  );

  const fetchItems = async () => {
    setLoading(true);
    const data = await inventoryRepo.getItems(selectedBranch);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [selectedBranch]);

  const getStatusColor = (stock: number, min: number) => {
    if (stock <= min) return 'text-red-500 bg-red-50 border-red-200'; // Critical / Rojo
    if (stock <= min * 1.3) return 'text-yellow-600 bg-yellow-50 border-yellow-200'; // Warning / Amarillo
    return 'text-green-600 bg-green-50 border-green-200'; // Good / Verde
  };

  const getStatusIcon = (stock: number, min: number) => {
    if (stock <= min) return <AlertCircle size={16} />;
    if (stock <= min * 1.3) return <AlertTriangle size={16} />;
    return <CheckCircle2 size={16} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-brand-black">Inventario Actual</h2>
          <p className="text-gray-500 text-sm">Consulta el stock de insumos por sucursal</p>
        </div>

        {user?.role === 'SUPER_ADMIN' && (
          <div className="flex items-center gap-2">
            <Store className="text-gray-400" size={20} />
            <select
              className="bg-white border border-gray-200 text-brand-black font-semibold rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              value={selectedBranch || ''}
              onChange={(e) => setSelectedBranch(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Todas las Sucursales</option>
              <option value="1">Sucursal 1</option>
              <option value="2">Sucursal 2</option>
            </select>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm">
                  <th className="px-6 py-4 font-semibold">Estado</th>
                  <th className="px-6 py-4 font-semibold">Insumo</th>
                  <th className="px-6 py-4 font-semibold">Sucursal</th>
                  <th className="px-6 py-4 font-semibold text-right">Stock Actual</th>
                  <th className="px-6 py-4 font-semibold text-right">Pto. Reorden</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => {
                  const minStock = item.product?.minimumStock || 0;
                  const statusClasses = getStatusColor(item.stock, minStock);
                  return (
                    <tr key={`${item.id}-${item.branchId}`} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${statusClasses}`}>
                          {getStatusIcon(item.stock, minStock)}
                          {item.stock <= minStock ? 'Crítico' : (item.stock <= minStock * 1.3 ? 'Alerta' : 'Óptimo')}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-brand-black">{item.product?.name}</td>
                      <td className="px-6 py-4 text-gray-500">
                        Sucursal {item.branchId}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-brand-black">
                        {item.stock} <span className="text-sm font-normal text-gray-400">{item.product?.unit}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500">
                        {minStock} <span className="text-sm text-gray-400">{item.product?.unit}</span>
                      </td>
                    </tr>
                  );
                })}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No hay insumos para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
