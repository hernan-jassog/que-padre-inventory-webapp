import type { Product } from '../../core/entities/Product';

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Totopos', minimumStock: 20, unit: 'kg', pricePerUnit: 45.0 },
  { id: 'p2', name: 'Queso Cotija', minimumStock: 10, unit: 'kg', pricePerUnit: 120.0 },
  { id: 'p3', name: 'Crema', minimumStock: 8, unit: 'L', pricePerUnit: 65.0 },
  { id: 'p4', name: 'Salsa Verde', minimumStock: 15, unit: 'L', pricePerUnit: 35.0 },
  { id: 'p5', name: 'Salsa Roja', minimumStock: 15, unit: 'L', pricePerUnit: 38.0 },
  { id: 'p6', name: 'Pollo Deshebrado', minimumStock: 12, unit: 'kg', pricePerUnit: 90.0 },
  { id: 'p7', name: 'Huevo', minimumStock: 150, unit: 'pzas', pricePerUnit: 3.5 },
];
