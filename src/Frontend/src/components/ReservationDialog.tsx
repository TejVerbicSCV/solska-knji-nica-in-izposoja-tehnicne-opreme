import { useState, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, AlertCircle, Check } from 'lucide-react';
import type { LibraryItem } from '../types';
import { format, addDays } from 'date-fns';

interface ReservationDialogProps {
  item: LibraryItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: string, endDate: string) => void;
}

const ReservationDialog: FC<ReservationDialogProps> = ({ item, isOpen, onClose, onConfirm }) => {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
  const [error, setError] = useState('');

  const today = format(new Date(), 'yyyy-MM-dd');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate) {
      setError('Prosim izberite datum začetka in konca rezervacije');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date(today);

    if (start < now) {
      setError('Datum začetka ne more biti v preteklosti');
      return;
    }

    if (end <= start) {
      setError('Datum konca mora biti po datumu začetka');
      return;
    }

    onConfirm(startDate, endDate);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Rezervacija predmeta</h2>
              <p className="text-sm text-slate-500 font-medium truncate mt-1">{item.naziv}</p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm font-medium p-3 rounded-xl flex items-start gap-2 border border-destructive/20">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Datum začetka</label>
                <div className="relative group">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="date"
                    min={today}
                    required
                    className="input pl-10 h-12"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Datum konca</label>
                <div className="relative group">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="date"
                    min={startDate || today}
                    required
                    className="input pl-10 h-12"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={onClose}
                className="btn btn-outline"
              >
                Prekliči
              </button>
              <button 
                type="submit"
                className="btn btn-primary min-w-[120px]"
              >
                <Check size={18} />
                Potrdi
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReservationDialog;
