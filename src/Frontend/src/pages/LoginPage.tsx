import { useState, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, UserCircle, Shield, Mail, Lock, User as UserIcon, Loader2, AlertCircle } from 'lucide-react';
import type { User, UserRole } from '../types';
import { apiService } from '../apiService';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    ime: '',
    priimek: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isRegister) {
        const user = await apiService.register({
          email: formData.email,
          password: formData.password,
          ime: formData.ime,
          priimek: formData.priimek,
          vloga: role
        });
        onLogin(user);
        return;
      }
      
      const user = await apiService.login(formData.email, formData.password);
      onLogin(user);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data || err.message || 'Napaka pri prijavi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl transition-all duration-1000"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-success/10 rounded-full blur-3xl transition-all duration-1000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-6 py-12"
      >
        <div className="text-center mb-8">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/10"
          >
            <BookOpen size={40} />
          </motion.div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Šolska Knjižnica</h1>
          <p className="text-slate-500 mt-2 text-lg">Sistem za izposojo knjig in opreme</p>
        </div>

        <div className="glass border-white/50 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl relative">
          <div className="flex bg-slate-100/50 p-1 rounded-xl mb-8">
            <button 
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isRegister ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Prijava
            </button>
            <button 
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isRegister ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Registracija
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xl flex items-center gap-2 mb-4"
                >
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </motion.div>
              )}
              {isRegister && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Ime</label>
                      <div className="relative group">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          type="text" 
                          required 
                          className="input pl-10 h-12" 
                          placeholder="Janez"
                          value={formData.ime}
                          onChange={(e) => setFormData({...formData, ime: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Priimek</label>
                      <input 
                        type="text" 
                        required 
                        className="input h-12" 
                        placeholder="Novak"
                        value={formData.priimek}
                        onChange={(e) => setFormData({...formData, priimek: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Vloga</label>
                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setRole('student')}
                        className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-xl border-2 transition-all ${role === 'student' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-500'}`}
                      >
                        <UserCircle size={20} />
                        <span>Študent</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setRole('knjiznicar')}
                        className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-xl border-2 transition-all ${role === 'knjiznicar' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-500'}`}
                      >
                        <Shield size={20} />
                        <span>Knjižničar</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">E-poštni naslov</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  required 
                  className="input pl-10 h-12" 
                  placeholder="ime.priimek@scv.si"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Geslo</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  required 
                  className="input pl-10 h-12" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary w-full h-12 text-lg shadow-xl shadow-primary/25 mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Procesiranje...</span>
                </>
              ) : (
                isRegister ? 'Ustvari račun' : 'Prijava'
              )}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-8">
            © 2024 Šolski center Velenje
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
