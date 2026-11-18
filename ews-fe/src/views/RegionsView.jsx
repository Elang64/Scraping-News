// src/views/RegionsView.jsx
import React, { useState } from 'react';
import {
  Globe2,
  MapPin,
  Radio,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Layers,
  ShieldAlert
} from 'lucide-react';

export default function RegionsView({ regions = [], sources = [], setTab }) {
  const [selectedRegionCard, setSelectedRegionCard] = useState(null);

  // Region breakdown groups
  const regionalGroups = [
    {
      name: 'Sumatra',
      kodam: 'Kodam I/BB, Kodam II/Swj, Kodam Iskandar Muda',
      feedsCount: 10,
      description: 'Aceh, Sumut, Sumbar, Riau, Kepri, Jambi, Bengkulu, Sumsel, Babel, Lampung',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      name: 'Jawa',
      kodam: 'Kodam Jaya, Kodam III/Slw, Kodam IV/Dip, Kodam V/Brw',
      feedsCount: 3,
      description: 'Jawa Barat, Jawa Tengah, Jawa Timur & Ibukota',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      name: 'Kalimantan',
      kodam: 'Kodam VI/Mlw, Kodam XII/Tpr',
      feedsCount: 4,
      description: 'Kaltim (IKN Nusantara), Kalteng, Kalbar, Kalsel & Perbatasan',
      color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      name: 'Sulawesi',
      kodam: 'Kodam XIII/Mdk, Kodam XIV/Hsn',
      feedsCount: 4,
      description: 'Makassar (Sulsel), Manado (Sulut), Sulteng, Sultra',
      color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      name: 'Bali & Nusa Tenggara',
      kodam: 'Kodam IX/Udy',
      feedsCount: 3,
      description: 'Bali, Mataram (NTB), Kupang (NTT)',
      color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      name: 'Maluku & Papua',
      kodam: 'Kodam XV/Ptm, Kodam XVII/Cen, Kodam XVIII/Ksr',
      feedsCount: 2,
      description: 'Ambon (Maluku), Jayapura (Papua & DOB Papua)',
      color: 'from-red-500/20 to-orange-500/10 border-red-500/30',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    },
    {
      name: 'Nasional',
      kodam: 'Mabes TNI AD & Instansi Pusat',
      feedsCount: 16,
      description: 'ANTARA Nasional, Kemhan, BNN, CNN, Sindonews, CNBC, Google News',
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
  ];

  // Map counts from backend `/api/regions`
  const regionCountMap = {};
  regions.forEach((r) => {
    if (r.region) {
      regionCountMap[r.region.toLowerCase()] = r.count;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Globe2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Radar Monitoring Regional Nusantara
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pemetaan cakupan feed RSS ANTARA per kepulauan dan wilayah komando militer (Kodam)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>26 Feed Regional + 16 Feed Nasional Aktif</span>
          </span>
        </div>
      </div>

      {/* Radar Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regionalGroups.map((group, idx) => {
          const matchedCount =
            regionCountMap[group.name.toLowerCase()] ||
            regions.find((r) => r.region?.toLowerCase().includes(group.name.toLowerCase()))?.count ||
            0;

          return (
            <div
              key={idx}
              className={`glass-panel rounded-2xl p-5 border bg-gradient-to-br ${group.color} relative overflow-hidden transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-white">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">
                      {group.name}
                    </h3>
                    <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                      {group.feedsCount} Saluran RSS
                    </span>
                  </div>
                </div>

                <span
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${group.badgeColor}`}
                >
                  {matchedCount} Berita
                </span>
              </div>

              <div className="space-y-2 mt-4 text-xs">
                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Wilayah Kodam:
                  </span>
                  <span className="text-slate-200 font-medium">
                    {group.kodam}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Cakupan Area:
                  </span>
                  <span className="text-slate-300 text-[11px] leading-relaxed">
                    {group.description}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setTab('articles')}
                  className="flex items-center space-x-1 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
                >
                  <span>Filter Berita Wilayah Ini</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Database Raw Breakdown */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-white/10">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Distribusi Data Masuk Berdasarkan Wilayah
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {regions.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between"
            >
              <span className="text-xs text-slate-400 font-medium truncate">
                {item.region || 'Nasional'}
              </span>
              <span className="text-lg font-bold font-mono text-emerald-400 mt-1">
                {item.count}
              </span>
            </div>
          ))}

          {regions.length === 0 && (
            <p className="text-xs text-slate-400 col-span-full text-center py-4">
              Belum ada data wilayah tercatat di basis data.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
