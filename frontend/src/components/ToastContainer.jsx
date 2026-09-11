import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
          ) : (
            <AlertCircle size={18} style={{ color: 'var(--color-danger)' }} />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: 'auto' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
