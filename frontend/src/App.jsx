import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TaskManager from './pages/TaskManager';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-x-hidden flex flex-col">
      {/* Background Glares/Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[45%] aspect-square rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>

      {/* Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-10 z-10">
        {activePage === 'dashboard' ? <Dashboard /> : <TaskManager />}
      </main>

      {/* Simple Footer */}
      <footer className="w-full py-6 text-center border-t border-white/5 bg-slate-950/40 backdrop-blur-md">
        <p className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
          Daily Tracker App &bull; Built with React, Spring Boot & MySQL
        </p>
      </footer>
    </div>
  );
}
