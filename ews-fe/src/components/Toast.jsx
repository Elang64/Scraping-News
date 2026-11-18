// src/components/Toast.jsx
import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: CheckCircle2,
    error: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200 shadow-glass-glow',
    error: 'bg-red-950/80 border-red-500/40 text-red-200 shadow-glass-glow-red',
    info: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-200 shadow-glass',
  };

  const Icon = icons[toast.type] || Info;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-short">
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-2xl border backdrop-blur-xl ${
          colors[toast.type] || colors.info
        } max-w-md`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-xs font-semibold">{toast.message}</span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
