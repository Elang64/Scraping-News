// src/views/AlertsView.jsx
import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  ExternalLink,
  Flame,
  AlertTriangle,
  Eye,
  ArrowUpDown,
  Tag,
  Layers,
  RotateCcw
} from 'lucide-react';
import { LEVEL_CONFIG, getAlertLevelInfo } from '../utils/levels';

export default function AlertsView({
  alerts,
  onSelectAlert,
  selectedLevelFilter,
  setSelectedLevelFilter,
  onFetchAlertsWithLevel,
  showToast,
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortField, setSortField] = useState('created_at');
  const [sortAsc, setSortAsc] = useState(false);

  // Available categories
  const categoriesList = [
    { id: 'ALL', label: 'Semua Kategori' },
    { id: 'pelanggaran_hukum', label: 'Pelanggaran Hukum' },
    { id: 'kekerasan', label: 'Kekerasan' },
    { id: 'ham', label: 'HAM' },
    { id: 'disiplin_internal', label: 'Disiplin Internal' },
    { id: 'isu_viral', label: 'Isu Viral' },
  ];

  // Filtering & Sorting
  const filteredAlerts = useMemo(() => {
    return alerts
      .filter((item) => {
        // Level filter (if selected)
        if (selectedLevelFilter && selectedLevelFilter !== 'ALL') {
          const itemLevel = item.level || getAlertLevelInfo(item).level;
          if (itemLevel !== Number(selectedLevelFilter)) return false;
        }

        // Search text
        if (search) {
          const s = search.toLowerCase();
          const matchTitle = (item.title || '').toLowerCase().includes(s);
          const matchSource = (item.source || '').toLowerCase().includes(s);
          const matchWords = (item.matched_words || '').toLowerCase().includes(s);
          const matchCat = (item.matched_categories || '').toLowerCase().includes(s);
          if (!matchTitle && !matchSource && !matchWords && !matchCat) return false;
        }

        // Category
        if (selectedCategory !== 'ALL') {
          if (!item.matched_categories || !item.matched_categories.includes(selectedCategory)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (sortField === 'level') {
          valA = a.level || getAlertLevelInfo(a).level;
          valB = b.level || getAlertLevelInfo(b).level;
        } else if (sortField === 'severity_score') {
          valA = Number(valA || 0);
          valB = Number(valB || 0);
        } else if (sortField === 'created_at') {
          valA = new Date(valA || 0).getTime();
          valB = new Date(valB || 0).getTime();
        }
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [alerts, search, selectedCategory, selectedLevelFilter, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleLevelChange = (lvl) => {
    setSelectedLevelFilter?.(lvl);
    onFetchAlertsWithLevel?.(lvl === 'ALL' ? null : lvl);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Pusat Radar Peringatan Dini (Alert Level 1–5)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar artikel yang lolos deteksi sistem terklasifikasi menurut Level 1 (rendah) s.d. Level 5 (kritis)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-900/60 border border-white/10 text-slate-300">
            Total Temuan: <b className="text-emerald-400">{filteredAlerts.length}</b> dari {alerts.length}
          </span>
        </div>
      </div>

      {/* Level 1-5 Filter Tabs */}
      <div className="glass-panel rounded-2xl p-3 border border-white/10">
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/5">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Filter Cepat Level Alert:</span>
          </div>
          {selectedLevelFilter && selectedLevelFilter !== 'ALL' && (
            <button
              onClick={() => handleLevelChange('ALL')}
              className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Hapus Filter Level</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <button
            onClick={() => handleLevelChange('ALL')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              !selectedLevelFilter || selectedLevelFilter === 'ALL'
                ? 'bg-slate-700/80 text-white border border-white/20 shadow-glass'
                : 'bg-slate-900/40 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            Semua Level
          </button>

          {[1, 2, 3, 4, 5].map((lvl) => {
            const conf = LEVEL_CONFIG[lvl];
            const isSelected = String(selectedLevelFilter) === String(lvl);
            return (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border ${
                  isSelected
                    ? `${conf.badgeClass} ring-2 ring-white/20 shadow-glass-glow`
                    : 'bg-slate-900/40 text-slate-400 border-white/5 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${conf.dotClass}`} />
                  <span>{conf.label}</span>
                </div>
                <span className="text-[10px] opacity-75 font-mono font-normal">
                  skor {conf.range}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul berita, kata terdeteksi, atau media sumber..."
              className="glass-input w-full pl-10 pr-4 py-2 rounded-xl text-xs"
            />
          </div>

          {/* Level Dropdown (alternative) */}
          <div>
            <select
              value={selectedLevelFilter || 'ALL'}
              onChange={(e) => handleLevelChange(e.target.value)}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs"
            >
              <option value="ALL" className="bg-slate-900 text-white">Semua Level (1-5)</option>
              <option value="1" className="bg-slate-900 text-blue-300">Level 1 (skor &lt; 3)</option>
              <option value="2" className="bg-slate-900 text-cyan-300">Level 2 (skor 3-4)</option>
              <option value="3" className="bg-slate-900 text-amber-300">Level 3 (skor 5-6)</option>
              <option value="4" className="bg-slate-900 text-orange-300">Level 4 (skor 7-8)</option>
              <option value="5" className="bg-slate-900 text-red-400">Level 5 (skor &ge; 9)</option>
            </select>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-1">
          <span className="text-[11px] font-bold uppercase text-slate-400 mr-2 flex items-center gap-1">
            <Tag className="w-3 h-3 text-cyan-400" /> Kategori:
          </span>
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-glass-glow'
                    : 'bg-slate-900/40 text-slate-400 border border-white/5 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Alerts Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/60 border-b border-white/10 text-slate-300">
                <th
                  onClick={() => handleSort('created_at')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>WAKTU DETEKSI</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold min-w-[280px]">JUDUL BERITA</th>
                <th className="py-3 px-4 font-semibold">SUMBER</th>
                <th
                  onClick={() => handleSort('level')}
                  className="py-3 px-4 font-semibold text-center cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>LEVEL</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('severity_score')}
                  className="py-3 px-4 font-semibold text-center cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>SKOR</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold">KATA KUNCI TERDETEKSI</th>
                <th className="py-3 px-4 font-semibold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAlerts.map((item) => {
                const score = Number(item.severity_score || 0);
                const levelInfo = getAlertLevelInfo(item);

                const dateStr = item.created_at
                  ? new Date(item.created_at).toLocaleString('id-ID', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })
                  : '-';

                const words = item.matched_words
                  ? item.matched_words.split(',').map((w) => w.trim())
                  : [];

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectAlert(item)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {dateStr}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-2">
                        {item.title}
                      </div>
                      {item.matched_categories && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.matched_categories.split(',').map((cat, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-white/5"
                            >
                              #{cat.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/5 text-[11px] font-medium text-cyan-300">
                        {item.source}
                      </span>
                    </td>

                    {/* Level Column */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${levelInfo.badgeClass}`}>
                        {levelInfo.label}
                      </span>
                    </td>

                    {/* Severity Score */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="font-mono font-bold text-white text-xs px-2 py-0.5 rounded bg-slate-900/80 border border-white/10">
                        {score.toFixed(1)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {words.slice(0, 3).map((w, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-500/15 text-red-300 border border-red-500/30"
                          >
                            {w}
                          </span>
                        ))}
                        {words.length > 3 && (
                          <span className="text-[10px] text-slate-400">
                            +{words.length - 3} lagi
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAlert(item);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800/80 border border-white/5 text-slate-300 hover:text-white hover:bg-slate-700"
                          title="Buka Detail Modal"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                            title="Buka Tautan Asli"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredAlerts.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    Tidak ada data peringatan dini yang sesuai kriteria level dan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
