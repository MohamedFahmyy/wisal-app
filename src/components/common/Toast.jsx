import React from 'react';
import { CheckCircle2, X } from '../../utils/icons';

export function Toast({ message, visible, onClose }) {
  if (!visible) return null;

  return (
    <div className="toast-notification">
      <CheckCircle2 size={18} className="toast-icon" />
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="toast-close" aria-label="Close">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
