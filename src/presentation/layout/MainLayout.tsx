import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, PackageSearch, ShoppingCart, Users, BookOpen, Calculator, Smartphone } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Ventas (POS)', path: '/sales', icon: Calculator },
    { label: 'Auditoría (QR)', path: '/adjustments', icon: Smartphone },
    { label: 'Catálogo', path: '/catalog', icon: BookOpen },
    { label: 'Inventario', path: '/inventory', icon: PackageSearch },
    { label: 'Compras', path: '/purchases', icon: ShoppingCart },
    ...(user?.role === 'SUPER_ADMIN' ? [{ label: 'Usuarios', path: '/admin/users', icon: Users }] : []),
  ];

  return (
    <div className="min-h-screen flex bg-brand-gray">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-black text-white flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-brand-yellow">
            <img src="/que-padre-chilaquiles-logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Qué Padre</h2>
            <p className="text-xs text-gray-400">Inventarios</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">Menú Principal</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-brand-yellow text-brand-black font-semibold shadow-sm' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-3">
              <LogOut size={20} />
              Salir
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-brand-black">
            {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-brand-black">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role === 'SUPER_ADMIN' ? 'Super Administrador' : 'Gerente'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center text-brand-black font-bold border-2 border-cream shadow-sm">
              {user?.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
