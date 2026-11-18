// src/components/AlertDetailModal.jsx
import React from 'react';
import {
  X,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Calendar,
  Send,
  Building,
  Tag,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';

export default function AlertDetailModal({ alert, onClose }) {
  if (!alert) return null;

  const score = Number(alert.severity_score || 0);
  const isHigh = score >= 6;
  const isMid = score >= 4 && score < 6;

  const scoreColor = isHigh
    ? 'text-red-400 bg-red-500/15 border-red-500/30'
    : isMid
    ? 'text-amber-400 bg-amber-500/15 border-amber-500/30'
    : 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';

  const categories = alert.matched_categories
    ? alert.matched_categories.split(',').map((c) => c.trim())
    : [];

  const words = alert.matched_words
    ? alert.matched_words.split(',').map((w) => w.trim())
    : [];

  const createdDate = alert.created_at
    ? new Date(alert.created_at).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '-';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div 
        className="glass-panel w-full max-w-2xl rounded-2xl border border-white/20 p-6 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow behind */}
        <div className={`absolute top-0 right-0 w-72 h-72 rounded-full filter blur-3xl opacity-20 pointer-events-none ${
          isHigh ? 'bg-red-500' : 'bg-emerald-500'
        }`} />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${scoreColor}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Detail Peringatan Dini
              </span>
              <h3 className="text-base font-bold text-white leading-snug">
                ID Alert #{alert.id}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="py-5 space-y-4 max-h-[75vh] overflow-y-auto pr-1 relative z-10">
          {/* Article Title */}
          <div>
            <h4 className="text-lg font-bold text-white leading-relaxed">
              {alert.title}
            </h4>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                {alert.source || 'Media Online'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                {createdDate} WIB
              </span>
            </div>
          </div>

          {/* Severity & Notification Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Score Card */}
            <div className="glass-panel p-3.5 rounded-xl border border-white/10">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Tingkat Keparahan (Severity Score)
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-2xl font-black font-mono px-3 py-0.5 rounded-lg border ${scoreColor}`}>
                  {score.toFixed(1)}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {isHigh
                    ? 'Tinggi (Prioritas Tindakan Segera)'
                    : isMid
                    ? 'Sedang (Perlu Pemantauan Teritorial)'
                    : 'Rendah (Informasi Awal)'}
                </span>
              </div>
            </div>

            {/* Telegram Notification Status */}
            <div className="glass-panel p-3.5 rounded-xl border border-white/10">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Status Telegram Notifier
              </div>
              <div className="flex items-center space-x-2 mt-1">
                {alert.notified ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300">
                      Terkirim ke Bot Telegram (@ews_tniad_bot)
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">
                      Pending / Belum Notifikasi
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Matched Categories */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
              Kategori Terdeteksi:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.length > 0 ? (
                categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  >
                    #{cat}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">Tidak ada kategori</span>
              )}
            </div>
          </div>

          {/* Matched Keywords */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
              Kata Kunci Sensitif (Matched Keywords):
            </label>
            <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-900/60 border border-white/5">
              {words.length > 0 ? (
                words.map((word, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40"
                  >
                    "{word}"
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">Tidak ada kata spesifik</span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Tutup
          </button>

          {alert.link && (
            <a
              href={alert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all shadow-glass-glow"
            >
              <span>Buka Berita Asli</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
