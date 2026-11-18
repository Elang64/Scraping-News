// src/components/Sidebar.jsx
import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Newspaper,
  Globe2,
  Users,
  Network,
  Sliders,
  Radio,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({ currentTab, setTab, alertCount = 0 }) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Ringkasan Utama',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'alerts',
      label: 'Peringatan Dini (Alerts)',
      icon: ShieldAlert,
      badge: alertCount > 0 ? alertCount : null,
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    },
    {
      id: 'articles',
      label: 'Feed Berita Media',
      icon: Newspaper,
      badge: null,
    },
    {
      id: 'regions',
      label: 'Radar Regional',
      icon: Globe2,
      badge: null,
    },
    {
      id: 'topology',
      label: 'Topologi Sistem',
      icon: Network,
      badge: null,
    },
    {
      id: 'users',
      label: 'Manajemen Operator',
      icon: Users,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Konfigurasi IP & Server',
      icon: Sliders,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-20 space-y-4">
        {/* Navigation List */}
        <div className="glass-panel rounded-2xl p-3 border border-white/10 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigasi Sistem
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-white border border-emerald-500/30 shadow-glass-glow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                      item.badgeColor || 'bg-slate-800 text-slate-300 border-white/10'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Bot Card */}
        <div className="glass-panel rounded-2xl p-3.5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Telegram Alert Bot</div>
              <div className="text-[11px] text-sky-400 font-mono">@ews_tniad_bot</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
            Notifikasi instan dikirim secara otomatis ke grup komando saat skor isu &ge; ambang batas.
          </p>
          <a
            href="https://t.me/ews_tniad_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-1.5 w-full py-1.5 px-3 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-semibold transition-colors"
          >
            <span>Buka di Telegram</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
}
