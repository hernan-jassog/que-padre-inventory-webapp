import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { InventoryRepositoryImpl } from '../../../data/inventory/InventoryRepositoryImpl';
import type { InventoryItem } from '../../../core/entities/Inventory';
import type { Purchase } from '../../../core/entities/Purchase';
import { PackagePlus, CheckCircle2, Store } from 'lucide-react';

const inventoryRepo = new InventoryRepositoryImpl();

export const PurchasesPage: React.FC = () => {
  const { user } = useAuth();
  
  // Strict branch restriction
  const availableBranches = user?.role === 'SUPER_ADMIN' ? [1, 2] : user?.branches || [];
  
  const [selectedBranch, setSelectedBranch] = useState<number>(availableBranches[0] || 1);
  const [items, setItems] = useState<InventoryItem[]>([]);
  
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cost, setCost] = useState('');
  const [provider, setProvider] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await inventoryRepo.getItems(selectedBranch);
      setItems(data);
      if (data.length > 0 && !data.find(i => i.id === selectedItem)) {
        setSelectedItem(data[0].id);
      }
    };
    fetchItems();
  }, [selectedBranch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !quantity || !cost) return;

    setLoading(true);
    setSuccess(false);

    const purchase: Purchase = {
      id: Math.random().toString(36).substr(2, 9),
      inventoryItemId: selectedItem,
      quantity: Number(quantity),
      totalCost: Number(cost),
      provider: provider || 'Proveedor General',
      branchId: selectedBranch,
      date: new Date().toISOString()
    };

    try {
      await inventoryRepo.recordPurchase(purchase);
      setSuccess(true);
      setQuantity('');
      setCost('');
      setProvider('');
      
      // Remove success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Error al registrar la compra');
    } finally {
      setLoading(false);
    }
  };

  const currentItem = items.find(i => i.productId === selectedItem);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-black">Registro de Compras</h2>
        <p className="text-gray-500 text-sm">Ingresa los insumos recibidos para aumentar el stock</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3">
            <CheckCircle2 size={20} />
            <span className="font-semibold text-sm">¡Compra registrada exitosamente! El stock ha sido actualizado.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sucursal */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-brand-black mb-2 flex items-center gap-2">
              <Store size={16} /> Sucursal Destino
            </label>
            <select 
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(Number(e.target.value))}
              disabled={user?.role !== 'SUPER_ADMIN'} // Managers can't change
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-gray-50 font-medium"
            >
              {availableBranches.map(b => (
                <option key={b} value={b}>Sucursal {b}</option>
              ))}
            </select>
          </div>

          {/* Insumo */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-brand-black mb-2">Seleccionar Insumo</label>
            <select 
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-white"
            >
              <option value="" disabled>Elige un insumo...</option>
              {items.map(item => (
                <option key={item.id} value={item.productId}>{item.product?.name}</option>
              ))}
            </select>
            {currentItem && (
              <p className="text-xs text-gray-500 mt-2">
                Stock actual en sucursal: <span className="font-bold text-brand-black">{currentItem.stock} {currentItem.product?.unit}</span>
              </p>
            )}
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-semibold text-brand-black mb-2">
              Cantidad {currentItem && <span className="text-gray-400 font-normal">({currentItem.product?.unit})</span>}
            </label>
            <input 
              type="number" 
              min="0.1"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              placeholder="Ej. 10"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-white"
            />
          </div>

          {/* Costo */}
          <div>
            <label className="block text-sm font-semibold text-brand-black mb-2">Costo Total ($)</label>
            <input 
              type="number" 
              min="1"
              step="any"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              placeholder="Ej. 450.50"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-white"
            />
          </div>

          {/* Proveedor */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-brand-black mb-2">Proveedor (Opcional)</label>
            <input 
              type="text" 
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="Nombre del proveedor o nota"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-white"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-black hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <PackagePlus size={20} />
                Registrar Compra y Actualizar Stock
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
