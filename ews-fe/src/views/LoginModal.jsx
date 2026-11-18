// src/views/LoginModal.jsx
import React, { useState } from 'react';
import { X, Lock, User, ShieldAlert, KeyRound } from 'lucide-react';
import { api, setAuthSession } from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, showToast }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showToast('Harap isi username dan password', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.login(username, password);
      if (res.token && res.user) {
        setAuthSession(res.token, res.user);
        showToast(`Selamat datang, ${res.user.username}!`, 'success');
        onLoginSuccess(res.user);
        onClose();
      } else {
        throw new Error(res.message || 'Login gagal');
      }
    } catch (err) {
      showToast(err.message || 'Login gagal. Cek username dan password Anda.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div 
        className="glass-panel w-full max-w-sm rounded-2xl border border-white/20 p-6 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Login Operator EWS</h3>
              <p className="text-[10px] text-slate-400">Sistem Monitoring Media TNI AD</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-3.5">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="glass-input w-full pl-9 pr-3 py-2 rounded-xl text-xs"
                placeholder="Masukkan username"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full pl-9 pr-3 py-2 rounded-xl text-xs"
                placeholder="Masukkan password"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-emerald-300 border border-emerald-500/40 hover:from-emerald-500/40 hover:to-cyan-500/40 transition-all shadow-glass-glow flex items-center justify-center space-x-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{loading ? 'Memverifikasi...' : 'Masuk ke Sistem'}</span>
            </button>
          </div>
        </form>

        <div className="pt-3 border-t border-white/5 text-center">
          <p className="text-[10px] text-slate-400">
            Akses terbatas hanya untuk personel berwenang TNI AD.
          </p>
        </div>
      </div>
    </div>
  );
}
