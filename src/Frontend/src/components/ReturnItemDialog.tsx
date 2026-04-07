import { type FC, useState } from 'react';
import { X, AlertCircle, Camera, Loader2, Check } from 'lucide-react';
import apiService, { BASE_BACKEND_URL } from '../apiService';

interface ReturnItemDialogProps {
  onConfirm: (poskodba: string, slikaUrl?: string) => void;
  onCancel: () => void;
  itemName: string;
}

const ReturnItemDialog: FC<ReturnItemDialogProps> = ({ onConfirm, onCancel, itemName }) => {
  const [poskodba, setPoskodba] = useState('');
  const [slikaUrl, setSlikaUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await apiService.uploadImage(file);
      setSlikaUrl(url);
    } catch (err) {
      console.error('File upload failed', err);
    } finally {
      setUploading(false);
    }
  };

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

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Slika poškodb (neobvezno)</label>
            <div className="flex items-center gap-3">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploading ? (
                    <Loader2 className="animate-spin text-primary" size={24} />
                  ) : slikaUrl ? (
                    <div className="flex items-center gap-2 text-success">
                      <Check size={20} />
                      <span className="text-xs font-bold uppercase">Slika naložena</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <Camera size={24} />
                      <span className="text-[10px] font-bold mt-1 uppercase">Kliknite za upload</span>
                    </div>
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
              {slikaUrl && (
                <img src={slikaUrl.startsWith('/') ? `${BASE_BACKEND_URL}${slikaUrl}` : slikaUrl} className="w-24 h-24 object-cover rounded-2xl shadow-sm" alt="Thumbnail" />
              )}
            </div>
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
            onClick={() => onConfirm(poskodba, slikaUrl)}
            disabled={uploading}
            className="flex-1 btn btn-primary rounded-xl h-12 font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            Potrdi vračilo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnItemDialog;
