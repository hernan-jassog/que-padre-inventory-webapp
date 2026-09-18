import type { Product } from '../../core/entities/Product';

export interface InventoryItem {
  id: string;
  productId: string;
  branchId: number;
  stock: number;
  product?: Product; // Populated logically
}
