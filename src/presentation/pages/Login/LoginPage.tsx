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
    <div className="min-h-[100dvh] flex relative bg-brand-black">
      {/* Background Image - Absolute on Mobile, Relative half-width on Desktop */}
      <div className="absolute inset-0 z-0 lg:relative lg:w-1/2 bg-brand-black">
        <img 
          src="/image.png" 
          alt="Qué Padre Chilaquería" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 lg:opacity-80"
        />
        <div className="hidden lg:flex absolute inset-0 bg-gradient-to-t from-brand-black/90 to-transparent items-end p-12">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">Qué Padre</h1>
            <p className="text-xl text-gray-300">Sistema de Control de Inventarios</p>
          </div>
        </div>
      </div>

      {/* Form Container - Overlapping on Mobile, Next to Image on Desktop */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 py-12 sm:p-8 z-10 relative overflow-y-auto min-h-[100dvh]">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md lg:bg-white p-8 rounded-3xl shadow-2xl lg:shadow-none border border-white/20 lg:border-transparent my-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-brand-yellow shadow-lg bg-white">
              <img src="/que-padre-chilaquiles-logo.jpg" alt="Logo Qué Padre" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-bold text-brand-black text-center leading-tight">Iniciar Sesión</h2>
            <p className="text-gray-500 mt-2 text-center text-sm">Ingresa tus credenciales para acceder</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:ring-0 focus:border-brand-yellow transition-all bg-white/80 font-medium"
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
                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 focus:outline-none focus:ring-0 focus:border-brand-yellow transition-all bg-white/80 font-medium"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-black hover:bg-black text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center mt-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Entrar al Sistema'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200/60">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Credenciales de prueba:<br/>
              <span className="font-mono bg-gray-100 text-brand-black px-2 py-1 rounded font-bold mt-1 inline-block">admin@quepadre.com</span> / <span className="font-mono bg-gray-100 text-brand-black px-2 py-1 rounded font-bold mt-1 inline-block">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
