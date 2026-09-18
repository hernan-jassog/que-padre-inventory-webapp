import type { User } from '../../core/entities/User';
import { mockUsers, mockPasswords } from './mockUsers';

export class UserRepositoryImpl {
  async getUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockUsers]);
      }, 300);
    });
  }

  async saveUser(user: User, password?: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockUsers.findIndex(u => u.id === user.id);
        if (index >= 0) {
          mockUsers[index] = user;
          if (password) mockPasswords[user.email] = password;
        } else {
          mockUsers.push(user);
          mockPasswords[user.email] = password || 'default123';
        }
        resolve();
      }, 400);
    });
  }

  async deleteUser(userId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockUsers.findIndex(u => u.id === userId);
        if (index >= 0) {
          const email = mockUsers[index].email;
          mockUsers.splice(index, 1);
          delete mockPasswords[email];
        }
        resolve();
      }, 300);
    });
  }
}
