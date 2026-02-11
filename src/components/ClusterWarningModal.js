import React from 'react';
import { X, AlertTriangle, Briefcase } from 'lucide-react';

const ClusterWarningModal = ({ isOpen, onClose, clusterName, services }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '500px', maxWidth: '90vw' }}>
                <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            background: '#fff7ed',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <AlertTriangle size={20} color="#f59e0b" />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Unassigned Services</h3>
                    </div>
                    <button
                        className="icon-action-btn"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body" style={{ padding: '1.5rem 0', marginTop: '1rem', marginLeft: '1rem', marginRight: '1rem' }}>
                    <p style={{
                        margin: '0 0 1.5rem 0',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5'
                    }}>
                        The following {services.length > 0 && services.length === 1 ? 'service was ' : 'services were '} <b style={{ color: 'var(--danger-color)' }}>not assigned to any service point.</b> Customers will not be able to book {services.length > 0 && services.length === 1 ? ' this service ' : ' theseservices '} until they are assigned.
                    </p>

                    <p style={{
                        margin: '0 0 1.5rem 0',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5'
                    }}>
                        Go to the next tab called <b style={{ color: 'var(--primary-color)' }}>Service Points</b> and assign {services.length > 0 && services.length === 1 ? ' this service ' : ' these services '} to a service point.
                    </p>

                    <div style={{
                        background: 'var(--hover-bg)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}>
                        {services && services.length > 0 ? (
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                {services.map((service, index) => (
                                    <li key={index} style={{
                                        padding: '0.75rem 1rem',
                                        borderBottom: index !== services.length - 1 ? '1px solid var(--border-color)' : 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem'
                                    }}>
                                        <Briefcase size={16} className="text-primary" />
                                        <span style={{ fontWeight: '500' }}>{service.service || service.name || service}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                No unassigned services found.
                            </div>
                        )}
                    </div>
                </div>

                {/* <div className="modal-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
                    <button
                        className="secondary-btn"
                        onClick={onClose}
                        style={{ width: '100%' }}
                    >
                        Close
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default ClusterWarningModal;
