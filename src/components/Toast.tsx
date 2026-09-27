import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-emerald-300 bg-white text-emerald-900';
        let Icon = CheckCircle2;
        let iconColor = 'text-emerald-600';

        if (toast.type === 'warning') {
          borderClass = 'border-amber-300 bg-white text-amber-900';
          Icon = AlertTriangle;
          iconColor = 'text-amber-600';
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-300 bg-white text-rose-900';
          Icon = AlertTriangle;
          iconColor = 'text-rose-600';
        } else if (toast.type === 'info') {
          borderClass = 'border-blue-300 bg-white text-blue-900';
          Icon = Info;
          iconColor = 'text-blue-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between p-3.5 rounded-xl border shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${borderClass}`}
          >
            <div className="flex items-start gap-2.5">
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
