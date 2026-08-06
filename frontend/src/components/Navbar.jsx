import React from 'react';
import { LayoutDashboard, ListTodo, GraduationCap } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-200 via-indigo-200 to-slate-200 bg-clip-text text-transparent">
            DailyTracker
          </h1>
          <p className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">
            Personal Productivity
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-1 bg-slate-900/60 border border-white/5 rounded-xl">
        <button
          onClick={() => setActivePage('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activePage === 'dashboard'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => setActivePage('tasks')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activePage === 'tasks'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListTodo className="w-4 h-4" />
          Tasks
        </button>
      </div>
    </nav>
  );
}
