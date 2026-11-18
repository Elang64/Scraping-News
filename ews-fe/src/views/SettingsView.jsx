// src/views/SettingsView.jsx
import React, { useState } from 'react';
import {
  Sliders,
  Server,
  Zap,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Shield,
  Radio,
  SlidersHorizontal,
  Save,
  RotateCcw
} from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl, DEFAULT_BASE_URL, api } from '../services/api';

export default function SettingsView({
  autoRefreshInterval,
  setAutoRefreshInterval,
  showToast,
  onRefreshAll,
}) {
  const [backendUrl, setBackendUrl] = useState(getApiBaseUrl());
  const [testingPing, setTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState(null);

  const presets = [
    { label: 'IP 10.10.100.10:8000 (Target Lab)', url: 'http://10.10.100.10:8000' },
    { label: 'IP 10.10.100.1:8000 (Host Topologi)', url: 'http://10.10.100.1:8000' },
    { label: 'Localhost:8000 (Pengembangan)', url: 'http://localhost:8000' },
    { label: 'Nginx Proxy (Same Origin)', url: window.location.origin },
  ];

  const handleSaveUrl = () => {
    setApiBaseUrl(backendUrl);
    showToast('Alamat URL Backend berhasil disimpan!', 'success');
    onRefreshAll?.();
  };

  const handleResetDefault = () => {
    setBackendUrl(DEFAULT_BASE_URL);
    setApiBaseUrl(DEFAULT_BASE_URL);
    showToast(`Alamat direset ke default: ${DEFAULT_BASE_URL}`, 'info');
    onRefreshAll?.();
  };

  const testConnection = async () => {
    setTestingPing(true);
    setPingResult(null);
    const start = performance.now();
    try {
      const res = await api.getStatus();
      const latency = Math.round(performance.now() - start);
      setPingResult({
        success: true,
        latency,
        message: `Koneksi Berhasil! Uptime sejak: ${res.started_at ? new Date(res.started_at).toLocaleString('id-ID') : 'Aktif'}`,
        data: res,
      });
      showToast(`Koneksi ke backend sukses (${latency}ms)`, 'success');
    } catch (err) {
      const latency = Math.round(performance.now() - start);
      setPingResult({
        success: false,
        latency,
        message: err.message || 'Tidak dapat menghubungi server backend.',
      });
      showToast('Gagal menghubungi backend di alamat tersebut', 'error');
    } finally {
      setTestingPing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            Konfigurasi IP & Koneksi Backend
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Atur alamat endpoint API ews-be, interval auto-refresh, dan parameter deteksi isu
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Backend Connection Config */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-white/10">
              <Server className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Alamat Endpoint Backend (EWS-BE)
              </h3>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Target Base URL Backend:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  className="glass-input flex-1 px-3.5 py-2 rounded-xl text-xs font-mono"
                  placeholder="http://10.10.100.10:8000"
                />
                <button
                  onClick={handleSaveUrl}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all shadow-glass-glow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>
            </div>

            {/* Presets */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Pilih Preset Cepat:
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setBackendUrl(p.url);
                      setApiBaseUrl(p.url);
                      showToast(`Backend dialihkan ke: ${p.url}`, 'info');
                      onRefreshAll?.();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      backendUrl === p.url
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
                <button
                  onClick={handleResetDefault}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium border border-white/5 bg-slate-900/40 text-slate-400 hover:text-white flex items-center space-x-1"
                  title="Kembalikan ke Default IP 10.10.100.10"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>

            {/* Test Connection Button & Ping Status */}
            <div className="pt-3 border-t border-white/10">
              <button
                onClick={testConnection}
                disabled={testingPing}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all shadow-glass"
              >
                <Zap className={`w-3.5 h-3.5 ${testingPing ? 'animate-bounce' : ''}`} />
                <span>{testingPing ? 'Menguji Koneksi...' : 'Uji Koneksi (Test Ping /api/status)'}</span>
              </button>

              {pingResult && (
                <div
                  className={`mt-3 p-3.5 rounded-xl border text-xs ${
                    pingResult.success
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                      : 'bg-red-950/40 border-red-500/30 text-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="flex items-center gap-1.5">
                      {pingResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      {pingResult.success ? 'Koneksi Berhasil' : 'Koneksi Gagal'}
                    </span>
                    <span className="font-mono text-[11px]">
                      Latensi: {pingResult.latency} ms
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90">{pingResult.message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Auto Refresh Setting */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-white/10">
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Pengaturan Pembaruan Otomatis (Auto Refresh)
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { label: 'Nonaktif', value: 0 },
                { label: 'Setiap 15 Detik', value: 15 },
                { label: 'Setiap 30 Detik (Disarankan)', value: 30 },
                { label: 'Setiap 60 Detik', value: 60 },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setAutoRefreshInterval(item.value);
                    showToast(
                      item.value === 0
                        ? 'Auto-refresh dinonaktifkan'
                        : `Auto-refresh diatur ke ${item.value} detik`,
                      'info'
                    );
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    autoRefreshInterval === item.value
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glass-glow'
                      : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: EWS Detection Rules Summary */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-white/10">
            <Shield className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Parameter Algoritma Deteksi
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
              <span className="text-[11px] font-bold text-slate-300 block mb-1">
                Ambang Batas Peringatan (ALERT_THRESHOLD):
              </span>
              <div className="text-amber-400 font-mono font-bold text-base">
                Skor &ge; 2.0
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Artikel dengan skor di bawah 2 hanya disimpan sebagai arsip tanpa alert Telegram.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
              <span className="text-[11px] font-bold text-slate-300 block mb-1.5">
                Kategori Bobot Kata Negatif:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li className="flex justify-between">
                  <span>Pelanggaran HAM:</span>
                  <b className="text-red-400 font-mono">+4 poin</b>
                </li>
                <li className="flex justify-between">
                  <span>Pelanggaran Hukum & Suap:</span>
                  <b className="text-red-400 font-mono">+3 poin</b>
                </li>
                <li className="flex justify-between">
                  <span>Kekerasan & Baku Tembak:</span>
                  <b className="text-red-400 font-mono">+3 poin</b>
                </li>
                <li className="flex justify-between">
                  <span>Disiplin Internal & Oknum:</span>
                  <b className="text-amber-400 font-mono">+2 poin</b>
                </li>
                <li className="flex justify-between">
                  <span>Isu Viral / Ramai:</span>
                  <b className="text-emerald-400 font-mono">+1 poin</b>
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
              <span className="text-[11px] font-bold text-slate-300 block mb-1">
                Interval Scrape Periodik:
              </span>
              <div className="text-cyan-400 font-mono font-bold">
                15 Menit Sekali (APScheduler)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
