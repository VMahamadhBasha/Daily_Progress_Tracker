import React, { useState, useEffect } from 'react';
import { dashboardService, calendarService, progressService, taskService } from '../services/api';
import DashboardStats from '../components/DashboardStats';
import CalendarView from '../components/CalendarView';
import DailyLogger from '../components/DailyLogger';
import { Sparkles, Calendar, CheckCircle2, MessageSquare, AlertCircle, X } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [calendarData, setCalendarData] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Format today's date to YYYY-MM-DD local time
  const getTodayDateLocal = () => {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const todayStr = getTodayDateLocal();
      setSelectedDate(todayStr);

      const [statsRes, calendarRes, tasksRes] = await Promise.all([
        dashboardService.getDashboardStats(),
        calendarService.getCalendarData(),
        taskService.getTasks(),
      ]);

      setStats(statsRes.data);
      setCalendarData(calendarRes.data);
      setTasks(tasksRes.data);

      // Load progress for today
      const progressRes = await progressService.getProgressByDate(todayStr);
      setSelectedProgress(progressRes.data);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      showToast("Failed to load dashboard data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDateSelect = async (dateStr) => {
    try {
      setSelectedDate(dateStr);
      const progressRes = await progressService.getProgressByDate(dateStr);
      setSelectedProgress(progressRes.data);
    } catch (err) {
      console.error("Error fetching progress for date:", err);
      showToast("Error loading progress details.", "error");
    }
  };

  const handleSaveProgress = async (progressData) => {
    try {
      const res = await progressService.saveProgress(progressData);
      setSelectedProgress(res.data);
      showToast("Daily progress saved successfully!");
      
      // Reload stats and calendar colors
      const [statsRes, calendarRes, tasksRes] = await Promise.all([
        dashboardService.getDashboardStats(),
        calendarService.getCalendarData(),
        taskService.getTasks(),
      ]);
      setStats(statsRes.data);
      setCalendarData(calendarRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error("Error saving progress:", err);
      showToast("Failed to save progress.", "error");
    }
  };

  // Filter tasks to display in the checklist: 
  // Show active tasks, OR tasks that were completed on this specific day (so they are checked in historical logs)
  const checklistTasks = tasks.filter(task => {
    if (task.status === 'ARCHIVED') return false;
    if (task.status === 'ACTIVE') return true;
    // If completed, include only if it was completed on the currently selected date
    if (task.status === 'COMPLETED' && selectedProgress?.completedTaskIds?.includes(task.id)) {
      return true;
    }
    return false;
  });

  // Calculate selected date's completed tasks details for display
  const completedTasksForSelectedDate = tasks.filter(task => 
    selectedProgress?.completedTaskIds?.includes(task.id)
  );

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl transition-all duration-300 transform translate-y-0 ${
          toast.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
            : 'bg-rose-950/90 border-rose-500/30 text-rose-200'
        }`}>
          <div className={`p-1.5 rounded-lg ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            <AlertCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold">{toast.message}</span>
          <button onClick={() => setToast({ ...toast, show: false })} className="ml-2 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 glass-panel rounded-2xl border border-white/5 relative overflow-hidden bg-gradient-to-r from-violet-950/20 to-indigo-950/10">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
            Welcome Back!
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Your Daily Study Dashboard</h2>
          <p className="text-xs text-slate-400">Keep up your streak and accomplish your goals step-by-step.</p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-900/60 border border-white/5 rounded-xl text-slate-300 font-bold text-xs z-10 shadow-inner">
          <Calendar className="w-4 h-4 text-violet-400" />
          <span>Today is {stats?.todayDate || getTodayDateLocal()}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <DashboardStats stats={stats} />

          {/* Main Grid: Calendar & Logger Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              {/* Monthly Calendar */}
              <CalendarView
                selectedDate={selectedDate}
                calendarData={calendarData}
                onDateSelect={handleDateSelect}
              />

              {/* Day Details Card */}
              <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <h3 className="text-sm font-bold text-slate-200">
                    Log for {selectedDate}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 uppercase tracking-wider">
                    {selectedProgress?.studyHours || 0} hrs studied
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Completed Tasks Info */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Tasks Completed
                    </h4>
                    {completedTasksForSelectedDate.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No tasks completed on this day.</p>
                    ) : (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {completedTasksForSelectedDate.map(task => (
                          <li key={task.id} className="flex items-center gap-2 p-2 bg-slate-900/30 border border-white/5 rounded-lg text-xs text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span className="truncate">{task.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Notes Info */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
                      Daily Summary Note
                    </h4>
                    {selectedProgress?.notes ? (
                      <div className="p-3 bg-slate-900/30 border border-white/5 rounded-xl text-xs text-slate-300 leading-relaxed max-h-24 overflow-y-auto">
                        {selectedProgress.notes}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No notes logged for this day.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Logger form */}
            <div className="lg:col-span-5">
              <DailyLogger
                selectedDate={selectedDate}
                activeTasks={checklistTasks}
                initialProgress={selectedProgress}
                onSaveProgress={handleSaveProgress}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
