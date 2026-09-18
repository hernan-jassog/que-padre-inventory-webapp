import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthRepositoryImpl } from '../../../data/auth/AuthRepositoryImpl';
import { AlertCircle } from 'lucide-react';

const authRepo = new AuthRepositoryImpl();

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authRepo.login(email, password);
      login(user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-cream">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-black">
        <img 
          src="/image.png" 
          alt="Qué Padre Chilaquería" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent flex items-end p-12">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">Qué Padre</h1>
            <p className="text-xl text-gray-300">Sistema de Control de Inventarios</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-brand-yellow shadow-lg">
              <img src="/que-padre-chilaquiles-logo.jpg" alt="Logo Qué Padre" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-bold text-brand-black">Iniciar Sesión</h2>
            <p className="text-gray-500 mt-2">Ingresa tus credenciales para acceder</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent transition-all bg-white"
                placeholder="ejemplo@quepadre.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent transition-all bg-white"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-black hover:bg-black text-white font-bold py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-black focus:ring-offset-2 focus:ring-offset-cream disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-12"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Entrar al Sistema'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Credenciales de prueba:<br/>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin@quepadre.com</span> / <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
