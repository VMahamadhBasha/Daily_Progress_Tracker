import React from 'react';
import { ListTodo, CheckCircle2, AlertCircle, Flame } from 'lucide-react';

export default function DashboardStats({ stats }) {
  const cards = [
    {
      title: 'Total Tasks',
      value: stats?.totalTasks ?? 0,
      icon: ListTodo,
      gradient: 'from-blue-600/20 to-cyan-600/5',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'Active Tasks',
      value: stats?.activeTasks ?? 0,
      icon: AlertCircle,
      gradient: 'from-amber-600/20 to-orange-600/5',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/20',
    },
    {
      title: 'Completed Tasks',
      value: stats?.completedTasks ?? 0,
      icon: CheckCircle2,
      gradient: 'from-emerald-600/20 to-teal-600/5',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
    },
    {
      title: 'Current Streak',
      value: `${stats?.currentStreak ?? 0} Days`,
      icon: Flame,
      gradient: 'from-violet-600/20 to-rose-600/5',
      iconColor: 'text-violet-400',
      borderColor: 'border-violet-500/20',
      pulse: (stats?.currentStreak ?? 0) > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.gradient} p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg backdrop-blur-md`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.title}
                </p>
                <h4 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  {card.value}
                </h4>
              </div>
              <div className={`p-3 rounded-xl bg-slate-900/60 border border-white/5 ${card.iconColor}`}>
                <Icon className={`w-5 h-5 ${card.pulse ? 'animate-pulse' : ''}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
