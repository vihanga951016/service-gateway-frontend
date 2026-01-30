import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import '../App.css';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel' }) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <AlertTriangle size={24} className="text-danger" />
                        <h3>{title}</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {message}
                    </p>
                </div>

                <div className="modal-footer" style={{ gap: '12px', marginTop: '0', paddingTop: '1rem', marginBottom: '1rem', marginRight: '1rem' }}>
                    <button className="secondary-btn" onClick={onClose}>{cancelText}</button>
                    <button className="primary-btn mr-2 ml-2" onClick={handleConfirm} style={{ backgroundColor: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
