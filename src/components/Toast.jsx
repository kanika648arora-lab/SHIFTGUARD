import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl p-4 shadow-2xl border flex items-start space-x-3 transition-all duration-300 transform translate-y-0 opacity-100 ${
              toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : toast.type === 'info'
                ? 'bg-navy-900 text-white border-navy-700'
                : 'bg-emerald-950 text-white border-emerald-600/60'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'error' ? (
                <XCircle className="w-5 h-5 text-rose-300" />
              ) : toast.type === 'info' ? (
                <Info className="w-5 h-5 text-blue-300" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
            </div>

            <div className="flex-1 pr-1">
              <h4 className="text-xs font-bold tracking-tight text-white">
                {toast.title}
              </h4>
              <p className="text-[11px] text-slate-200 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
