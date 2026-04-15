import { useState, useCallback, useEffect, type FC } from 'react';
import { BookOpen, Laptop, PackageOpen, LayoutGrid, Search, Hash, Filter, Loader2, BellRing, Briefcase } from 'lucide-react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import ItemCard from '../components/ItemCard';
import ReservationDialog from '../components/ReservationDialog';
import Toast from '../components/Toast';
import type { ToastMessage, ToastType } from '../components/Toast';
import type { User, LibraryItem } from '../types';
import { apiService } from '../apiService';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

const StudentDashboard: FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'knjige' | 'oprema' | 'rezervacije' | 'izposojeno'>('knjige');
  const [activeSubTab, setActiveSubTab] = useState<'vse' | 'prenosniki' | 'kamere' | 'drugo'>('vse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    setToasts((prev) => [...prev, { id: Math.random().toString(), type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [itemsData, resData, loansData] = await Promise.all([
          apiService.getItems(),
          apiService.getReservations(),
          apiService.getLoans()
        ]);
        setItems(itemsData);
        setReservations(resData);
        setLoans(loansData);
      } catch (err) {
        addToast('error', 'Napaka pri nalaganju podatkov.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addToast]);

  const handleReserve = (item: LibraryItem) => {
    setSelectedItem(item);
  };

  const confirmReservation = async (start: string, end: string) => {
    if (selectedItem) {
      try {
        await apiService.reserveItem({
          itemId: selectedItem.id,
          userId: user.id,
          datumOd: start,
          datumDo: end
        });
        addToast('success', `Uspešna rezervacija predmeta ${selectedItem.naziv} od ${start} do ${end}.`);
        setSelectedItem(null);
      } catch (err: any) {
        addToast('error', err.response?.data || 'Napaka pri rezervaciji.');
      }
    }
  };

  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'knjige' ? item.kategorija === 'knjiga' : item.kategorija !== 'knjiga';
    let matchesSubTab = true;
    
    if (activeTab === 'oprema' && activeSubTab !== 'vse') {
      if (activeSubTab === 'prenosniki') matchesSubTab = item.kategorija === 'prenosnik';
      else if (activeSubTab === 'kamere') matchesSubTab = item.kategorija === 'kamera';
      else matchesSubTab = item.kategorija === 'oprema';
    }

    const matchesSearch = item.naziv.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.opis.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesTab && matchesSubTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <Header user={user} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Skupaj Predmetov" value={items.length} icon={Hash} color="primary" />
          <StatCard label="Na Voljo" value={items.filter(i => i.status === 'na_voljo').length} icon={PackageOpen} color="success" />
          <StatCard label="Izposojeno" value={items.filter(i => i.status === 'izposojeno').length} icon={BookOpen} color="info" />
          <StatCard label="Moje Rezervacije" value={reservations.filter(r => r.studentId === user.id.toString() && (r.status || '').toLowerCase() === 'aktivna').length} icon={Laptop} color="warning" />
        </div>

        {/* Main Panel */}
        <div className="bg-white border rounded-3xl border-slate-200 shadow-xl overflow-hidden shadow-slate-200/50">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pregled in rezervacije</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Iskanje in pregled knjig ter tehnične opreme</p>
          </div>

          <div className="p-6 pb-0 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Iskanje po nazivih in opisih..."
                className="input pl-12 h-12 w-full text-base bg-slate-50 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-outline h-12 px-6 bg-slate-50 flex items-center justify-center sm:justify-start">
              <Filter size={18} />
              <span>Status Filter</span>
            </button>
          </div>

          <div className="border-b border-slate-100 flex overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('knjige')}
              className={`px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap border-b-2 flex items-center gap-2 ${
                activeTab === 'knjige' 
                  ? 'border-primary text-primary bg-primary/5' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'
              }`}
            >
              <BookOpen size={18} />
              Knjige
            </button>
            <button 
              onClick={() => { setActiveTab('oprema'); setActiveSubTab('vse'); }}
              className={`px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap border-b-2 flex items-center gap-2 ${
                activeTab === 'oprema' 
                  ? 'border-primary text-primary bg-primary/5' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'
              }`}
            >
              <Laptop size={18} />
              Oprema
            </button>
            <button 
              onClick={() => setActiveTab('rezervacije')}
              className={`px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap border-b-2 flex items-center gap-2 ${
                activeTab === 'rezervacije' 
                  ? 'border-primary text-primary bg-primary/5' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'
              }`}
            >
              <BellRing size={18} />
              Moje Rezervacije
            </button>
            <button 
              onClick={() => setActiveTab('izposojeno')}
              className={`px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap border-b-2 flex items-center gap-2 ${
                activeTab === 'izposojeno' 
                  ? 'border-primary text-primary bg-primary/5' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'
              }`}
            >
              <Briefcase size={18} />
              Izposojeno
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'oprema' && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                {[
                  { id: 'vse', label: 'Vse', icon: LayoutGrid },
                  { id: 'prenosniki', label: 'Prenosniki', icon: Laptop },
                  { id: 'kamere', label: 'Kamere', icon: PackageOpen },
                  { id: 'drugo', label: 'Druga oprema', icon: PackageOpen },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap border transition-all ${
                      activeSubTab === tab.id 
                        ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'rezervacije' ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Predmet</th>
                        <th className="px-6 py-4">Datum od</th>
                        <th className="px-6 py-4">Datum do</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reservations.filter(r => r.studentId === user.id.toString()).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                             <BellRing size={40} className="mx-auto mb-3 opacity-20" />
                             Nimate aktivnih rezervacij
                          </td>
                        </tr>
                      ) : (
                        reservations.filter(r => r.studentId === user.id.toString()).map(res => (
                          <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4 font-semibold text-slate-700">{res.itemName}</td>
                            <td className="px-6 py-4 text-slate-500 font-medium">{res.datumOd}</td>
                            <td className="px-6 py-4 text-slate-500 font-medium text-warning">{res.datumDo}</td>
                            <td className="px-6 py-4">
                              <span className={`badge ${res.status === 'potrjena' ? 'badge-success' : res.status === 'zavrnjena' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-warning/10 text-warning border border-warning/20'} capitalize`}>
                                {res.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
            ) : activeTab === 'izposojeno' ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Predmet</th>
                        <th className="px-6 py-4">Datum izposoje</th>
                        <th className="px-6 py-4">Konec izposoje (Rok)</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loans.filter(l => l.studentId === user.id.toString()).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                             <Briefcase size={40} className="mx-auto mb-3 opacity-20" />
                             Nimate izposojenih predmetov
                          </td>
                        </tr>
                      ) : (
                        loans.filter(l => l.studentId === user.id.toString()).map(loan => (
                          <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4 font-semibold text-slate-700">{loan.itemName}</td>
                            <td className="px-6 py-4 text-slate-500 font-medium">{loan.datumIzposoje}</td>
                            <td className="px-6 py-4 text-slate-500 font-medium text-warning">{loan.datumVrnitve}</td>
                            <td className="px-6 py-4">
                              <span className={`badge ${loan.status === 'v_teku' ? 'bg-info/10 text-info border border-info/20' : 'badge-success'}`}>
                                {loan.status === 'v_teku' ? 'Izposojeno' : 'Vrnjeno'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 gap-y-6 min-h-[400px]">
                  {loading ? (
                <div className="col-span-full h-64 flex items-center justify-center">
                  <Loader2 className="animate-spin text-primary" size={40} />
                </div>
              ) : filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    onAction={handleReserve}
                    actionLabel="Rezerviraj"
                  />
                ))
              ) : (
                <div className="col-span-1 xl:col-span-2 text-center text-slate-400 py-12 flex flex-col items-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <PackageOpen size={48} className="mb-4 text-slate-300" />
                  <p className="font-semibold text-lg text-slate-500">Ni najdenih predmetov</p>
                  <p className="text-sm">Poskusite spremeniti iskalne kriterije.</p>
                </div>
              )}
            </div>
            )}
          </div>
        </div>
      </main>

      {selectedItem && (
        <ReservationDialog 
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onConfirm={confirmReservation}
        />
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default StudentDashboard;
