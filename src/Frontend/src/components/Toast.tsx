import { useEffect, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const ToastItem: FC<{ toast: ToastMessage; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const typeConfig = {
    success: {
      icon: <CheckCircle className="text-success" size={20} />,
      bg: 'bg-success/5',
      border: 'border-success/20',
      text: 'text-success-800'
    },
    error: {
      icon: <XCircle className="text-destructive" size={20} />,
      bg: 'bg-destructive/5',
      border: 'border-destructive/20',
      text: 'text-destructive-800'
    },
    info: {
      icon: <Info className="text-info" size={20} />,
      bg: 'bg-info/5',
      border: 'border-info/20',
      text: 'text-info-800'
    }
  };

  const config = typeConfig[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto p-4 rounded-xl border-l-4 shadow-lg backdrop-blur-md flex items-start gap-3 w-80 min-h-[64px] bg-white border-y border-r border-y-slate-200 border-r-slate-200 border-l-${toast.type === 'error' ? 'destructive' : toast.type === 'success' ? 'success' : 'info'}`}
    >
      <div className="shrink-0 mt-0.5">{config.icon}</div>
      <p className="flex-1 text-sm font-medium text-slate-700 leading-snug break-words pr-4">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

const Toast: FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
