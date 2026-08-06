import React from 'react';
import { Calendar, Trash2, Edit3, Archive, CheckCircle, Undo } from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete, onArchive }) {
  const getPriorityStyle = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'LOW':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const isCompleted = task.status === 'COMPLETED';
  const isArchived = task.status === 'ARCHIVED';

  return (
    <div
      className={`glass-card rounded-2xl p-5 border transition-all duration-300 relative ${
        isCompleted
          ? 'border-emerald-500/20 opacity-75'
          : isArchived
          ? 'border-slate-800 opacity-60'
          : 'border-white/5 hover:border-white/10 hover:-translate-y-0.5'
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1.5 flex-1">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getPriorityStyle(task.priority)}`}>
              {task.priority || 'Medium'}
            </span>
            {task.category && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider">
                {task.category}
              </span>
            )}
            {isArchived && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider">
                Archived
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`text-base font-bold text-slate-100 ${isCompleted ? 'line-through text-slate-500' : ''}`}>
            {task.title}
          </h3>

          {/* Description */}
          <p className={`text-xs text-slate-400 leading-relaxed line-clamp-3 ${isCompleted ? 'text-slate-500' : ''}`}>
            {task.description || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="flex justify-between items-center mt-5 pt-4 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>Created {task.createdDate || task.created_date}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {!isArchived && (
            <>
              {/* Toggle Complete */}
              <button
                onClick={() => onToggleComplete(task.id)}
                title={isCompleted ? 'Mark Active' : 'Mark Completed'}
                className={`p-2 rounded-lg border transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-slate-800/60 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-emerald-400'
                }`}
              >
                {isCompleted ? <Undo className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
              </button>

              {/* Edit */}
              <button
                onClick={() => onEdit(task)}
                title="Edit Task"
                className="p-2 rounded-lg bg-slate-800/60 border border-white/5 text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              {/* Archive */}
              <button
                onClick={() => onArchive(task.id)}
                title="Archive Task"
                className="p-2 rounded-lg bg-slate-800/60 border border-white/5 text-slate-400 hover:bg-slate-800 hover:text-slate-300 transition-all"
              >
                <Archive className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Delete */}
          <button
            onClick={() => onDelete(task.id)}
            title="Delete Task"
            className="p-2 rounded-lg bg-slate-800/60 border border-white/5 text-slate-400 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
