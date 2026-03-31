import type { FC } from 'react';
import { BookOpen, Laptop, Camera, Package, MapPin, Hash } from 'lucide-react';
import type { LibraryItem } from '../types';

interface ItemCardProps {
  item: LibraryItem;
  onAction: (item: LibraryItem) => void;
  actionLabel: string;
}

const ItemCard: FC<ItemCardProps> = ({ item, onAction, actionLabel }) => {
  const getIcon = () => {
    switch (item.kategorija) {
      case 'knjiga': return <BookOpen size={18} />;
      case 'prenosnik': return <Laptop size={18} />;
      case 'kamera': return <Camera size={18} />;
      default: return <Package size={18} />;
    }
  };

  const statusMap = {
    na_voljo: { label: 'Na voljo', class: 'badge-available' },
    izposojeno: { label: 'Izposojeno', class: 'badge-borrowed' },
    rezervirano: { label: 'Rezervirano', class: 'badge-reserved' },
    v_popravilu: { label: 'V popravilu', class: 'badge-repair' },
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex h-40 group">
      <div className="w-32 sm:w-40 relative flex-shrink-0 bg-slate-100">
        {item.slika ? (
          <img src={item.slika} alt={item.naziv} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            {getIcon()}
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={`badge ${statusMap[item.status].class}`}>
              {statusMap[item.status].label}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
               {getIcon()} {item.kategorija}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 truncate text-lg leading-tight group-hover:text-primary transition-colors">{item.naziv}</h3>
          <p className="text-slate-500 text-sm line-clamp-2 mt-1">{item.opis}</p>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Hash size={14} />
              <span className="text-xs font-medium">{item.inventarnaStevilka}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin size={14} />
              <span className="text-xs truncate">{item.lokacija}</span>
            </div>
          </div>
          
          <button 
            onClick={() => onAction(item)}
            className="btn btn-primary h-9 px-4 text-sm"
            disabled={item.status !== 'na_voljo'}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
