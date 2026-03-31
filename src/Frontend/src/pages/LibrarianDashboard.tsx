import { useState, useCallback, useEffect, type FC } from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import Toast from '../components/Toast';
import apiService from '../apiService';
import ReturnItemDialog from '../components/ReturnItemDialog';
import type { ToastMessage, ToastType } from '../components/Toast';
import type { User } from '../types';
import { PackageOpen, Users, BellRing, Briefcase, Plus, Search, Loader2, CheckCircle2, XCircle, ArrowLeftRight, LogOut } from 'lucide-react';

interface LibrarianDashboardProps {
  user: User;
  onLogout: () => void;
}

const LibrarianDashboard: FC<LibrarianDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'izposoje' | 'rezervacije'>('izposoje');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [returnItem, setReturnItem] = useState<any | null>(null);

  const addToast = useCallback((type: ToastType, message: string) => {
    setToasts((prev) => [...prev, { id: Math.random().toString(), type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resData, loanData] = await Promise.all([
        apiService.getReservations(),
        apiService.getLoans()
      ]);
      setReservations(resData);
      setLoans(loanData);
    } catch (err: any) {
      addToast('error', 'Napaka pri nalaganju podatkov.');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReturnConfirm = async (poskodba: string) => {
    if (!returnItem) return;
    try {
      await apiService.returnItem(returnItem.id, { poskodbaOpis: poskodba });
      addToast('success', `Uspešno vrnjeno: ${returnItem.itemName}`);
      setReturnItem(null);
      fetchData();
    } catch (err: any) {
      addToast('error', 'Napaka pri vračilu predmeta.');
    }
  };

  const filteredReservations = reservations.filter(r => 
    r.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLoans = loans.filter(l => 
    l.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'potrjena': return 'badge-success';
      case 'preklicana': return 'badge-destructive';
      case 'aktivna': return 'badge-warning';
      case 'v_teku': return 'badge-info';
      case 'vrnjeno': return 'badge-success';
      default: return 'badge-outline';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <Header 
        user={user} 
        onLogout={onLogout} 
        actions={
          <button className="btn btn-primary h-9 px-4 text-sm gap-1.5 shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all hidden sm:flex">
            <Plus size={16} />
            Dodaj predmet
          </button>
        }
      />
      
      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Aktivne Izposoje" value={loans.filter(l => l.status === 'v_teku').length} icon={Briefcase} color="info" />
          <StatCard label="Nove Rezervacije" value={reservations.filter(r => r.status === 'aktivna').length} icon={BellRing} color="warning" />
          <StatCard label="Zamudniki" value={0} icon={Users} color="destructive" />
          <StatCard label="Skupaj Predmetov" value={156} icon={PackageOpen} color="primary" />
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden shadow-slate-200/50">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upravljanje knjižnice</h2>
              <p className="text-sm text-slate-500 font-medium">Upravljanje izposoj, rezervacij in vrnitev</p>
            </div>
          </div>

          <div className="border-b border-slate-100 flex overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('izposoje')}
              className={`px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap border-b-2 flex items-center gap-2 ${
                activeTab === 'izposoje' 
                  ? 'border-primary text-primary bg-primary/5' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'
              }`}
            >
              <Briefcase size={18} />
              Izposoje
              {loans.filter(l => l.status === 'v_teku').length > 0 && (
                <span className="bg-info text-white text-[10px] px-2 py-0.5 rounded-full ml-1 font-bold">{loans.filter(l => l.status === 'v_teku').length}</span>
              )}
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
              Rezervacije
              {reservations.filter(r => r.status === 'aktivna').length > 0 && (
                <span className="bg-warning text-white text-[10px] px-2 py-0.5 rounded-full ml-1 font-bold">{reservations.filter(r => r.status === 'aktivna').length}</span>
              )}
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Iskanje po nazivih in dijakih..."
                  className="input pl-12 h-12 w-full text-base bg-slate-50 focus:bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="animate-spin text-primary mb-4" size={40} />
                  <p className="text-slate-500 font-medium italic">Nalagam podatke iz baze...</p>
                </div>
              ) : activeTab === 'rezervacije' ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Predmet</th>
                        <th className="px-6 py-4">Dijak</th>
                        <th className="px-6 py-4">Datum od</th>
                        <th className="px-6 py-4">Datum do</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Akcije</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredReservations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                             <BellRing size={40} className="mx-auto mb-3 opacity-20" />
                             Ni najdenih rezervacij
                          </td>
                        </tr>
                      ) : (
                        filteredReservations.map(res => (
                          <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4 px-6 py-4">
                              <span className="font-semibold text-slate-700">{res.itemName}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-slate-600 font-medium">{res.studentName}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                              {res.datumOd}
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                              {res.datumDo}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`badge ${getStatusBadge(res.status)} text-[10px] font-bold uppercase py-1 pr-3 pl-2.5 flex items-center gap-1.5 w-fit`}>
                                <span className={`w-1.5 h-1.5 rounded-full bg-white opacity-60 ${res.status === 'aktivna' ? 'animate-pulse' : ''}`}></span>
                                {res.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                {res.status === 'aktivna' && (
                                  <>
                                    <button 
                                      className="p-2 text-success/50 rounded-lg cursor-not-allowed" 
                                      title="Pretvori v izposojo"
                                      disabled
                                    >
                                      <ArrowLeftRight size={20} />
                                    </button>
                                    <button 
                                      className="p-2 text-destructive/50 rounded-lg cursor-not-allowed" 
                                      title="Prekliči"
                                      disabled
                                    >
                                      <XCircle size={20} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Predmet</th>
                        <th className="px-6 py-4">Dijak</th>
                        <th className="px-6 py-4 whitespace-nowrap">Izposojeno</th>
                        <th className="px-6 py-4 whitespace-nowrap">Vrnjeno</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Akcije</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLoans.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                             <Briefcase size={40} className="mx-auto mb-3 opacity-20" />
                             Ni aktivnih izposoj
                          </td>
                        </tr>
                      ) : (
                        filteredLoans.map(loan => (
                          <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4 uppercase">
                              <span className="font-semibold text-slate-700">{loan.itemName}</span>
                              {loan.poskodbaOpis && (
                                <div className="text-[10px] text-destructive/80 font-bold mt-1 bg-destructive/5 px-2 py-0.5 rounded w-fit border border-destructive/10">
                                  POŠKODBA: {loan.poskodbaOpis}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-slate-600 font-medium">{loan.studentName}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-medium">
                              {loan.datumIzposoje}
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-medium">
                              {loan.datumVrnitve}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`badge ${getStatusBadge(loan.status)} text-[10px] font-bold uppercase py-1 pr-3 pl-2.5 flex items-center gap-1.5 w-fit`}>
                                <span className={`w-1.5 h-1.5 rounded-full bg-white opacity-60 ${loan.status === 'v_teku' ? 'animate-pulse' : ''}`}></span>
                                {loan.status === 'v_teku' ? 'V teku' : loan.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                {loan.status === 'v_teku' && (
                                  <button 
                                    onClick={() => setReturnItem(loan)}
                                    className="p-2 text-warning hover:bg-warning/10 rounded-lg transition-colors" 
                                    title="Označi kot vrnjeno"
                                  >
                                    <LogOut size={20} />
                                  </button>
                                )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {returnItem && (
        <ReturnItemDialog 
          itemName={returnItem.itemName}
          onConfirm={handleReturnConfirm}
          onCancel={() => setReturnItem(null)}
        />
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default LibrarianDashboard;
