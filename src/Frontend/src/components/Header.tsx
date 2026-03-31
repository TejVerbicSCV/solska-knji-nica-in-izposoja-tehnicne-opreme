import type { FC } from 'react';
import { BookOpen, LogOut, User as UserIcon, Shield } from 'lucide-react';
import type { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  actions?: React.ReactNode;
}

const Header: FC<HeaderProps> = ({ user, onLogout, actions }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/10">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 tracking-tight leading-none text-lg">Šolska Knjižnica</h1>
            <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mt-1">Sistem za izposojo</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100/50 rounded-full border border-slate-200/50">
            {user.vloga === 'knjiznicar' ? (
              <Shield size={16} className="text-primary" />
            ) : (
              <UserIcon size={16} className="text-primary" />
            )}
            <span className="text-sm font-semibold text-slate-700">{user.ime} {user.priimek}</span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-400 font-bold uppercase">{user.vloga}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {actions}
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all"
              title="Odjava"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
