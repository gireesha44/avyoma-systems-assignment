import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Layers } from 'lucide-react';

export function TaskStats({ stats }) {
  const { total = 0, completed = 0, pending = 0, highPriority = 0 } = stats;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-total">
            <Layers size={24} />
          </div>
          <div className="stat-info">
            <h4>Total Tasks</h4>
            <div className="stat-value">{total}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-completed">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <h4>Completed</h4>
            <div className="stat-value">{completed}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-pending">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h4>Pending</h4>
            <div className="stat-value">{pending}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-high">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <h4>High Priority</h4>
            <div className="stat-value">{highPriority}</div>
          </div>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-header">
          <span>Overall Progress</span>
          <span>{completionPercentage}% Completed</span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
