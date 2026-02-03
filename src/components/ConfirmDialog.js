import React from 'react';
import { AlertTriangle, X, CheckCircle2, ShieldAlert } from 'lucide-react';
import '../App.css';

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger', // 'danger', 'primary', 'success', 'warning'
    icon: IconProp
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const getIcon = () => {
        if (IconProp) return <IconProp size={24} className={`text-${type}`} />;

        switch (type) {
            case 'success': return <CheckCircle2 size={24} className="text-success" />;
            case 'warning': return <ShieldAlert size={24} className="text-warning" />;
            case 'primary': return <AlertTriangle size={24} className="text-primary" />;
            default: return <AlertTriangle size={24} className="text-danger" />;
        }
    };

    const getConfirmButtonStyle = () => {
        let bgColor = 'var(--danger-color)';
        switch (type) {
            case 'success': bgColor = 'var(--success-color, #28a745)'; break;
            case 'primary': bgColor = 'var(--primary-color, #007bff)'; break;
            case 'warning': bgColor = 'var(--warning-color, #ffc107)'; break;
            default: bgColor = 'var(--danger-color)';
        }
        return { backgroundColor: bgColor, borderColor: bgColor };
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {getIcon()}
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
                    <button className="primary-btn mr-2 ml-2" onClick={handleConfirm} style={getConfirmButtonStyle()}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
