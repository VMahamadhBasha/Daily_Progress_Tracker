import React from 'react';
import Calendar from 'react-calendar';
import { CalendarRange, Info } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

export default function CalendarView({ selectedDate, calendarData, onDateSelect }) {
  
  // Format Date to YYYY-MM-DD in local time
  const formatDateLocal = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getTileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const dateStr = formatDateLocal(date);
    const status = calendarData[dateStr];
    
    if (status === 'GREEN') return 'cal-good';
    if (status === 'YELLOW') return 'cal-partial';
    if (status === 'RED') return 'cal-none';
    
    return null;
  };

  const handleDateChange = (value) => {
    const dateStr = formatDateLocal(value);
    onDateSelect(dateStr);
  };

  const selectedDateObj = selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date();

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
            <CalendarRange className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Monthly Progress</h2>
            <p className="text-xs text-slate-400">Select a day to log or view details</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <Calendar
          onChange={handleDateChange}
          value={selectedDateObj}
          tileClassName={getTileClassName}
        />
      </div>

      {/* Legend */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          Progress Indicators
        </h4>
        <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold">
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Good Progress
          </div>
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            Partial Progress
          </div>
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            No Progress
          </div>
        </div>
      </div>
    </div>
  );
}
