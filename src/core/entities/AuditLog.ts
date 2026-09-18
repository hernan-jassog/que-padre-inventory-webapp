export interface AuditLog {
  id: string;
  productId: string;
  branchId: number;
  previousStock: number;
  newStock: number;
  reason: 'Merma' | 'Extravío' | 'Error de captura';
  userId: string;
  date: string; // ISO string
}
