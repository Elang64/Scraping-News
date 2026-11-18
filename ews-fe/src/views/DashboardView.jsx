// src/views/DashboardView.jsx
import React from 'react';
import {
  ShieldAlert,
  Newspaper,
  AlertTriangle,
  Radio,
  ExternalLink,
  Flame,
  Globe2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Eye
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import ScraperControl from '../components/ScraperControl';

export default function DashboardView({
  systemStatus,
  scraperStatus,
  alerts,
  articles,
  regions,
  sources,
  onRefreshScraper,
  onSelectAlert,
  showToast,
  setTab,
}) {
  const totalArticles = systemStatus?.total_articles_scraped ?? articles.length;
  const totalAlerts = systemStatus?.total_alerts ?? alerts.length;
  const highSeverityAlerts = alerts.filter((a) => (a.severity_score || 0) >= 6);
  const midSeverityAlerts = alerts.filter((a) => (a.severity_score || 0) >= 4 && (a.severity_score || 0) < 6);

  const lastScrapedTime = systemStatus?.last_scrape_at
    ? new Date(systemStatus.last_scrape_at).toLocaleString('id-ID', {
        dateStyle: 'short',
        timeStyle: 'medium',
      })
    : 'Belum ada';

  return (
    <div className="space-y-6">
      {/* Top Banner Alert Bar if High Severity items exist */}
      {highSeverityAlerts.length > 0 && (
        <div className="glass-card-danger rounded-2xl p-4 flex items-center justify-between gap-3 animate-pulse-slow">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Flame className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-200 uppercase tracking-wider">
                Perhatian: Terdeteksi {highSeverityAlerts.length} Isu Berpotensi Kritis (Skor &ge; 6.0)
              </h4>
              <p className="text-[11px] text-red-300/80">
                Pemberitaan memerlukan verifikasi dan tindak lanjut dari jajaran penerangan & intelijen.
              </p>
            </div>
          </div>
          <button
            onClick={() => setTab('alerts')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 text-xs font-bold transition-colors whitespace-nowrap"
          >
            <span>Buka Radar Alert</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Scraper Control Command Bar */}
      <ScraperControl
        scraperStatus={scraperStatus}
        onStatusChange={onRefreshScraper}
        showToast={showToast}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Berita Terpantau"
          value={totalArticles.toLocaleString('id-ID')}
          icon={Newspaper}
          variant="cyan"
          trend={
            <span>
              Scrape terakhir: <b className="text-cyan-300">{lastScrapedTime}</b>
            </span>
          }
        />

        <MetricCard
          title="Total Peringatan Dini"
          value={totalAlerts}
          icon={ShieldAlert}
          variant="amber"
          trend={
            <span>
              Ambang batas skor: <b className="text-amber-300">&ge; 2.0</b>
            </span>
          }
        />

        <MetricCard
          title="Isu Kritis (Skor &ge; 6)"
          value={highSeverityAlerts.length}
          icon={Flame}
          variant="red"
          trend={
            <span className="text-red-400 font-semibold">
              {highSeverityAlerts.length > 0 ? 'Perlu atensi pimpinan' : 'Kondisi kondusif'}
            </span>
          }
        />

        <MetricCard
          title="Cakupan Regional & Sumber"
          value={`${regions.length} / ${sources.length}`}
          subvalue="wilayah/sumber"
          icon={Globe2}
          variant="emerald"
          trend={
            <span className="text-emerald-400">
              Antara 26 feed regional aktif
            </span>
          }
        />
      </div>

      {/* Main Grid: Recent Alerts & System Topology Snippet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Alerts Table */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Peringatan Dini Terbaru
              </h3>
            </div>
            <button
              onClick={() => setTab('alerts')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Lihat Semua ({alerts.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-2.5 px-3 font-semibold">WAKTU</th>
                  <th className="py-2.5 px-3 font-semibold">JUDUL BERITA</th>
                  <th className="py-2.5 px-3 font-semibold">SUMBER</th>
                  <th className="py-2.5 px-3 font-semibold text-center">SKOR</th>
                  <th className="py-2.5 px-3 font-semibold text-center">NOTIFIKASI</th>
                  <th className="py-2.5 px-3 font-semibold text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {alerts.slice(0, 7).map((item) => {
                  const score = item.severity_score || 0;
                  const scoreBadge =
                    score >= 6
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : score >= 4
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

                  const timeStr = item.created_at
                    ? new Date(item.created_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-white/5 transition-colors group cursor-pointer"
                      onClick={() => onSelectAlert(item)}
                    >
                      <td className="py-3 px-3 text-slate-400 font-mono whitespace-nowrap">
                        {timeStr}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-100 max-w-xs truncate">
                        <div className="truncate font-semibold group-hover:text-emerald-300 transition-colors">
                          {item.title}
                        </div>
                        {item.matched_categories && (
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">
                            {item.matched_categories.split(',').join(' • ')}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-white/5 text-[11px]">
                          {item.source}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded-md border text-[11px] ${scoreBadge}`}
                        >
                          {score.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {item.notified ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            Terkirim
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAlert(item);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                          title="Lihat Detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {alerts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-slate-400">
                      Belum ada peringatan dini yang terdeteksi. Sistem berjalan normal.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Severity Distribution & Live Feed */}
        <div className="space-y-6">
          {/* Severity Breakdown Glass Card */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                Distribusi Tingkat Resiko
              </h3>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-red-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    Tinggi (Skor &ge; 6.0)
                  </span>
                  <span className="font-mono font-bold text-white">
                    {highSeverityAlerts.length}
                  </span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        totalAlerts > 0 ? (highSeverityAlerts.length / totalAlerts) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Sedang (Skor 4.0 - 5.9)
                  </span>
                  <span className="font-mono font-bold text-white">
                    {midSeverityAlerts.length}
                  </span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        totalAlerts > 0 ? (midSeverityAlerts.length / totalAlerts) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Rendah (Skor &lt; 4.0)
                  </span>
                  <span className="font-mono font-bold text-white">
                    {totalAlerts - highSeverityAlerts.length - midSeverityAlerts.length}
                  </span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        totalAlerts > 0
                          ? ((totalAlerts - highSeverityAlerts.length - midSeverityAlerts.length) /
                              totalAlerts) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scraped Articles Ticker */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
                Berita Terkini Masuk
              </h3>
              <button
                onClick={() => setTab('articles')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Lihat Feed &rarr;
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {articles.slice(0, 5).map((art) => (
                <div
                  key={art.id}
                  className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5 hover:border-emerald-500/30 transition-all text-xs"
                >
                  <a
                    href={art.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-slate-200 hover:text-emerald-300 line-clamp-2 leading-relaxed"
                  >
                    {art.title}
                  </a>
                  <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                    <span className="font-semibold text-cyan-400">{art.source}</span>
                    <span className="text-slate-500">
                      {art.scraped_at
                        ? new Date(art.scraped_at).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </span>
                  </div>
                </div>
              ))}

              {articles.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">
                  Belum ada artikel tersimpan.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
