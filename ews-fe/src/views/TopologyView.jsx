// src/views/TopologyView.jsx
import React from 'react';
import {
  Network,
  Server,
  Layers,
  Database,
  Radio,
  Monitor,
  Lock,
  Globe,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function TopologyView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Topologi Infrastruktur EWS Monitoring Media
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Arsitektur deployment sistem: Nginx Reverse Proxy, Docker Engine, PostgreSQL, dan Klasifikasi Alert Level 1–5
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
            Domain: ews-tniad.mil.id
          </span>
        </div>
      </div>

      {/* Main Architecture Diagram Interactive Glass Board */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Tier: Client & External Users */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel rounded-2xl p-4 border border-white/10 bg-slate-900/50">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
              <Monitor className="w-4 h-4" />
              <span>Klien / Pengguna Web</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span>Browser PC / Laptop:</span>
                <span className="font-mono text-emerald-400">https://ews-tniad.mil.id</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Smartphone / Mobile:</span>
                <span className="font-mono text-cyan-400">PWA Responsive</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-white/10 bg-slate-900/50">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              <Layers className="w-4 h-4" />
              <span>Sistem Peringatan Dini</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span>Klasifikasi Resiko:</span>
                <span className="font-mono text-emerald-300 font-bold">Level 1 s.d. 5</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Ambang Batas Skor:</span>
                <span className="font-mono text-amber-300">&ge; 2.0 (ALERT_THRESHOLD)</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-white/10 bg-slate-900/50">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              <Radio className="w-4 h-4" />
              <span>Sumber Berita & Internet</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span>26 Feed Regional:</span>
                <span className="font-mono text-amber-300">ANTARA News</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Media Nasional + CSE:</span>
                <span className="font-mono text-slate-300">Kemhan, BNN, CNN, dll</span>
              </div>
            </div>
          </div>
        </div>

        {/* Server EWS Host Box */}
        <div className="p-6 rounded-2xl border-2 border-emerald-500/30 bg-slate-950/60 relative">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-3 border-b border-emerald-500/20">
            <div className="flex items-center space-x-2.5">
              <Server className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-black tracking-wide text-white uppercase">
                SERVER EWS (Ubuntu Linux &mdash; Host)
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                IP Host: 10.10.100.1 / Target: 10.10.100.10
              </span>
            </div>
          </div>

          {/* Host Services (Outside Docker) */}
          <div className="mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
              LAYANAN HOST (Langsung di Ubuntu Server):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="glass-panel p-3.5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs">NGINX Reverse Proxy</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Port 80 / 443
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Terminasi SSL HTTPS & routing request ke frontend (5173) & backend (8000)
                </p>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs">BIND9 DNS Server</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    Port 53 TCP/UDP
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Resolusi domain internal <span className="font-mono text-cyan-300">ews-tniad.mil.id</span>
                </p>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs">NETDATA Monitoring</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Port 19999
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Monitoring performa CPU, RAM, disk I/O, & trafik server real-time
                </p>
              </div>
            </div>
          </div>

          {/* Docker Bridge Network Box */}
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-slate-900/60 relative">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-cyan-500/20">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                  DOCKER ENGINE (Bridge Network: ews-network &bull; 172.20.0.0/24)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Frontend Container */}
              <div className="glass-panel p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    FRONTEND (ews-frontend)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Port: 5173
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Aplikasi React JSX + Vite + Tailwind UI Glassmorphism interaktif lengkap dengan filter Level 1–5.
                </p>
              </div>

              {/* Backend Container */}
              <div className="glass-panel p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    BACKEND (ews-backend)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Port: 8000
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  FastAPI Python &bull; Scraper Engine &bull; Klasifikasi Scoring Level 1–5 &bull; APScheduler.
                </p>
              </div>

              {/* Database Container */}
              <div className="glass-panel p-4 rounded-xl border border-indigo-500/40 bg-indigo-950/20 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-indigo-400" />
                    DATABASE (ews-db)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Port: 5432
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  PostgreSQL 16 Alpine &bull; Penyimpanan artikel berita, riwayat alert, dan akun pengguna.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Port Matrix Table */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-white/10">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Matriks Port & Akses Firewall (UFW)
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-2 px-3 font-semibold">PORT</th>
                  <th className="py-2 px-3 font-semibold">PROTOKOL</th>
                  <th className="py-2 px-3 font-semibold">LAYANAN</th>
                  <th className="py-2 px-3 font-semibold">AKSES URL / COMMAND</th>
                  <th className="py-2 px-3 font-semibold">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-slate-300">
                <tr>
                  <td className="py-2 px-3 text-emerald-400 font-bold">80</td>
                  <td className="py-2 px-3">TCP</td>
                  <td className="py-2 px-3">NGINX (HTTP)</td>
                  <td className="py-2 px-3">http://ews-tniad.mil.id</td>
                  <td className="py-2 px-3 text-emerald-400 font-sans">Redirect ke 443</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-emerald-400 font-bold">443</td>
                  <td className="py-2 px-3">TCP</td>
                  <td className="py-2 px-3">NGINX (HTTPS)</td>
                  <td className="py-2 px-3">https://ews-tniad.mil.id</td>
                  <td className="py-2 px-3 text-emerald-400 font-sans">Utama (Web & API)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-cyan-400 font-bold">53</td>
                  <td className="py-2 px-3">TCP/UDP</td>
                  <td className="py-2 px-3">DNS (BIND9)</td>
                  <td className="py-2 px-3">resolve ews-tniad.mil.id</td>
                  <td className="py-2 px-3 text-cyan-400 font-sans">Internal Network</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-amber-400 font-bold">19999</td>
                  <td className="py-2 px-3">TCP</td>
                  <td className="py-2 px-3">NETDATA MONITORING</td>
                  <td className="py-2 px-3">http://ews-tniad.mil.id:19999</td>
                  <td className="py-2 px-3 text-amber-400 font-sans">Host Metrics</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-red-400 font-bold">2200</td>
                  <td className="py-2 px-3">TCP</td>
                  <td className="py-2 px-3">SSH Remote Access</td>
                  <td className="py-2 px-3">ssh -p 2200 user@10.10.100.1</td>
                  <td className="py-2 px-3 text-red-400 font-sans">Administrator SSH</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
