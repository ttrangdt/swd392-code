import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  toast: { message: string; type: 'success' | 'error' } | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
      <div
        className={`flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-xl border backdrop-blur-md max-w-md ${
          isError
            ? 'bg-rose-900/95 border-rose-700 text-white'
            : 'bg-emerald-900/95 border-emerald-700 text-white'
        }`}
      >
        {isError ? (
          <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
        )}
        <div className="flex-1 text-sm font-medium leading-relaxed">
          {toast.message}
        </div>
        <button
          onClick={onClose}
          className="text-slate-300 hover:text-white p-0.5 rounded-md hover:bg-white/10 transition cursor-pointer"
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

