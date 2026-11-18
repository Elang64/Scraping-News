// src/components/MetricCard.jsx
import React from 'react';

export default function MetricCard({
  title,
  value,
  subvalue,
  icon: Icon,
  variant = 'emerald', // emerald, red, amber, cyan
  trend,
}) {
  const variantStyles = {
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      bgGlow: 'from-emerald-500/10 via-transparent to-transparent',
      iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      textAccent: 'text-emerald-400',
    },
    red: {
      border: 'border-red-500/25 hover:border-red-500/50',
      bgGlow: 'from-red-500/10 via-transparent to-transparent',
      iconBg: 'bg-red-500/15 border-red-500/30 text-red-400',
      textAccent: 'text-red-400',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      bgGlow: 'from-amber-500/10 via-transparent to-transparent',
      iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      textAccent: 'text-amber-400',
    },
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      bgGlow: 'from-cyan-500/10 via-transparent to-transparent',
      iconBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
      textAccent: 'text-cyan-400',
    },
  };

  const style = variantStyles[variant] || variantStyles.emerald;

  return (
    <div
      className={`glass-panel rounded-2xl p-4 sm:p-5 border ${style.border} relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 group`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${style.bgGlow} opacity-60 pointer-events-none`}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
              {value}
            </span>
            {subvalue && (
              <span className="text-xs text-slate-400 font-medium">
                {subvalue}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border ${style.iconBg} shadow-sm group-hover:scale-105 transition-transform`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="relative z-10 mt-3 pt-2.5 border-t border-white/5 flex items-center text-xs text-slate-400">
          {trend}
        </div>
      )}
    </div>
  );
}
