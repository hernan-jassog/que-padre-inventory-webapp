import React, { useEffect, useState } from 'react';
import type { Product } from '../../../core/entities/Product';
import { ProductRepositoryImpl } from '../../../data/inventory/ProductRepositoryImpl';
import { ProductModal } from '../../components/ProductModal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const productRepo = new ProductRepositoryImpl();

export const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await productRepo.getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product?: Product) => {
    setSelectedProduct(product || null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (product: Product) => {
    await productRepo.saveProduct(product);
    await fetchProducts();
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('¿Estás seguro de eliminar este artículo del catálogo? Esto borrará también el stock de todas las sucursales.')) {
      await productRepo.deleteProduct(productId);
      await fetchProducts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-black">Catálogo Maestro</h2>
          <p className="text-gray-500 text-sm">Gestiona los insumos base y sus puntos de reorden</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-brand-yellow text-brand-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:brightness-95 transition-all shadow-sm"
        >
          <Plus size={20} />
          Nuevo Artículo
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm">
                  <th className="px-6 py-4 font-semibold">Nombre del Insumo</th>
                  <th className="px-6 py-4 font-semibold">Unidad</th>
                  <th className="px-6 py-4 font-semibold">Pto. Reorden</th>
                  <th className="px-6 py-4 font-semibold">Costo Base ($)</th>
                  <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-black">{p.name}</td>
                    <td className="px-6 py-4 text-gray-500">{p.unit}</td>
                    <td className="px-6 py-4 font-bold text-brand-black">{p.minimumStock}</td>
                    <td className="px-6 py-4 text-gray-500">${p.pricePerUnit.toFixed(2)}</td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(p)}
                        className="p-2 text-gray-400 hover:text-brand-black hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      El catálogo está vacío. Agrega tu primer artículo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={selectedProduct}
      />
    </div>
  );
};
