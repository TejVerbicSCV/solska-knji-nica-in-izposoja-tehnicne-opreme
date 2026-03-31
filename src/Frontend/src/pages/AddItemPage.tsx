import { useState, useEffect, type FC, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Toast from '../components/Toast';
import apiService from '../apiService';
import type { User } from '../types';
import type { ToastMessage, ToastType } from '../components/Toast';
import { ArrowLeft, Book, Package, Save, Loader2 } from 'lucide-react';

interface AddItemPageProps {
  user: User;
  onLogout: () => void;
}

const AddItemPage: FC<AddItemPageProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<'knjige' | 'predmeti'>('knjige');
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [languages, setLanguages] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [langs, cats] = await Promise.all([
          apiService.getLanguages(),
          apiService.getCategories()
        ]);
        setLanguages(langs);
        setCategories(cats);
        if (langs.length > 0) setKnjigaForm(prev => ({ ...prev, jezikiId: langs[0].id }));
        if (cats.length > 0) setPredmetForm(prev => ({ ...prev, kategorijeId: cats[0].id }));
      } catch (err) {
        console.error('Failed to fetch options', err);
      }
    };
    fetchOptions();
  }, []);

  // Form states for Knjige
  const [knjigaForm, setKnjigaForm] = useState({
    naslov: '',
    isbn: '',
    leto: new Date().getFullYear(),
    stevilo: 1,
    slikaUrl: '',
    jezikiId: 1
  });

  // Form states for Predmeti
  const [predmetForm, setPredmetForm] = useState({
    ime: '',
    serijskaSt: '',
    opis: '',
    stevilo: 1,
    slikaUrl: '',
    kategorijeId: 1
  });

  const addToast = (type: ToastType, message: string) => {
    setToasts((prev) => [...prev, { id: Math.random().toString(), type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category === 'knjige') {
        await apiService.addBook(knjigaForm);
        addToast('success', 'Knjiga uspešno dodana!');
        setKnjigaForm({ naslov: '', isbn: '', leto: new Date().getFullYear(), stevilo: 1, slikaUrl: '', jezikiId: 1 });
      } else {
        await apiService.addEquipment(predmetForm);
        addToast('success', 'Predmet uspešno dodan!');
        setPredmetForm({ ime: '', serijskaSt: '', opis: '', stevilo: 1, slikaUrl: '', kategorijeId: 1 });
      }
    } catch (err: any) {
      addToast('error', 'Prišlo je do napake pri dodajanju.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <Header user={user} onLogout={onLogout} />
      
      <main className="max-w-3xl mx-auto px-4 mt-8 space-y-6">
        <button 
          onClick={() => navigate('/librarian')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors font-medium text-sm w-fit"
        >
          <ArrowLeft size={16} />
          Nazaj na nadzorno ploščo
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden shadow-slate-200/50">
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dodaj nov predmet</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Izpolnite podatke za novo knjigo ali kos opreme</p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex bg-slate-100 p-1 rounded-xl mb-8 w-fit mx-auto sm:mx-0">
              <button
                type="button"
                onClick={() => setCategory('knjige')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  category === 'knjige' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Book size={18} />
                Knjiga
              </button>
              <button
                type="button"
                onClick={() => setCategory('predmeti')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  category === 'predmeti' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Package size={18} />
                Oprema
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {category === 'knjige' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Naslov</label>
                      <input required type="text" className="input bg-slate-50 focus:bg-white w-full h-11" placeholder="Naslov knjige" value={knjigaForm.naslov} onChange={(e) => setKnjigaForm({...knjigaForm, naslov: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">ISBN</label>
                      <input required type="text" className="input bg-slate-50 focus:bg-white w-full h-11" placeholder="ISBN številka" value={knjigaForm.isbn} onChange={(e) => setKnjigaForm({...knjigaForm, isbn: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Leto izida</label>
                      <input required type="number" className="input bg-slate-50 focus:bg-white w-full h-11" value={knjigaForm.leto} onChange={(e) => setKnjigaForm({...knjigaForm, leto: parseInt(e.target.value)})} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Število izvodov</label>
                      <input required type="number" min="1" className="input bg-slate-50 focus:bg-white w-full h-11" value={knjigaForm.stevilo} onChange={(e) => setKnjigaForm({...knjigaForm, stevilo: parseInt(e.target.value)})} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Jezik</label>
                      <select required className="input bg-slate-50 focus:bg-white w-full h-11" value={knjigaForm.jezikiId} onChange={(e) => setKnjigaForm({...knjigaForm, jezikiId: parseInt(e.target.value)})}>
                        {languages.map(lang => (
                          <option key={lang.id} value={lang.id}>{lang.ime}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">URL slike (neobvezno)</label>
                    <input type="text" className="input bg-slate-50 focus:bg-white w-full h-11" placeholder="https://..." value={knjigaForm.slikaUrl} onChange={(e) => setKnjigaForm({...knjigaForm, slikaUrl: e.target.value})} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Ime opreme</label>
                      <input required type="text" className="input bg-slate-50 focus:bg-white w-full h-11" placeholder="Ime prenosnika, miške..." value={predmetForm.ime} onChange={(e) => setPredmetForm({...predmetForm, ime: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Serijska številka</label>
                      <input type="text" className="input bg-slate-50 focus:bg-white w-full h-11" placeholder="SN-12345" value={predmetForm.serijskaSt} onChange={(e) => setPredmetForm({...predmetForm, serijskaSt: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Opis</label>
                    <textarea className="input bg-slate-50 focus:bg-white w-full min-h-[100px] resize-y py-3" placeholder="Kratek opis predmeta..." value={predmetForm.opis} onChange={(e) => setPredmetForm({...predmetForm, opis: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Število kosov</label>
                      <input required type="number" min="1" className="input bg-slate-50 focus:bg-white w-full h-11" value={predmetForm.stevilo} onChange={(e) => setPredmetForm({...predmetForm, stevilo: parseInt(e.target.value)})} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Kategorija</label>
                      <select required className="input bg-slate-50 focus:bg-white w-full h-11" value={predmetForm.kategorijeId} onChange={(e) => setPredmetForm({...predmetForm, kategorijeId: parseInt(e.target.value)})}>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.ime}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">URL slike (neobvezno)</label>
                    <input type="text" className="input bg-slate-50 focus:bg-white w-full h-11" placeholder="https://..." value={predmetForm.slikaUrl} onChange={(e) => setPredmetForm({...predmetForm, slikaUrl: e.target.value})} />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 flex-col sm:flex-row">
                <button 
                  type="button" 
                  onClick={() => navigate('/librarian')}
                  className="btn bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 h-11 px-6 font-bold"
                >
                  Prekliči
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary h-11 px-8 gap-2 shadow-lg shadow-primary/25 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Shrani
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default AddItemPage;
