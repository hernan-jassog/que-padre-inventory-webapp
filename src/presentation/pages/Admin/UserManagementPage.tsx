import React, { useEffect, useState } from 'react';
import type { User } from '../../../core/entities/User';
import { UserRepositoryImpl } from '../../../data/auth/UserRepositoryImpl';
import { UserModal } from '../../components/UserModal';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const userRepo = new UserRepositoryImpl();

export const UserManagementPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await userRepo.getUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser?.role === 'SUPER_ADMIN') {
      fetchUsers();
    }
  }, [currentUser]);

  // Protect route strictly
  if (currentUser?.role !== 'SUPER_ADMIN') {
    return <Navigate to="/" replace />;
  }

  const handleOpenModal = (user?: User) => {
    setSelectedUser(user || null);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (user: User, password?: string) => {
    await userRepo.saveUser(user, password);
    await fetchUsers();
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('¿Estás seguro de eliminar a este usuario?')) {
      await userRepo.deleteUser(userId);
      await fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-black">Gestión de Usuarios</h2>
          <p className="text-gray-500 text-sm">Administra los accesos y roles del sistema</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-brand-yellow text-brand-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:brightness-95 transition-all shadow-sm"
        >
          <Plus size={20} />
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm">
                  <th className="px-6 py-4 font-semibold">Nombre</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Rol</th>
                  <th className="px-6 py-4 font-semibold">Sucursales</th>
                  <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-black">{u.name}</td>
                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        u.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {u.role === 'SUPER_ADMIN' ? 'Admin' : 'Gerente'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {u.branches.map(b => (
                          <span key={b} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold">
                            Suc {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(u)}
                        className="p-2 text-gray-400 hover:text-brand-black hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      {u.id !== currentUser.id && (
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        userToEdit={selectedUser}
      />
    </div>
  );
};
