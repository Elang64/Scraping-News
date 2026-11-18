// src/components/UserModal.jsx
import React, { useState, useEffect } from 'react';
import { X, UserPlus, Key, Mail, Shield, Check } from 'lucide-react';
import { api } from '../services/api';

export default function UserModal({ user, onClose, onSave, showToast }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'staff',
    is_active: 1,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '', // leave empty unless changing
        role: user.role || 'staff',
        is_active: user.is_active ? 1 : 0,
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username) {
      showToast('Username wajib diisi', 'error');
      return;
    }
    if (!user && !formData.password) {
      showToast('Password wajib diisi untuk pengguna baru', 'error');
      return;
    }

    try {
      setLoading(true);
      if (user) {
        // Update user
        const updatePayload = {
          username: formData.username,
          email: formData.email,
          role: formData.role,
          is_active: formData.is_active,
        };
        if (formData.password) {
          updatePayload.password = formData.password;
        }
        await api.updateUser(user.id, updatePayload);
        showToast('Data pengguna berhasil diperbarui', 'success');
      } else {
        // Create user
        await api.createUser(formData);
        showToast('Pengguna baru berhasil ditambahkan', 'success');
      }
      onSave?.();
      onClose();
    } catch (err) {
      showToast(err.message || 'Gagal menyimpan data pengguna', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div 
        className="glass-panel w-full max-w-md rounded-2xl border border-white/20 p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              {user ? 'Edit Operator / Pengguna' : 'Tambah Operator Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Username <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs"
              placeholder="Contoh: letda_eko"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Email (Opsional)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs"
              placeholder="operator@tniad.mil.id"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Password {user ? '(Kosongkan jika tidak diganti)' : <span className="text-red-400">*</span>}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs"
              placeholder={user ? 'Biarkan kosong untuk mempertahankan' : 'Masukkan password aman'}
              required={!user}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Hak Akses (Role)
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs"
            >
              <option value="staff" className="bg-slate-900 text-white">Staff Operator (Monitoring & Kontrol Scraper)</option>
              <option value="admin" className="bg-slate-900 text-white">Administrator (Akses Penuh)</option>
              <option value="viewer" className="bg-slate-900 text-white">Viewer (Hanya Melihat)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="is_active_toggle"
              checked={Boolean(formData.is_active)}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
              className="rounded bg-slate-900 border-white/20 text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="is_active_toggle" className="text-xs text-slate-300 font-medium cursor-pointer">
              Akun Aktif (Dapat Login)
            </label>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all shadow-glass-glow"
            >
              {loading ? 'Menyimpan...' : 'Simpan Pengguna'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
