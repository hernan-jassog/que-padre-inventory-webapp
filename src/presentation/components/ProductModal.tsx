import React, { useState, useEffect } from 'react';
import type { Product } from '../../core/entities/Product';
import { X } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => Promise<void>;
  productToEdit?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, productToEdit }) => {
  const [name, setName] = useState('');
  const [minimumStock, setMinimumStock] = useState('');
  const [unit, setUnit] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setMinimumStock(productToEdit.minimumStock.toString());
      setUnit(productToEdit.unit);
      setPricePerUnit(productToEdit.pricePerUnit.toString());
    } else {
      setName('');
      setMinimumStock('');
      setUnit('');
      setPricePerUnit('');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const product: Product = {
        id: productToEdit ? productToEdit.id : Math.random().toString(36).substr(2, 9),
        name,
        minimumStock: Number(minimumStock),
        unit,
        pricePerUnit: Number(pricePerUnit)
      };
      await onSave(product);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-brand-black">
            {productToEdit ? 'Editar Artículo' : 'Nuevo Artículo'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-brand-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-brand-black mb-1">Nombre del Insumo</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej. Tomate verde"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-1">Unidad de Medida</label>
              <input 
                required
                type="text" 
                value={unit}
                onChange={e => setUnit(e.target.value)}
                placeholder="kg, L, pzas"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-1">Pto. Reorden</label>
              <input 
                required
                type="number"
                min="0"
                step="any"
                value={minimumStock}
                onChange={e => setMinimumStock(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-black mb-1">Costo Estimado por Unidad ($)</label>
            <input 
              required
              type="number"
              min="0"
              step="any"
              value={pricePerUnit}
              onChange={e => setPricePerUnit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 px-4 py-2 bg-brand-black text-white font-semibold rounded-lg hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Artículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
