import type { User } from '../../core/entities/User';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Supremo',
    email: 'admin@quepadre.com',
    role: 'SUPER_ADMIN',
    branches: [1, 2],
  },
  {
    id: '2',
    name: 'Gerente Sucursal 1',
    email: 'gerente1@quepadre.com',
    role: 'MANAGER',
    branches: [1],
  },
  {
    id: '3',
    name: 'Gerente Sucursal 2',
    email: 'gerente2@quepadre.com',
    role: 'MANAGER',
    branches: [2],
  },
];

// Contraseñas simuladas
export const mockPasswords: Record<string, string> = {
  'admin@quepadre.com': 'admin123',
  'gerente1@quepadre.com': 'gerente123',
  'gerente2@quepadre.com': 'gerente123',
};
