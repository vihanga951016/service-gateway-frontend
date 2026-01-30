import React from 'react';
import { Info, X } from 'lucide-react';
import '../App.css';

const InfoModal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Info size={24} className="text-primary" />
                        <h3>{title}</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1.5rem' }}>
                    <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '500', textAlign: 'center' }}>
                        {content}
                    </p>
                </div>

                <div className="modal-footer" style={{ justifyContent: 'center', paddingBottom: '1.5rem', paddingTop: '0', borderTop: 'none' }}>
                    <button className="primary-btn" onClick={onClose} style={{ minWidth: '100px', justifyContent: 'center' }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
