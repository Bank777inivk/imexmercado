import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, useAuth } from '@imexmercado/firebase';
import { EnvelopeSimple, Lock, ArrowRight, ShieldCheck, Eye, EyeSlash } from '@phosphor-icons/react';

export function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      // useAuth hook will trigger and useEffect will redirect if admin
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Identifiants incorrects ou accès non autorisé.");
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10 space-y-2">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-2xl shadow-primary/10">
            <ShieldCheck size={40} weight="duotone" className="text-primary" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">IMEX-ADMIN</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Console d'administration sécurisée</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            {!authLoading && user && !isAdmin && (
              <div className="bg-orange-500/10 border border-orange-500/20 text-orange-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                Compte connecté mais non-admin
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 pl-1">Identifiant Email</label>
                <div className="relative group">
                  <EnvelopeSimple size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white outline-none focus:border-primary transition-all placeholder:text-gray-600"
                    placeholder="admin@imexmercado.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 pl-1">Mot de passe</label>
                <div className="relative group">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white outline-none focus:border-primary transition-all placeholder:text-gray-600"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeSlash size={18} weight="bold" /> : <Eye size={18} weight="bold" />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Vérification...' : 'Accéder au Dashboard'}
              {!loading && <ArrowRight size={18} weight="bold" />}
            </button>
          </form>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            Accès réservé au personnel autorisé par <span className="text-white">IMEX MERCADO S.L.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
