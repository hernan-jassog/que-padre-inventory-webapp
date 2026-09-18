import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Scanner } from '@yudiel/react-qr-scanner';
import { InventoryRepositoryImpl } from '../../../data/inventory/InventoryRepositoryImpl';
import { ProductRepositoryImpl } from '../../../data/inventory/ProductRepositoryImpl';
import type { Product } from '../../../core/entities/Product';
import type { InventoryItem } from '../../../core/entities/Inventory';
import type { AuditLog } from '../../../core/entities/AuditLog';
import { ScanLine, Box, Save, RefreshCw, Smartphone } from 'lucide-react';

const inventoryRepo = new InventoryRepositoryImpl();
const productRepo = new ProductRepositoryImpl();

export const PhysicalAdjustmentPage: React.FC = () => {
  const { user } = useAuth();
  
  // Para móvil, asumimos que el gerente escanea en su propia sucursal.
  // Si es SuperAdmin, debe elegir la sucursal primero.
  const [selectedBranch, setSelectedBranch] = useState<number>(user?.branches[0] || 1);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProductId, setScannedProductId] = useState<string | null>(null);
  
  // Formulario
  const [realStock, setRealStock] = useState('');
  const [reason, setReason] = useState<AuditLog['reason']>('Merma');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const prods = await productRepo.getProducts();
      setProducts(prods);
      
      const invs = await inventoryRepo.getItems(selectedBranch);
      setInventoryItems(invs);
    };
    fetchData();
  }, [selectedBranch, scannedProductId]); // Refetch when branch changes or scan completes to get fresh theoretical stock

  const handleScan = (text: string) => {
    if (text) {
      // Intentamos buscar si el código QR coincide con algún Product ID
      const exists = products.find(p => p.id === text);
      if (exists) {
        setScannedProductId(text);
        setIsScanning(false);
      } else {
        alert('Código no reconocido o insumo inexistente: ' + text);
      }
    }
  };

  const handleSimulateScan = () => {
    // Tomamos el primer producto de la lista (ej. p1 Totopos o p2 Queso)
    if (products.length > 0) {
      setScannedProductId(products[1]?.id || products[0].id); // Simulamos escanear el Queso Cotija
      setIsScanning(false);
    }
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedProductId || realStock === '') return;

    setLoading(true);
    try {
      await inventoryRepo.adjustInventory(
        scannedProductId,
        selectedBranch,
        Number(realStock),
        reason,
        user?.id || 'unknown'
      );
      
      alert('¡Inventario ajustado correctamente!');
      // Reset form
      setScannedProductId(null);
      setRealStock('');
      setReason('Merma');
      
      // Update local state to reflect change if user cancels scan
      const invs = await inventoryRepo.getItems(selectedBranch);
      setInventoryItems(invs);
    } catch (error) {
      console.error(error);
      alert('Error al ajustar el inventario');
    } finally {
      setLoading(false);
    }
  };

  // Vistas derivadas
  const currentProduct = products.find(p => p.id === scannedProductId);
  const currentInventory = inventoryItems.find(i => i.productId === scannedProductId);
  const theoreticalStock = currentInventory ? currentInventory.stock : 0;

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-black flex items-center justify-center gap-2">
          <Smartphone size={24} className="text-brand-yellow" /> 
          Auditoría Física
        </h2>
        <p className="text-gray-500 text-sm mt-1">Escanea el código QR del contenedor</p>
      </div>

      {user?.role === 'SUPER_ADMIN' && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-brand-black mb-2">Sucursal a Auditar</label>
          <select 
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-gray-50 font-medium"
          >
            <option value="1">Sucursal 1</option>
            <option value="2">Sucursal 2</option>
          </select>
        </div>
      )}

      {/* Escáner o Estado Inicial */}
      {!scannedProductId ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {isScanning ? (
            <div className="relative bg-black aspect-[3/4] flex flex-col items-center justify-center">
              <Scanner 
                onScan={(result) => handleScan(result[0].rawValue)} 
                components={{ finder: true }}
              />
              <button 
                onClick={() => setIsScanning(false)}
                className="absolute bottom-6 bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full font-semibold border border-white/30"
              >
                Cancelar Escaneo
              </button>
            </div>
          ) : (
            <div className="p-8 text-center space-y-6">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-sm">
                <ScanLine size={40} className="text-brand-yellow" />
              </div>
              <p className="text-brand-black font-semibold">Listo para auditar en Sucursal {selectedBranch}</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setIsScanning(true)}
                  className="w-full bg-brand-black text-white font-bold py-4 px-6 rounded-2xl transition-colors hover:bg-black shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                >
                  <ScanLine size={20} />
                  Abrir Cámara
                </button>
                
                <button 
                  onClick={handleSimulateScan}
                  className="w-full bg-brand-yellow/10 text-brand-black font-bold py-3 px-6 rounded-2xl transition-colors hover:bg-brand-yellow/20"
                >
                  Simular Escaneo (Prueba)
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Formulario de Ajuste (Post Escaneo) */
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-brand-yellow px-6 py-4 flex items-center gap-3">
            <Box size={24} className="text-brand-black" />
            <h3 className="font-bold text-lg text-brand-black leading-tight">
              {currentProduct?.name}
            </h3>
          </div>
          
          <form onSubmit={handleSaveAdjustment} className="p-6 space-y-5">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-gray-500 font-semibold text-sm">Existencia Teórica</span>
              <span className="text-xl font-bold text-brand-black">
                {theoreticalStock} <span className="text-sm font-normal text-gray-400">{currentProduct?.unit}</span>
              </span>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-black mb-2">Existencia Física Real</label>
              <div className="relative">
                <input 
                  type="number" 
                  min="0"
                  step="any"
                  value={realStock}
                  onChange={(e) => setRealStock(e.target.value)}
                  required
                  placeholder="Ej. 14.5"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 text-lg font-bold text-brand-black transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                  {currentProduct?.unit}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-black mb-2">Motivo de la Diferencia</label>
              <select 
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-brand-yellow bg-white font-semibold text-gray-700"
              >
                <option value="Merma">Merma (Dañado/Vencido)</option>
                <option value="Extravío">Extravío / Robo</option>
                <option value="Error de captura">Error de Captura Previa</option>
              </select>
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                type="button" 
                onClick={() => setScannedProductId(null)}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 px-2 rounded-2xl transition-colors hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-[2] bg-brand-black text-white font-bold py-4 px-2 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <RefreshCw size={20} className="animate-spin" />
                ) : (
                  <>
                    <Save size={20} /> Guardar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
