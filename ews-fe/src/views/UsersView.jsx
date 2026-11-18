// src/views/UsersView.jsx
import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Key,
  RefreshCw,
  Mail
} from 'lucide-react';
import { api } from '../services/api';
import UserModal from '../components/UserModal';

export default function UsersView({ currentUser, showToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data || []);
    } catch (err) {
      showToast?.(err.message || 'Gagal mengambil daftar pengguna', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (user) => {
    if (user.id === currentUser?.id) {
      showToast('Tidak dapat menghapus akun Anda sendiri yang sedang aktif!', 'error');
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.username}"?`)) {
      return;
    }

    try {
      await api.deleteUser(user.id);
      showToast(`Pengguna ${user.username} berhasil dihapus`, 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Gagal menghapus pengguna', 'error');
    }
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Manajemen Operator & Hak Akses
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola akun petugas pemantau EWS, staf komando, dan administrator sistem
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 text-xs"
            title="Muat Ulang"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/40 hover:from-emerald-500/30 hover:to-cyan-500/30 text-xs font-bold transition-all shadow-glass-glow"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Operator Baru</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/60 border-b border-white/10 text-slate-300">
                <th className="py-3 px-4 font-semibold">PENGGUNA</th>
                <th className="py-3 px-4 font-semibold">EMAIL</th>
                <th className="py-3 px-4 font-semibold">HAK AKSES (ROLE)</th>
                <th className="py-3 px-4 font-semibold text-center">STATUS</th>
                <th className="py-3 px-4 font-semibold">TERDAFTAR</th>
                <th className="py-3 px-4 font-semibold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => {
                const roleColors = {
                  admin: 'bg-red-500/15 text-red-300 border-red-500/30',
                  staff: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                  viewer: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
                };

                const dateStr = u.created_at
                  ? new Date(u.created_at).toLocaleDateString('id-ID', {
                      dateStyle: 'medium',
                    })
                  : '-';

                return (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-300">
                        {u.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold">{u.username}</div>
                        {currentUser?.id === u.id && (
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            (Akun Anda)
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {u.email || <span className="text-slate-500">-</span>}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-md border text-[11px] font-bold uppercase ${
                          roleColors[u.role] || roleColors.staff
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {u.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-300 border border-red-500/30">
                          <XCircle className="w-3 h-3" /> Nonaktif
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {dateStr}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700"
                          title="Edit Pengguna"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u)}
                          disabled={currentUser?.id === u.id}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Belum ada data operator yang terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      {isModalOpen && (
        <UserModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchUsers}
          showToast={showToast}
        />
      )}
    </div>
  );
}
