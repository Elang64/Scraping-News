// src/components/ScraperControl.jsx
import React, { useState } from 'react';
import { Play, Square, Zap, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function ScraperControl({ scraperStatus, onStatusChange, showToast }) {
  const [loadingAction, setLoadingAction] = useState(null);

  const handleAction = async (action) => {
    const actionLabels = {
      start: 'menyalakan scraper otomatis',
      stop: 'menghentikan scraper',
      'run-now': 'menjalankan scraping manual sekarang',
    };

    if (!confirm(`Konfirmasi: Apakah Anda yakin ingin ${actionLabels[action]}?`)) {
      return;
    }

    try {
      setLoadingAction(action);
      let res;
      if (action === 'start') {
        res = await api.startScraper();
      } else if (action === 'stop') {
        res = await api.stopScraper();
      } else if (action === 'run-now') {
        res = await api.runScraperNow();
      }

      showToast?.(res?.message || 'Aksi berhasil dieksekusi', 'success');
      // Refresh status after slight delay
      setTimeout(() => {
        onStatusChange?.();
      }, 1200);
    } catch (err) {
      showToast?.(err.message || 'Gagal menjalankan aksi scraper', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const isRunning = Boolean(scraperStatus?.running);
  const nextRun = scraperStatus?.next_run_time
    ? new Date(scraperStatus.next_run_time).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    : null;

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status info */}
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              isRunning
                ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse'
                : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
            }`}
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status Scheduler Scraper:
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                  isRunning
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-red-500/15 text-red-300 border-red-500/30'
                }`}
              >
                {isRunning ? 'AKTIF (RUNNING)' : 'BERHENTI (STOPPED)'}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {nextRun
                  ? `Jadwal scrape berikutnya: ${nextRun} WIB`
                  : 'Scheduler dalam kondisi pasif atau belum dijadwalkan'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Start Button */}
          <button
            onClick={() => handleAction('start')}
            disabled={loadingAction !== null || isRunning}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isRunning
                ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500 border border-white/5'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 shadow-glass-glow'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{loadingAction === 'start' ? 'Menyalakan...' : 'Start Scraper'}</span>
          </button>

          {/* Stop Button */}
          <button
            onClick={() => handleAction('stop')}
            disabled={loadingAction !== null || !isRunning}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              !isRunning
                ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500 border border-white/5'
                : 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 shadow-glass-glow-red'
            }`}
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>{loadingAction === 'stop' ? 'Menghentikan...' : 'Stop Scraper'}</span>
          </button>

          {/* Run Now Button */}
          <button
            onClick={() => handleAction('run-now')}
            disabled={loadingAction !== null}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all shadow-glass"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-cyan-400" />
            <span>{loadingAction === 'run-now' ? 'Memicu Scraper...' : 'Scrape Sekarang'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
