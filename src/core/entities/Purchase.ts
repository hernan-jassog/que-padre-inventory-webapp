export interface Purchase {
  id: string;
  inventoryItemId: string;
  quantity: number;
  totalCost: number;
  provider: string;
  branchId: number;
  date: string; // ISO date string
}
