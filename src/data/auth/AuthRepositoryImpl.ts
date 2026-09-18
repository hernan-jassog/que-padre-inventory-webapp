import type { User } from '../../core/entities/User';
import { mockUsers, mockPasswords } from './mockUsers';

export class AuthRepositoryImpl {
  async login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find((u) => u.email === email);
        if (!user) {
          return reject(new Error('Usuario no encontrado'));
        }

        const validPassword = mockPasswords[email];
        if (validPassword !== password) {
          return reject(new Error('Contraseña incorrecta'));
        }

        resolve(user);
      }, 800); // Simulate network latency
    });
  }

  saveSession(user: User): void {
    localStorage.setItem('quepadre_user', JSON.stringify(user));
  }

  getSession(): User | null {
    const data = localStorage.getItem('quepadre_user');
    if (!data) return null;
    try {
      return JSON.parse(data) as User;
    } catch {
      return null;
    }
  }

  clearSession(): void {
    localStorage.removeItem('quepadre_user');
  }
}
