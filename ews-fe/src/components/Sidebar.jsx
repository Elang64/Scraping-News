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
  AlertTriangle,
  Flame,
  Layers
} from 'lucide-react';
import { LEVEL_CONFIG } from '../utils/levels';

export default function Sidebar({ currentTab, setTab, alertCount = 0, onFilterLevel }) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Ringkasan Utama',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'alerts',
      label: 'Pusat Alert (Level 1–5)',
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

        {/* Quick Level Filter Indicator Card */}
        <div className="glass-panel rounded-2xl p-3.5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center space-x-2 mb-2 pb-1.5 border-b border-white/5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Tingkat Alert (1–5)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Klasifikasi otomatis berdasarkan bobot kata kunci negatif:
          </p>
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((lvl) => {
              const conf = LEVEL_CONFIG[lvl];
              return (
                <button
                  key={lvl}
                  onClick={() => {
                    setTab('alerts');
                    onFilterLevel?.(lvl);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900/40 hover:bg-white/5 border border-white/5 text-[11px] transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${conf.dotClass}`} />
                    <span className="font-semibold text-white">{conf.label}</span>
                  </div>
                  <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded border ${conf.badgeClass}`}>
                    Skor {conf.range}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
