import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Sun, Moon, CheckSquare, RefreshCw, AlertCircle } from 'lucide-react';
import { taskApi } from './api/taskApi';
import { TaskStats } from './components/TaskStats';
import { FilterBar } from './components/FilterBar';
import { TaskCard } from './components/TaskCard';
import { TaskFormModal } from './components/TaskFormModal';
import { ToastContainer } from './components/ToastContainer';

export function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, highPriority: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting state
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Toasts state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Toggle Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Load Tasks
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await taskApi.getTasks({
        status: statusFilter,
        priority: priorityFilter,
        search: searchQuery,
        sortBy,
        order: 'DESC'
      });
      setTasks(res.tasks || []);
      if (res.stats) setStats(res.stats);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, searchQuery, sortBy]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Handlers
  const handleCreateTask = async (taskData) => {
    try {
      const res = await taskApi.createTask(taskData);
      addToast('Task created successfully!');
      loadTasks();
    } catch (err) {
      addToast(err.message || 'Failed to create task', 'error');
      throw err;
    }
  };

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    try {
      await taskApi.updateTask(editingTask.id, taskData);
      addToast('Task updated successfully!');
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      addToast(err.message || 'Failed to update task', 'error');
      throw err;
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await taskApi.toggleStatus(id, newStatus);
      addToast(`Task marked as ${newStatus}`);
      loadTasks();
    } catch (err) {
      addToast(err.message || 'Failed to update task status', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.deleteTask(id);
        addToast('Task deleted');
        loadTasks();
      } catch (err) {
        addToast(err.message || 'Failed to delete task', 'error');
      }
    }
  };

  const handleClearCompleted = async () => {
    if (window.confirm('Clear all completed tasks?')) {
      try {
        const res = await taskApi.clearCompleted();
        addToast(`Cleared ${res.deletedCount || 0} completed tasks`);
        loadTasks();
      } catch (err) {
        addToast(err.message || 'Failed to clear completed tasks', 'error');
      }
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon">
            <CheckSquare size={26} />
          </div>
          <div>
            <h1 className="brand-title">TaskFlow</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Streamlined Task & Workflow Management
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn-icon" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <TaskStats stats={stats} />

      {/* Filter & Controls */}
      <FilterBar
        search={searchQuery}
        setSearch={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        completedCount={stats.completed}
        onClearCompleted={handleClearCompleted}
      />

      {/* Main Task List Content */}
      <main>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <RefreshCw className="spin" size={32} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '1rem' }}>Loading tasks...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-icon" style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
              <AlertCircle size={32} />
            </div>
            <h3>Failed to load tasks</h3>
            <p>{error}</p>
            <button className="btn btn-secondary" onClick={loadTasks}>
              Retry Connection
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <CheckSquare size={32} />
            </div>
            <h3>No tasks found</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No tasks match your current search or filter criteria.'
                : 'Your task list is empty. Get started by creating your first task!'}
            </p>
            <button className="btn btn-primary" onClick={openCreateModal} style={{ marginTop: '0.5rem' }}>
              <Plus size={18} />
              <span>Add Your First Task</span>
            </button>
          </div>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onEdit={openEditModal}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal Dialog */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialTask={editingTask}
      />

      {/* Toast Feedback Messages */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
