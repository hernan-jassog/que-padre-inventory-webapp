import type { InventoryItem } from '../../core/entities/Inventory';
import { mockInventory } from './mockInventory';
import { mockProducts } from './mockProducts';

export interface DashboardKPIs {
  totalValue: number;
  itemsNeedingReorder: number;
  topItems: InventoryItem[];
}

import { mockAudits } from './mockAudits';

export class InventoryRepositoryImpl {
  private populateProduct(item: InventoryItem): InventoryItem {
    return {
      ...item,
      product: mockProducts.find(p => p.id === item.productId)
    };
  }

  async getDashboardKPIs(branchId: number | null): Promise<DashboardKPIs> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredItems = branchId 
          ? mockInventory.filter(item => item.branchId === branchId)
          : mockInventory;
          
        const populatedItems = filteredItems.map(this.populateProduct);

        const totalValue = populatedItems.reduce((acc, item) => acc + (item.stock * (item.product?.pricePerUnit || 0)), 0);
        const itemsNeedingReorder = populatedItems.filter(item => item.stock <= (item.product?.minimumStock || 0)).length;
        
        // Mock top 5 (simulated by value)
        const topItems = [...populatedItems]
          .sort((a, b) => (b.stock * (b.product?.pricePerUnit || 0)) - (a.stock * (a.product?.pricePerUnit || 0)))
          .slice(0, 5);

        resolve({
          totalValue,
          itemsNeedingReorder,
          topItems
        });
      }, 500); // Simulate network latency
    });
  }

  async getItems(branchId: number | null): Promise<InventoryItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = branchId ? mockInventory.filter(i => i.branchId === branchId) : mockInventory;
        resolve(items.map(i => this.populateProduct(i)));
      }, 400);
    });
  }

  async recordPurchase(purchase: import('../../core/entities/Purchase').Purchase): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find item to update stock (we search by productId and branchId now)
        const item = mockInventory.find(i => i.productId === purchase.inventoryItemId && i.branchId === purchase.branchId);
        if (!item) {
          // Si no existe el inventario para esa sucursal, lo creamos
          mockInventory.push({
            id: Math.random().toString(36).substr(2, 9),
            productId: purchase.inventoryItemId,
            branchId: purchase.branchId,
            stock: purchase.quantity
          });
        } else {
          item.stock += purchase.quantity;
        }

        resolve();
      }, 600);
    });
  }

  async deductInventory(branchId: number, deductions: { productId: string, quantity: number }[]): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        for (const deduction of deductions) {
          const item = mockInventory.find(i => i.productId === deduction.productId && i.branchId === branchId);
          if (item) {
            item.stock = Math.max(0, item.stock - deduction.quantity);
          } else {
            // Si por alguna razón no estaba en inventario, se inicializa en 0 (puesto que se vendió y se descontó de la nada)
            mockInventory.push({
              id: Math.random().toString(36).substr(2, 9),
              productId: deduction.productId,
              branchId: branchId,
              stock: 0
            });
          }
        }
        resolve();
      }, 800);
    });
  }

  async adjustInventory(
    productId: string,
    branchId: number,
    realStock: number,
    reason: import('../../core/entities/AuditLog').AuditLog['reason'],
    userId: string
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let item = mockInventory.find(i => i.productId === productId && i.branchId === branchId);
        let previousStock = 0;

        if (item) {
          previousStock = item.stock;
          item.stock = realStock;
        } else {
          mockInventory.push({
            id: Math.random().toString(36).substr(2, 9),
            productId,
            branchId,
            stock: realStock
          });
        }

        // We would import mockAudits here or handle it, but for simplicity in this mock Repo:
        mockAudits.push({
          id: Math.random().toString(36).substr(2, 9),
          productId,
          branchId,
          previousStock,
          newStock: realStock,
          reason,
          userId,
          date: new Date().toISOString()
        });
        
        resolve();
      }, 500);
    });
  }
}
