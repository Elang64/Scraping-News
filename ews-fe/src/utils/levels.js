// src/utils/levels.js - Helper pemetaan level alert 1-5 sesuai backend config.py

export const LEVEL_CONFIG = {
  1: {
    level: 1,
    label: 'Level 1',
    description: 'Rendah (Skor < 3)',
    range: '< 3',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    dotClass: 'bg-blue-400',
    textClass: 'text-blue-300',
    barColor: 'bg-blue-500',
    priority: 'Informasi Awal',
  },
  2: {
    level: 2,
    label: 'Level 2',
    description: 'Sedang-Rendah (Skor 3–4)',
    range: '3–4',
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    dotClass: 'bg-cyan-400',
    textClass: 'text-cyan-300',
    barColor: 'bg-cyan-500',
    priority: 'Perhatian Ringan',
  },
  3: {
    level: 3,
    label: 'Level 3',
    description: 'Sedang (Skor 5–6)',
    range: '5–6',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dotClass: 'bg-amber-400',
    textClass: 'text-amber-300',
    barColor: 'bg-amber-500',
    priority: 'Waspada / Perlu Pemantauan',
  },
  4: {
    level: 4,
    label: 'Level 4',
    description: 'Tinggi (Skor 7–8)',
    range: '7–8',
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    dotClass: 'bg-orange-400',
    textClass: 'text-orange-300',
    barColor: 'bg-orange-500',
    priority: 'Prioritas Penanganan Segera',
  },
  5: {
    level: 5,
    label: 'Level 5',
    description: 'Kritis (Skor ≥ 9)',
    range: '≥ 9',
    badgeClass: 'bg-red-500/25 text-red-300 border-red-500/50 font-bold',
    dotClass: 'bg-red-500',
    textClass: 'text-red-400',
    barColor: 'bg-red-500',
    priority: 'Sangat Kritis (Atensi Pimpinan Mabes)',
  },
};

export const getLevelFromScore = (score) => {
  const num = Number(score) || 0;
  if (num < 3) return 1;
  if (num < 5) return 2;
  if (num < 7) return 3;
  if (num < 9) return 4;
  return 5;
};

export const getAlertLevelInfo = (alert) => {
  const lvl = alert?.level || getLevelFromScore(alert?.severity_score);
  return LEVEL_CONFIG[lvl] || LEVEL_CONFIG[1];
};
