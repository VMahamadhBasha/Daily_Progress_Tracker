import React, { useState, useEffect } from 'react';
import { Save, ClipboardList, BookOpen, Clock, StickyNote } from 'lucide-react';

export default function DailyLogger({ selectedDate, activeTasks, initialProgress, onSaveProgress }) {
  const [notes, setNotes] = useState('');
  const [studyHours, setStudyHours] = useState('');
  const [checkedTaskIds, setCheckedTaskIds] = useState([]);

  // Load progress details when initialProgress or date changes
  useEffect(() => {
    if (initialProgress) {
      setNotes(initialProgress.notes || '');
      setStudyHours(initialProgress.studyHours || '');
      setCheckedTaskIds(initialProgress.completedTaskIds || []);
    } else {
      setNotes('');
      setStudyHours('');
      setCheckedTaskIds([]);
    }
  }, [initialProgress, selectedDate]);

  const handleTaskToggle = (taskId) => {
    setCheckedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveProgress({
      date: selectedDate,
      notes: notes.trim(),
      studyHours: studyHours === '' ? 0.0 : parseFloat(studyHours),
      completedTaskIds: checkedTaskIds,
    });
  };



  return (
    <form onSubmit={handleSave} className="glass-panel rounded-2xl p-6 border border-white/5 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/5">
        <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-100">Log Daily Progress</h2>
          <p className="text-xs text-slate-400">For {selectedDate}</p>
        </div>
      </div>

      {/* Task Checklist */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-slate-500" />
          Tasks Completed Today
        </label>
        {activeTasks.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-white/5 bg-slate-900/30 text-center text-xs text-slate-500">
            No active tasks available. Go to Tasks tab to add some!
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {activeTasks.map((task) => {
              const isChecked = checkedTaskIds.includes(task.id);
              return (
                <div
                  key={task.id}
                  onClick={() => handleTaskToggle(task.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-violet-600/15 border-violet-500/30 text-slate-100 shadow-sm shadow-violet-500/5'
                      : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-900/70 hover:text-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // Controlled click via parent div
                    className="w-4 h-4 rounded border-white/10 text-violet-600 bg-slate-900 focus:ring-violet-500 focus:ring-offset-slate-900 transition-all pointer-events-none"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${isChecked ? 'text-violet-200' : ''}`}>
                      {task.title}
                    </p>
                    {task.category && (
                      <span className="inline-block text-[9px] font-semibold text-slate-500 uppercase mt-0.5">
                        {task.category}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Note details */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <StickyNote className="w-4 h-4 text-slate-500" />
          Daily Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What did you learn today? Notes, achievements, or blockages..."
          rows={3}
          className="w-full px-4 py-3 bg-slate-900/60 border border-white/5 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-xs"
        />
      </div>

      {/* Study hours */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Clock className="w-4 h-4 text-slate-500" />
          Study Hours (optional)
        </label>
        <input
          type="number"
          step="0.5"
          min="0"
          max="24"
          value={studyHours}
          onChange={(e) => setStudyHours(e.target.value)}
          placeholder="e.g. 4.5"
          className="w-full px-4 py-2.5 bg-slate-900/60 border border-white/5 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-xs"
        />
      </div>

      {/* Save Button */}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 transition-all text-sm"
      >
        <Save className="w-4.5 h-4.5" />
        Save Progress Log
      </button>
    </form>
  );
}
