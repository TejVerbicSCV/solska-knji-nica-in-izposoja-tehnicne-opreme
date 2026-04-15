import { useState, useEffect, type FC, type FormEvent } from 'react';
import { X, Loader2, Save, Camera } from 'lucide-react';
import apiService, { BASE_BACKEND_URL } from '../apiService';

interface EditItemDialogProps {
  itemId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const EditItemDialog: FC<EditItemDialogProps> = ({ itemId, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const type = itemId.split('-')[0]; // 'k' or 'o'
  const idStr = itemId.split('-')[1];
  const actualId = parseInt(idStr, 10);

  const [knjigaForm, setKnjigaForm] = useState({ id: 0, naslov: '', isbn: '', leto: 0, stevilo: 0, slikaUrl: '', jezikiId: 1 });
  const [predmetForm, setPredmetForm] = useState({ id: 0, ime: '', serijskaSt: '', opis: '', stevilo: 0, slikaUrl: '', kategorijeId: 1 });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        if (type === 'k') {
          const data = await apiService.getBook(actualId);
          setKnjigaForm(data);
        } else {
          const data = await apiService.getEquipment(actualId);
          setPredmetForm(data);
        }
      } catch (err) {
        console.error('Failed to fetch item', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [type, actualId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await apiService.uploadImage(file);
      if (type === 'k') {
        setKnjigaForm(prev => ({ ...prev, slikaUrl: url }));
      } else {
        setPredmetForm(prev => ({ ...prev, slikaUrl: url }));
      }
    } catch (err: any) {
      console.error('File upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (type === 'k') {
        await apiService.updateBook(actualId, knjigaForm);
      } else {
        await apiService.updateEquipment(actualId, predmetForm);
      }
      onConfirm(); // Success, trigger refresh
    } catch (err) {
      console.error('Failed to update item', err);
    } finally {
      setSaving(false);
    }
  };

  const slikaUrl = type === 'k' ? knjigaForm.slikaUrl : predmetForm.slikaUrl;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">Uredi {type === 'k' ? 'knjigo' : 'predmet'}</h3>
          <button onClick={onCancel} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-primary mb-4" size={32} />
            <p className="text-slate-500 font-medium">Nalagam podatke...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {type === 'k' ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Naslov</label>
                    <input required type="text" className="input bg-slate-50 focus:bg-white w-full h-11" value={knjigaForm.naslov} onChange={(e) => setKnjigaForm({...knjigaForm, naslov: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">ISBN</label>
                    <input required type="text" className="input bg-slate-50 focus:bg-white w-full h-11" value={knjigaForm.isbn} onChange={(e) => setKnjigaForm({...knjigaForm, isbn: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Leto</label>
                      <input required type="number" className="input bg-slate-50 focus:bg-white w-full h-11" value={knjigaForm.leto} onChange={(e) => setKnjigaForm({...knjigaForm, leto: parseInt(e.target.value)})} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Število</label>
                      <input required type="number" min="1" className="input bg-slate-50 focus:bg-white w-full h-11" value={knjigaForm.stevilo} onChange={(e) => setKnjigaForm({...knjigaForm, stevilo: parseInt(e.target.value)})} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Ime</label>
                    <input required type="text" className="input bg-slate-50 focus:bg-white w-full h-11" value={predmetForm.ime} onChange={(e) => setPredmetForm({...predmetForm, ime: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Serijska številka</label>
                    <input type="text" className="input bg-slate-50 focus:bg-white w-full h-11" value={predmetForm.serijskaSt} onChange={(e) => setPredmetForm({...predmetForm, serijskaSt: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Opis</label>
                    <textarea className="input bg-slate-50 focus:bg-white w-full min-h-[80px] py-2" value={predmetForm.opis} onChange={(e) => setPredmetForm({...predmetForm, opis: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Število kozos</label>
                    <input required type="number" min="1" className="input bg-slate-50 focus:bg-white w-full h-11" value={predmetForm.stevilo} onChange={(e) => setPredmetForm({...predmetForm, stevilo: parseInt(e.target.value)})} />
                  </div>
                </>
              )}
              
              <div className="space-y-1.5 pt-2">
                 <label className="text-sm font-bold text-slate-700">Slika (Naloži novo za zamenjavo)</label>
                 <div className="flex items-center gap-3 mt-1">
                   {slikaUrl ? (
                     <img src={slikaUrl.startsWith('/') ? `${BASE_BACKEND_URL}${slikaUrl}` : slikaUrl} className="w-16 h-16 object-cover rounded-xl shadow-sm" alt="Thumbnail" />
                   ) : (
                     <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                       <Camera size={24} />
                     </div>
                   )}
                   <label className="flex-1 btn bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold h-11 rounded-xl cursor-pointer justify-center flex items-center">
                     {uploading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Camera className="mr-2" size={16} />}
                     Spremeni sliko
                     <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                   </label>
                 </div>
              </div>
            </div>

            <div className="px-6 py-5 bg-slate-50/50 flex gap-3 border-t border-slate-100">
              <button 
                type="button"
                onClick={onCancel}
                className="flex-1 btn bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl h-12 font-bold"
              >
                Prekliči
              </button>
              <button 
                type="submit"
                disabled={saving || uploading}
                className="flex-[2] btn btn-primary rounded-xl h-12 font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                Shrani spremembe
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditItemDialog;
