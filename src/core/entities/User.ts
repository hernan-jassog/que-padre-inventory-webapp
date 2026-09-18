export type Role = 'SUPER_ADMIN' | 'MANAGER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  branches: number[]; // e.g., [1, 2] for SuperAdmin, [1] or [2] for Manager
}
