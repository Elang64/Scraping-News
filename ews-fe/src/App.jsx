// src/App.jsx - Main Dashboard Controller for EWS Monitoring Media TNI AD
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AlertDetailModal from './components/AlertDetailModal';
import LoginModal from './views/LoginModal';
import Toast from './components/Toast';

import DashboardView from './views/DashboardView';
import AlertsView from './views/AlertsView';
import ArticlesView from './views/ArticlesView';
import RegionsView from './views/RegionsView';
import UsersView from './views/UsersView';
import TopologyView from './views/TopologyView';
import SettingsView from './views/SettingsView';

import { api, getCurrentUser, setAuthSession, getApiBaseUrl } from './services/api';

// Fallback dummy data if backend server is starting up or offline
const DUMMY_STATUS = {
  status: 'running',
  started_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  total_articles_scraped: 142,
  total_alerts: 8,
  last_scrape_at: new Date(Date.now() - 600000).toISOString(),
};

const DUMMY_SCRAPER = {
  running: true,
  next_run_time: new Date(Date.now() + 450000).toISOString(),
};

const DUMMY_ALERTS = [
  {
    id: 1,
    title: 'Oknum TNI AD diduga terlibat pungli di proyek pemerintah daerah',
    link: 'https://example.com/berita/1',
    source: 'ANTARA News',
    severity_score: 6.0,
    level: 3,
    matched_categories: 'pelanggaran_hukum,disiplin_internal',
    matched_words: 'oknum, pungli, penyalahgunaan wewenang',
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 2,
    title: 'Babinsa tersangka kasus penganiayaan warga di Jawa Barat viral di medsos',
    link: 'https://example.com/berita/2',
    source: 'CNN Indonesia',
    severity_score: 7.0,
    level: 4,
    matched_categories: 'kekerasan,isu_viral',
    matched_words: 'penganiayaan, baku tembak, viral, ramai diperbincangkan',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 3,
    title: 'Pangdam soroti dugaan intimidasi warga dalam operasi teritorial',
    link: 'https://example.com/berita/3',
    source: 'Sindonews',
    severity_score: 9.5,
    level: 5,
    matched_categories: 'ham',
    matched_words: 'penyiksaan, intimidasi warga',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 4,
    title: 'KPK periksa pejabat terkait pengadaan alutsista di lingkungan pertahanan',
    link: 'https://example.com/berita/4',
    source: 'ANTARA News',
    severity_score: 4.5,
    level: 2,
    matched_categories: 'pelanggaran_hukum',
    matched_words: 'suap, korupsi',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];

const DUMMY_REGIONS = [
  { region: 'Sumatra', count: 38 },
  { region: 'Jawa', count: 45 },
  { region: 'Kalimantan', count: 18 },
  { region: 'Sulawesi', count: 15 },
  { region: 'Bali & Nusa Tenggara', count: 12 },
  { region: 'Maluku & Papua', count: 8 },
  { region: 'Nasional', count: 42 },
];

const DUMMY_SOURCES = [
  { source: 'ANTARA News', count: 68 },
  { source: 'CNN Indonesia', count: 24 },
  { source: 'Sindonews', count: 20 },
  { source: 'Kemhan', count: 12 },
  { source: 'Google News', count: 18 },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('ALL');
  const [systemStatus, setSystemStatus] = useState(null);
  const [scraperStatus, setScraperStatus] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [regions, setRegions] = useState([]);
  const [sources, setSources] = useState([]);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isServerLive, setIsServerLive] = useState(false);

  // Modals & Popups
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Auto refresh interval (in seconds, default 30)
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(30);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const loadData = useCallback(async (isSilent = false, level = null) => {
    if (!isSilent) setIsRefreshing(true);
    let serverOk = false;

    // Fetch Status & Scraper
    try {
      const [statusRes, scraperRes] = await Promise.all([
        api.getStatus(),
        api.getScraperStatus(),
      ]);
      setSystemStatus(statusRes);
      setScraperStatus(scraperRes);
      serverOk = true;
    } catch {
      setSystemStatus((prev) => prev || DUMMY_STATUS);
      setScraperStatus((prev) => prev || DUMMY_SCRAPER);
    }

    // Fetch Alerts (support level filter query)
    try {
      const activeLvl = level !== null ? level : (selectedLevelFilter !== 'ALL' ? selectedLevelFilter : null);
      const alertsRes = await api.getAlerts({ level: activeLvl, limit: 100 });
      setAlerts(alertsRes || []);
      serverOk = true;
    } catch {
      setAlerts((prev) => (prev.length > 0 ? prev : DUMMY_ALERTS));
    }

    // Fetch Articles
    try {
      const articlesRes = await api.getArticles({ limit: 30 });
      setArticles(articlesRes.articles || []);
      serverOk = true;
    } catch {
      setArticles((prev) => (prev.length > 0 ? prev : []));
    }

    // Fetch Regions & Sources
    try {
      const [regRes, srcRes] = await Promise.all([
        api.getRegions(),
        api.getSources(),
      ]);
      setRegions(regRes.length > 0 ? regRes : DUMMY_REGIONS);
      setSources(srcRes.length > 0 ? srcRes : DUMMY_SOURCES);
      serverOk = true;
    } catch {
      setRegions((prev) => (prev.length > 0 ? prev : DUMMY_REGIONS));
      setSources((prev) => (prev.length > 0 ? prev : DUMMY_SOURCES));
    }

    setIsServerLive(serverOk);
    if (!isSilent) setIsRefreshing(false);
  }, [selectedLevelFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto Refresh Polling (every 30 seconds default, as specified in operator guide)
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    const timer = setInterval(() => {
      loadData(true);
    }, autoRefreshInterval * 1000);
    return () => clearInterval(timer);
  }, [autoRefreshInterval, loadData]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    setAuthSession(null, null);
    setCurrentUser(null);
    showToast('Anda telah berhasil logout', 'info');
  };

  const handleFilterLevelFromAnywhere = (lvl) => {
    setSelectedLevelFilter(lvl);
    loadData(true, lvl === 'ALL' ? null : lvl);
  };

  const currentBackendUrl = getApiBaseUrl();

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-100">
      {/* Top Navbar */}
      <Navbar
        systemStatus={systemStatus}
        scraperStatus={scraperStatus}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onRefresh={() => loadData(false)}
        isRefreshing={isRefreshing}
        onOpenSettings={() => setCurrentTab('settings')}
      />

      {/* Connectivity Status Banner */}
      {!isServerLive && (
        <div className="bg-amber-950/70 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              <b>Mode Siaga (Offline/Demo):</b> Belum terhubung ke backend di{' '}
              <code className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-amber-300">
                {currentBackendUrl}
              </code>
              . Menampilkan data radar simulasi Level 1–5.
            </span>
          </div>
          <button
            onClick={() => setCurrentTab('settings')}
            className="text-xs font-bold underline hover:text-white"
          >
            Ubah IP &bull; Cek Koneksi &rarr;
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex gap-6">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setTab={setCurrentTab}
          alertCount={alerts.length}
          onFilterLevel={handleFilterLevelFromAnywhere}
        />

        {/* Center Content Views */}
        <main className="flex-1 min-w-0">
          {currentTab === 'dashboard' && (
            <DashboardView
              systemStatus={systemStatus}
              scraperStatus={scraperStatus}
              alerts={alerts}
              articles={articles}
              regions={regions}
              sources={sources}
              onRefreshScraper={() => loadData(true)}
              onSelectAlert={setSelectedAlert}
              showToast={showToast}
              setTab={setCurrentTab}
              onFilterLevel={handleFilterLevelFromAnywhere}
            />
          )}

          {currentTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              onSelectAlert={setSelectedAlert}
              selectedLevelFilter={selectedLevelFilter}
              setSelectedLevelFilter={setSelectedLevelFilter}
              onFetchAlertsWithLevel={(lvl) => loadData(true, lvl)}
              showToast={showToast}
            />
          )}

          {currentTab === 'articles' && (
            <ArticlesView
              regions={regions}
              sources={sources}
              showToast={showToast}
            />
          )}

          {currentTab === 'regions' && (
            <RegionsView
              regions={regions}
              sources={sources}
              setTab={setCurrentTab}
            />
          )}

          {currentTab === 'topology' && <TopologyView />}

          {currentTab === 'users' && (
            <UsersView currentUser={currentUser} showToast={showToast} />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              autoRefreshInterval={autoRefreshInterval}
              setAutoRefreshInterval={setAutoRefreshInterval}
              showToast={showToast}
              onRefreshAll={() => loadData(false)}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="glass-panel border-t border-white/10 py-3.5 px-6 text-center text-xs text-slate-400">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <div>
            &copy; {new Date().getFullYear()} EWS Monitoring Media &mdash; Komando Pasukan Siber & Penerangan TNI AD.
          </div>
          <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
            <span>IP: 10.10.100.10:8000</span>
            <span>&bull;</span>
            <span>Docker: 172.20.0.0/24</span>
            <span>&bull;</span>
            <span className="text-emerald-400">v1.1-LevelFilter</span>
          </div>
        </div>
      </footer>

      {/* Modals & Toast */}
      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={(user) => setCurrentUser(user)}
          showToast={showToast}
        />
      )}

      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
