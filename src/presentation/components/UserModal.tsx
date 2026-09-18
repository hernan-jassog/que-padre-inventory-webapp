import React, { useState, useEffect } from 'react';
import type { User, Role } from '../../core/entities/User';
import { X } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User, password?: string) => Promise<void>;
  userToEdit?: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, userToEdit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('MANAGER');
  const [branches, setBranches] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setRole(userToEdit.role);
      setBranches(userToEdit.branches);
      setPassword(''); // Don't show existing password
    } else {
      setName('');
      setEmail('');
      setRole('MANAGER');
      setBranches([]);
      setPassword('');
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleBranchToggle = (branchId: number) => {
    setBranches(prev => 
      prev.includes(branchId) 
        ? prev.filter(id => id !== branchId)
        : [...prev, branchId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user: User = {
        id: userToEdit ? userToEdit.id : Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
        branches
      };
      await onSave(user, password || undefined);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-brand-black">
            {userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-brand-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-brand-black mb-1">Nombre Completo</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-black mb-1">Correo Electrónico</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-black mb-1">
              Contraseña {userToEdit && <span className="text-gray-400 font-normal">(Opcional, dejar en blanco para no cambiar)</span>}
            </label>
            <input 
              required={!userToEdit}
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-black mb-1">Rol</label>
            <select 
              value={role}
              onChange={e => setRole(e.target.value as Role)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            >
              <option value="MANAGER">Gerente</option>
              <option value="SUPER_ADMIN">Super Administrador</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-brand-black mb-2">Acceso a Sucursales</label>
            <div className="space-y-2">
              {[1, 2].map(branchId => (
                <label key={branchId} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={branches.includes(branchId)}
                    onChange={() => handleBranchToggle(branchId)}
                    className="w-4 h-4 text-brand-yellow focus:ring-brand-yellow border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Sucursal {branchId}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading || branches.length === 0}
              className="flex-1 px-4 py-2 bg-brand-black text-white font-semibold rounded-lg hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
