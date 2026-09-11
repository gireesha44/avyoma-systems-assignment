import React from 'react';
import { Search, Trash2, ArrowUpDown, Filter } from 'lucide-react';

export function FilterBar({ 
  search, 
  setSearch, 
  statusFilter, 
  setStatusFilter, 
  priorityFilter, 
  setPriorityFilter,
  sortBy,
  setSortBy,
  completedCount,
  onClearCompleted 
}) {
  return (
    <div className="controls-card">
      <div className="controls-top">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="controls-filters">
        <div className="tabs-group">
          <button
            className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button
            className={`tab-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`tab-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Priority Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              className="select-input"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              className="select-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="title">Title (A-Z)</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          {/* Clear Completed Button */}
          {completedCount > 0 && (
            <button
              className="btn btn-danger-ghost"
              onClick={onClearCompleted}
              title="Clear all completed tasks"
              style={{ fontSize: '0.85rem', padding: '0.55rem 0.85rem' }}
            >
              <Trash2 size={16} />
              Clear Completed ({completedCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
