import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Plus, ListTodo, CheckCircle2, Archive, AlertCircle, X, Search } from 'lucide-react';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('ACTIVE'); // ACTIVE, COMPLETED, ARCHIVED
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Delete confirm dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  // Toast states
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await taskService.getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      showToast("Failed to load tasks.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateOrUpdateTask = async (taskData) => {
    try {
      if (taskData.id) {
        // Update task
        await taskService.updateTask(taskData.id, taskData);
        showToast("Task updated successfully!");
      } else {
        // Create task
        await taskService.createTask(taskData);
        showToast("Task created successfully!");
      }
      setIsFormOpen(false);
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      console.error("Error saving task:", err);
      showToast("Failed to save task.", "error");
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await taskService.toggleCompleteTask(id);
      showToast("Task completion toggled!");
      loadTasks();
    } catch (err) {
      console.error("Error toggling task completion:", err);
      showToast("Error updating task.", "error");
    }
  };

  const handleArchive = async (id) => {
    try {
      await taskService.archiveTask(id);
      showToast("Task archived successfully!");
      loadTasks();
    } catch (err) {
      console.error("Error archiving task:", err);
      showToast("Error archiving task.", "error");
    }
  };

  const handleDeleteRequest = (id) => {
    setDeletingTaskId(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await taskService.deleteTask(deletingTaskId);
      showToast("Task deleted successfully!");
      setIsConfirmOpen(false);
      setDeletingTaskId(null);
      loadTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
      showToast("Failed to delete task.", "error");
    }
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesTab = task.status === filterTab;
    const matchesSearch =
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
          <h2 className="text-2xl font-black text-white tracking-tight">Long-Term Task Repository</h2>
          <p className="text-xs text-slate-400">Manage your main topics of study. Archive them when fully accomplished.</p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 transition-all z-10"
        >
          <Plus className="w-4.5 h-4.5" />
          Add Long-Term Task
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/60 border border-white/5 rounded-xl self-start w-full md:w-auto">
          <button
            onClick={() => setFilterTab('ACTIVE')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              filterTab === 'ACTIVE'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListTodo className="w-4.5 h-4.5" />
            Active ({tasks.filter(t => t.status === 'ACTIVE').length})
          </button>
          <button
            onClick={() => setFilterTab('COMPLETED')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              filterTab === 'COMPLETED'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4.5 h-4.5" />
            Completed ({tasks.filter(t => t.status === 'COMPLETED').length})
          </button>
          <button
            onClick={() => setFilterTab('ARCHIVED')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              filterTab === 'ARCHIVED'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Archive className="w-4.5 h-4.5" />
            Archived ({tasks.filter(t => t.status === 'ARCHIVED').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, description, category..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/5 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
          />
        </div>
      </div>

      {/* Task List / Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 glass-panel rounded-2xl border border-white/5 text-center">
          <ListTodo className="w-12 h-12 text-slate-600 mb-4 stroke-1 animate-pulse" />
          <h3 className="text-base font-bold text-slate-300">No {filterTab.toLowerCase()} tasks found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            {searchQuery ? 'Try resetting your search filters.' : `Get started by creating a new long-term task to track in your daily logs.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(t) => {
                setEditingTask(t);
                setIsFormOpen(true);
              }}
              onDelete={handleDeleteRequest}
              onToggleComplete={handleToggleComplete}
              onArchive={handleArchive}
            />
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isFormOpen}
        task={editingTask}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSave={handleCreateOrUpdateTask}
      />

      {/* Deletion Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Confirm Task Deletion"
        message="Are you sure you want to delete this long-term task? This will permanently erase the task and all its daily logging history. This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsConfirmOpen(false);
          setDeletingTaskId(null);
        }}
      />
    </div>
  );
}
