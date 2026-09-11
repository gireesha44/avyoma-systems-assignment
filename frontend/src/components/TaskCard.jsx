import React from 'react';
import { Check, Calendar, Edit2, Trash2, AlertCircle } from 'lucide-react';

export function TaskCard({ task, onToggleStatus, onEdit, onDelete }) {
  const isCompleted = task.status === 'completed';

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className={`task-card priority-${task.priority} ${isCompleted ? 'completed' : ''}`}>
      <div className="task-header">
        <button
          className={`checkbox-toggle ${isCompleted ? 'checked' : ''}`}
          onClick={() => onToggleStatus(task.id, isCompleted ? 'pending' : 'completed')}
          title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {isCompleted && <Check size={16} />}
        </button>

        <div style={{ flex: 1 }}>
          <h3 className="task-title">{task.title}</h3>
          {task.description && (
            <p className="task-description" style={{ marginTop: '0.5rem' }}>
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="badge-group">
        <span className={`badge badge-${task.priority}`}>
          {task.priority === 'high' && <AlertCircle size={12} />}
          {task.priority}
        </span>
        <span className={`badge badge-status-${task.status}`}>
          {task.status}
        </span>
      </div>

      <div className="task-footer">
        <div className="task-due-date">
          {task.dueDate ? (
            <>
              <Calendar size={14} />
              <span>Due: {formatDate(task.dueDate)}</span>
            </>
          ) : (
            <span style={{ fontStyle: 'italic', opacity: 0.6 }}>No due date</span>
          )}
        </div>

        <div className="task-actions">
          <button
            className="action-btn"
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(task.id)}
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
