import type { Product } from '../../core/entities/Product';
import { mockProducts } from './mockProducts';
import { mockInventory } from './mockInventory';

export class ProductRepositoryImpl {
  async getProducts(): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockProducts]);
      }, 300);
    });
  }

  async saveProduct(product: Product): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockProducts.findIndex(p => p.id === product.id);
        if (index >= 0) {
          mockProducts[index] = product;
        } else {
          mockProducts.push(product);
          // Auto-initialize inventory for both branches when a new product is created
          mockInventory.push({ id: Math.random().toString(36).substr(2, 9), productId: product.id, branchId: 1, stock: 0 });
          mockInventory.push({ id: Math.random().toString(36).substr(2, 9), productId: product.id, branchId: 2, stock: 0 });
        }
        resolve();
      }, 400);
    });
  }

  async deleteProduct(productId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockProducts.findIndex(p => p.id === productId);
        if (index >= 0) {
          mockProducts.splice(index, 1);
          // Delete related inventory items (cascade)
          const remainingInventory = mockInventory.filter(inv => inv.productId !== productId);
          mockInventory.length = 0;
          mockInventory.push(...remainingInventory);
        }
        resolve();
      }, 300);
    });
  }
}
