// src/services/api.js - Client API Service for EWS Monitoring Media TNI AD

const DEFAULT_BACKEND_IP = '10.10.100.10';
const DEFAULT_BACKEND_PORT = '8000';
export const DEFAULT_BASE_URL = `http://${DEFAULT_BACKEND_IP}:${DEFAULT_BACKEND_PORT}`;

export const getApiBaseUrl = () => {
  return localStorage.getItem('ews_api_base_url') || import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;
};

export const setApiBaseUrl = (url) => {
  if (!url) {
    localStorage.removeItem('ews_api_base_url');
  } else {
    const cleaned = url.replace(/\/+$/, '');
    localStorage.setItem('ews_api_base_url', cleaned);
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('ews_auth_token') || '';
};

export const setAuthSession = (token, user) => {
  if (token) {
    localStorage.setItem('ews_auth_token', token);
    localStorage.setItem('ews_auth_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('ews_auth_token');
    localStorage.removeItem('ews_auth_user');
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('ews_auth_user');
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

async function apiFetch(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errData.detail || `Request gagal dengan status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Timeout menghubungi server EWS (${baseUrl}). Cek koneksi IP ${DEFAULT_BACKEND_IP}.`);
    }
    throw err;
  }
}

export const api = {
  // Status & Health
  getStatus: () => apiFetch('/api/status'),

  // Alerts with Level 1-5 filter support
  getAlerts: ({ level, limit = 100 } = {}) => {
    const params = new URLSearchParams();
    if (level !== undefined && level !== null && level !== 'ALL' && level !== '') {
      params.append('level', level);
    }
    params.append('limit', limit);
    return apiFetch(`/api/alerts?${params.toString()}`);
  },

  // Articles & News
  getArticles: ({ region, source, search, limit = 50, offset = 0 } = {}) => {
    const params = new URLSearchParams();
    if (region) params.append('region', region);
    if (source) params.append('source', source);
    if (search) params.append('search', search);
    params.append('limit', limit);
    params.append('offset', offset);
    return apiFetch(`/api/articles?${params.toString()}`);
  },

  getRegions: () => apiFetch('/api/regions'),
  getSources: () => apiFetch('/api/sources'),

  // Scraper Control
  getScraperStatus: () => apiFetch('/api/scraper/status'),
  startScraper: () => apiFetch('/api/scraper/start', { method: 'POST' }),
  stopScraper: () => apiFetch('/api/scraper/stop', { method: 'POST' }),
  runScraperNow: () => apiFetch('/api/scraper/run-now', { method: 'POST' }),

  // Auth & Users
  login: (username, password) =>
    apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  logout: () => apiFetch('/api/auth/logout', { method: 'POST' }),
  getUsers: () => apiFetch('/api/users'),
  createUser: (data) =>
    apiFetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getUser: (id) => apiFetch(`/api/users/${id}`),
  updateUser: (id, data) =>
    apiFetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteUser: (id) => apiFetch(`/api/users/${id}`, { method: 'DELETE' }),
};
