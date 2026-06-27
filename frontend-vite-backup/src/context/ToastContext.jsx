import React, { createContext, useState, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon" size={18} style={{ color: 'var(--success)' }} />;
      case 'warn':
        return <AlertTriangle className="toast-icon" size={18} style={{ color: 'var(--warn)' }} />;
      case 'error':
        return <AlertCircle className="toast-icon" size={18} style={{ color: 'var(--danger)' }} />;
      default:
        return <CheckCircle className="toast-icon" size={18} style={{ color: 'var(--accent-hi)' }} />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.75rem', pointerEvents: 'none' }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast show ${toast.type}`}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transform: 'translateX(0)',
              transition: 'transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275)'
            }}
          >
            {getIcon(toast.type)}
            <div className="toast-content" style={{ color: 'var(--text-primary)' }}>{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="toast-close"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                marginLeft: 'auto',
                display: 'flex',
                padding: '0.25rem'
              }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
export default ToastContext;
