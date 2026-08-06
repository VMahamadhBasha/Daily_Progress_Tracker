import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md p-6 glass-panel rounded-2xl shadow-2xl border border-rose-500/20 transform scale-100 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-rose-500/10 text-rose-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">{title}</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-400 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-500 shadow-lg shadow-rose-900/20 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
