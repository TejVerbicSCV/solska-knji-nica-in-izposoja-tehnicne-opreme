import { type FC, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ReturnItemDialogProps {
  onConfirm: (poskodba: string) => void;
  onCancel: () => void;
  itemName: string;
}

const ReturnItemDialog: FC<ReturnItemDialogProps> = ({ onConfirm, onCancel, itemName }) => {
  const [poskodba, setPoskodba] = useState('');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">Vračilo predmeta</h3>
          <button onClick={onCancel} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <AlertCircle className="text-primary shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">Potrditev vračila</p>
              <p className="text-slate-600 text-sm">Ali potrjujete vračilo za: <span className="font-bold text-slate-900">{itemName}</span>?</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Opis poškodb (neobvezno)</label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-600 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none h-32"
              placeholder="Vpišite morebitne poškodbe ali opombe..."
              value={poskodba}
              onChange={(e) => setPoskodba(e.target.value)}
            />
          </div>
        </div>

        <div className="px-6 py-5 bg-slate-50/50 flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 btn bg-white border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl h-12 font-bold"
          >
            Prekliči
          </button>
          <button 
            onClick={() => onConfirm(poskodba)}
            className="flex-1 btn btn-primary rounded-xl h-12 font-bold shadow-lg shadow-primary/20"
          >
            Potrdi vračilo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnItemDialog;
