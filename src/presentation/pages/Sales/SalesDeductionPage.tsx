import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as XLSX from 'xlsx';
import { CalculateDeductionsUseCase } from '../../../core/usecases/CalculateDeductionsUseCase';
import type { ParsedSale, DeductionPreview } from '../../../core/usecases/CalculateDeductionsUseCase';
import { InventoryRepositoryImpl } from '../../../data/inventory/InventoryRepositoryImpl';
import { UploadCloud, FileSpreadsheet, Download, CheckCircle2, Store } from 'lucide-react';

const calculateUseCase = new CalculateDeductionsUseCase();
const inventoryRepo = new InventoryRepositoryImpl();

export const SalesDeductionPage: React.FC = () => {
  const { user } = useAuth();
  const availableBranches = user?.role === 'SUPER_ADMIN' ? [1, 2] : user?.branches || [];
  
  const [selectedBranch, setSelectedBranch] = useState<number>(availableBranches[0] || 1);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const [deductions, setDeductions] = useState<DeductionPreview[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const generateMockExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Platillo: 'Chilaquiles Verdes', Cantidad: 15 },
      { Platillo: 'Chilaquiles Rojos con Pollo', Cantidad: 10 },
      { Platillo: 'Extra Huevo', Cantidad: 5 },
      { Platillo: 'Agua de Horchata', Cantidad: 20 } // Unmatched mock
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas");
    XLSX.writeFile(wb, "mock_ventas.xlsx");
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setSuccess(false);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      const rawJson = XLSX.utils.sheet_to_json<{ Platillo: string; Cantidad: number }>(worksheet);
      
      const sales: ParsedSale[] = rawJson.map(row => ({
        dishName: row.Platillo || '',
        quantitySold: Number(row.Cantidad) || 0
      })).filter(s => s.dishName && s.quantitySold > 0);

      // We calculate deductions using the use case
      const calculated = calculateUseCase.execute(sales);
      
      // Basic check for unmatched (if dish is not in our deduction map result implicitly, though usecase handles warning)
      // Since use case only warns, let's just show deductions.
      setDeductions(calculated);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleApprove = async () => {
    if (deductions.length === 0) return;
    setLoading(true);
    
    try {
      await inventoryRepo.deductInventory(
        selectedBranch, 
        deductions.map(d => ({ productId: d.productId, quantity: d.quantityToDeduct }))
      );
      setSuccess(true);
      setDeductions([]);
      setFileName(null);
    } catch (error) {
      console.error(error);
      alert('Error al procesar deducción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-black">Ventas (POS)</h2>
          <p className="text-gray-500 text-sm">Carga el reporte de ventas para deducir insumos automáticamente</p>
        </div>

        <button 
          onClick={generateMockExcel}
          className="text-brand-black bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors text-sm"
        >
          <Download size={16} />
          Descargar Excel de Prueba
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3">
            <CheckCircle2 size={20} />
            <span className="font-semibold text-sm">¡Deducción aplicada correctamente al inventario!</span>
          </div>
        )}

        <div className="max-w-xs">
          <label className="block text-sm font-semibold text-brand-black mb-2 flex items-center gap-2">
            <Store size={16} /> Sucursal para Deducción
          </label>
          <select 
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(Number(e.target.value))}
            disabled={user?.role !== 'SUPER_ADMIN'}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-gray-50 font-medium"
          >
            {availableBranches.map(b => (
              <option key={b} value={b}>Sucursal {b}</option>
            ))}
          </select>
        </div>

        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
            isDragging ? 'border-brand-yellow bg-yellow-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${isDragging ? 'bg-brand-yellow/20' : 'bg-gray-50'}`}>
              <UploadCloud size={32} className={isDragging ? 'text-brand-yellow' : 'text-gray-400'} />
            </div>
          </div>
          <h3 className="text-brand-black font-bold mb-1">Arrastra tu reporte de Excel aquí</h3>
          <p className="text-gray-500 text-sm mb-4">Solo formatos .xlsx o .csv soportados</p>
          <label className="bg-brand-black text-white px-6 py-2 rounded-lg font-semibold cursor-pointer hover:bg-black transition-colors">
            Seleccionar Archivo
            <input 
              type="file" 
              accept=".xlsx,.csv" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
              }}
            />
          </label>
        </div>

        {fileName && deductions.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <FileSpreadsheet className="text-green-600" size={24} />
              <div>
                <h4 className="font-bold text-brand-black">Previsualización de Deducciones</h4>
                <p className="text-xs text-gray-500">Archivo: {fileName}</p>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Insumo</th>
                    <th className="px-4 py-3 font-semibold text-right">Cantidad a Descontar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {deductions.map(d => (
                    <tr key={d.productId} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-bold text-brand-black">{d.productName}</td>
                      <td className="px-4 py-3 text-right text-red-600 font-bold">
                        -{d.quantityToDeduct.toFixed(2)} {d.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleApprove}
                disabled={loading}
                className="bg-brand-yellow hover:brightness-95 text-brand-black font-bold py-3 px-8 rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                {loading ? 'Procesando...' : 'Aprobar y Descontar del Inventario'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
