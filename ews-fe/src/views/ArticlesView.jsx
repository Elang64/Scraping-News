// src/views/ArticlesView.jsx
import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Search,
  Filter,
  ExternalLink,
  MapPin,
  Building,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  LayoutGrid,
  List
} from 'lucide-react';
import { api } from '../services/api';

export default function ArticlesView({ regions = [], sources = [], showToast }) {
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  // Filters
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const res = await api.getArticles({
        region: selectedRegion || undefined,
        source: selectedSource || undefined,
        search: search || undefined,
        limit,
        offset,
      });

      setArticles(res.articles || []);
      setTotal(res.total || 0);
    } catch (err) {
      showToast?.(err.message || 'Gagal mengambil daftar berita', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, selectedRegion, selectedSource]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Newspaper className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Feed Berita Terpantau (News Feed)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Arsip seluruh artikel yang berhasil di-scrape dari media nasional, regional ANTARA, dan RSS resmi
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900/60 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${
                viewMode === 'list'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Tabel / List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${
                viewMode === 'grid'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Kartu / Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={fetchArticles}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs font-semibold text-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Muat Ulang</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-3">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul berita atau kutipan..."
              className="glass-input w-full pl-10 pr-4 py-2 rounded-xl text-xs"
            />
          </div>

          {/* Region Filter */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setPage(1);
              }}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs"
            >
              <option value="" className="bg-slate-900 text-white">Semua Wilayah</option>
              {regions.map((r, idx) => (
                <option key={idx} value={r.region} className="bg-slate-900 text-white">
                  {r.region} ({r.count})
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={selectedSource}
              onChange={(e) => {
                setSelectedSource(e.target.value);
                setPage(1);
              }}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs"
            >
              <option value="" className="bg-slate-900 text-white">Semua Sumber Media</option>
              {sources.map((s, idx) => (
                <option key={idx} value={s.source} className="bg-slate-900 text-white">
                  {s.source} ({s.count})
                </option>
              ))}
            </select>
          </div>
        </form>

        <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
          <div>
            Menampilkan <b className="text-white">{articles.length}</b> dari{' '}
            <b className="text-cyan-400">{total}</b> artikel
          </div>
          {(selectedRegion || selectedSource || search) && (
            <button
              onClick={() => {
                setSelectedRegion('');
                setSelectedSource('');
                setSearch('');
                setPage(1);
              }}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      </div>

      {/* Articles Content */}
      {viewMode === 'list' ? (
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-glass">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900/60 border-b border-white/10 text-slate-300">
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">WAKTU SCRAPE</th>
                  <th className="py-3 px-4 font-semibold min-w-[300px]">JUDUL BERITA</th>
                  <th className="py-3 px-4 font-semibold">SUMBER</th>
                  <th className="py-3 px-4 font-semibold">WILAYAH</th>
                  <th className="py-3 px-4 font-semibold text-right">TAUTAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {articles.map((art) => {
                  const scrapeTime = art.scraped_at
                    ? new Date(art.scraped_at).toLocaleString('id-ID', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })
                    : '-';

                  return (
                    <tr key={art.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {scrapeTime}
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={art.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-slate-100 hover:text-emerald-300 transition-colors line-clamp-2 leading-relaxed"
                        >
                          {art.title}
                        </a>
                        {art.raw_summary && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {art.raw_summary}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-800/80 border border-white/5 text-[11px] font-medium text-cyan-300">
                          {art.source || 'Media Online'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]">
                          {art.region || 'Nasional'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <a
                          href={art.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                          title="Buka Berita Asli"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}

                {articles.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400">
                      Tidak ada artikel yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((art) => (
            <div
              key={art.id}
              className="glass-panel rounded-2xl p-4 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold">
                    {art.source}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {art.region || 'Nasional'}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm line-clamp-3 leading-snug mb-2 hover:text-emerald-300">
                  <a href={art.link} target="_blank" rel="noopener noreferrer">
                    {art.title}
                  </a>
                </h4>
                {art.raw_summary && (
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {art.raw_summary}
                  </p>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  {art.scraped_at ? new Date(art.scraped_at).toLocaleDateString('id-ID') : '-'}
                </span>
                <a
                  href={art.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  <span>Baca</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="glass-panel rounded-2xl p-3 border border-white/10 flex items-center justify-between text-xs">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page <= 1 || loading}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/5 text-slate-300 hover:text-white disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <span className="text-slate-400">
          Halaman <b className="text-white">{page}</b> dari <b className="text-white">{totalPages}</b>
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages || loading}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/5 text-slate-300 hover:text-white disabled:opacity-40"
        >
          <span>Berikutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
