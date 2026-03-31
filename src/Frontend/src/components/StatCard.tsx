import type { FC } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: 'primary' | 'success' | 'info' | 'warning' | 'destructive';
}

const StatCard: FC<StatCardProps> = ({ label, value, icon: Icon, color }) => {
  const colorMap = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/20',
    info: 'bg-info/10 text-info border-info/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-slate-500 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
