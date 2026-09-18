import type { InventoryItem } from '../../core/entities/Inventory';

export const mockInventory: InventoryItem[] = [
  // Sucursal 1
  { id: '1', productId: 'p1', stock: 15, branchId: 1 },
  { id: '2', productId: 'p2', stock: 5, branchId: 1 },
  { id: '3', productId: 'p3', stock: 12, branchId: 1 },
  { id: '4', productId: 'p4', stock: 25, branchId: 1 },
  { id: '5', productId: 'p5', stock: 8, branchId: 1 },
  { id: '6', productId: 'p6', stock: 10, branchId: 1 },
  { id: '13', productId: 'p7', stock: 50, branchId: 1 },
  
  // Sucursal 2
  { id: '7', productId: 'p1', stock: 30, branchId: 2 },
  { id: '8', productId: 'p2', stock: 15, branchId: 2 },
  { id: '9', productId: 'p3', stock: 6, branchId: 2 },
  { id: '10', productId: 'p4', stock: 18, branchId: 2 },
  { id: '11', productId: 'p5', stock: 22, branchId: 2 },
  { id: '14', productId: 'p6', stock: 15, branchId: 2 },
  { id: '12', productId: 'p7', stock: 120, branchId: 2 },
];
