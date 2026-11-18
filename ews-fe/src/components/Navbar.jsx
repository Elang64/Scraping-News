// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Clock, 
  Server, 
  User, 
  LogOut, 
  LogIn, 
  RefreshCw, 
  Radio
} from 'lucide-react';
import { getApiBaseUrl } from '../services/api';

export default function Navbar({ 
  systemStatus, 
  scraperStatus, 
  currentUser, 
  onOpenLogin, 
  onLogout, 
  onRefresh, 
  isRefreshing,
  onOpenSettings
}) {
  const [timeStr, setTimeStr] = useState('');
  const currentIp = getApiBaseUrl();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' WIB'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const isServerOnline = systemStatus?.status === 'running';
  const isScraperActive = scraperStatus?.running;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Brand / Title */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 shadow-glass-glow">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isScraperActive ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isScraperActive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                TNI AD
              </span>
              <h1 className="text-lg font-bold tracking-wide text-white flex items-center gap-1.5">
                EWS MONITORING MEDIA
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Sistem Peringatan Dini Isu & Publikasi Media Online
            </p>
          </div>
        </div>

        {/* Center Indicators: Clock & Status */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Real-time Clock */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/40 border border-white/5 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono font-medium">{timeStr}</span>
          </div>

          {/* Backend IP Node */}
          <button 
            onClick={onOpenSettings}
            title="Klik untuk mengubah konfigurasi IP backend"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/40 border border-white/5 text-xs text-slate-300 hover:border-emerald-500/40 transition-colors"
          >
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-emerald-400 font-semibold">{currentIp.replace('http://', '')}</span>
          </button>

          {/* Scraper Radar Status */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/40 border border-white/5 text-xs">
            <Radio className={`w-3.5 h-3.5 ${isScraperActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-slate-400">Scraper:</span>
            <span className={`font-semibold ${isScraperActive ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isScraperActive ? 'AKTIF' : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-slate-800/60 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all disabled:opacity-50"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {/* User Session Profile */}
          {currentUser ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-white">{currentUser.username}</div>
                <div className="text-[10px] uppercase font-bold text-emerald-400">{currentUser.role || 'Staff'}</div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-xs">
                {currentUser.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold transition-all shadow-glass-glow"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
