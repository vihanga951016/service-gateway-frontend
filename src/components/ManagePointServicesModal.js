import React, { useState, useEffect } from 'react';
import { X, Briefcase, Plus, Trash2, Search, Clock, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { getAvailableServicesForPoint, getAssignedServicesForPoint, assignServiceToPoint, unassignServiceFromPoint } from '../services/serviceProviderService';
import { useNavigate } from 'react-router-dom';

const ManagePointServicesModal = ({ isOpen, onClose, servicePoint, assignedServices = [], onUpdateServices }) => {
    const navigate = useNavigate();
    const [localAssignedServices, setLocalAssignedServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [availableServices, setAvailableServices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        if (isOpen && servicePoint) {
            setLocalAssignedServices(assignedServices);
            setSearchTerm('');
            fetchAvailableServices();
            fetchAssignedServices();
        }
    }, [isOpen, servicePoint, assignedServices]);

    const fetchAvailableServices = async () => {
        if (!servicePoint?.id) return;

        setIsLoading(true);
        setError(null);
        try {
            const services = await getAvailableServicesForPoint(servicePoint.id);
            setAvailableServices(services || []);
        } catch (err) {
            if (error?.response?.data?.data) {
                if (error?.response?.data?.code === 1) {
                    toast.info("Session expired. Please login again.");
                    navigate('/login');
                } else {
                    toast.error(error?.response?.data?.data);
                }
            } else {
                toast.error('Failed to load service center details');
            }
            setAvailableServices([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAssignedServices = async () => {
        if (!servicePoint?.id) return;

        setIsLoading(true);
        setError(null);
        try {
            const services = await getAssignedServicesForPoint(servicePoint.id);
            setLocalAssignedServices(services || []);
        } catch (err) {
            if (error?.response?.data?.data) {
                if (error?.response?.data?.code === 1) {
                    toast.info("Session expired. Please login again.");
                    navigate('/login');
                } else {
                    toast.error(error?.response?.data?.data);
                }
            } else {
                toast.error('Failed to load service center details');
            }
            setLocalAssignedServices([]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !servicePoint) return null;

    const filteredAvailableServices = availableServices.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.category && service.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleAddService = async (service) => {
        setProcessingId(service.id);
        try {
            await assignServiceToPoint(service.id, servicePoint.id);
            const updated = [...localAssignedServices, service];
            setLocalAssignedServices(updated);
            onUpdateServices(servicePoint.id, updated);
            // Remove from available services
            setAvailableServices(prev => prev.filter(s => s.id !== service.id));
            toast.success(`${service.name} added to ${servicePoint.name}`);
        } catch (err) {
            toast.error(err.message || 'Failed to add service');
        } finally {
            setProcessingId(null);
        }
    };

    const handleRemoveService = async (service) => {
        setProcessingId(service.id);
        try {
            await unassignServiceFromPoint(service.id, servicePoint.id);
            const updated = localAssignedServices.filter(s => s.id !== service.id);
            setLocalAssignedServices(updated);
            onUpdateServices(servicePoint.id, updated);
            // Add back to available services
            setAvailableServices(prev => [...prev, service]);
            toast.success(`${service.name} removed from ${servicePoint.name}`);
        } catch (err) {
            toast.error(err.message || 'Failed to remove service');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', maxHeight: '90vh' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Briefcase size={20} className="text-primary" />
                        <div>
                            <h3 style={{ margin: 0 }}>Manage Services</h3>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {servicePoint.name}
                            </p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body" style={{ padding: '1.5rem', overflowY: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {/* Assigned Services Section */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary-color)' }}>
                                    Assigned Services ({localAssignedServices.length})
                                </h4>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                {localAssignedServices.length > 0 ? (
                                    localAssignedServices.map(service => (
                                        <div
                                            key={service.id}
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '12px',
                                                border: '1px solid var(--border-color)',
                                                background: 'rgba(37, 99, 235, 0.05)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                                                    {service.name}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                    <span style={{
                                                        padding: '0.15rem 0.5rem',
                                                        borderRadius: '12px',
                                                        background: 'rgba(37, 99, 235, 0.15)',
                                                        color: 'var(--primary-color)',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600'
                                                    }}>
                                                        {service.category}
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Clock size={12} />
                                                        {service.serviceTime}
                                                    </span>
                                                    <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
                                                        {service.totalPrice}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                className="icon-action-btn text-danger"
                                                onClick={() => handleRemoveService(service)}
                                                disabled={processingId === service.id}
                                                title="Remove service"
                                                style={{ marginLeft: '1rem' }}
                                            >
                                                {processingId === service.id ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '3rem 1rem',
                                        background: 'var(--hover-bg)',
                                        borderRadius: '12px',
                                        border: '1px dashed var(--border-color)',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        <Briefcase size={32} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                                        <p style={{ margin: 0 }}>No services assigned yet</p>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>Add services from the available list</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Available Services Section */}
                        <div>
                            <div style={{ marginBottom: '1rem' }}>
                                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', color: 'var(--primary-color)' }}>
                                    Available Services ({availableServices.length})
                                </h4>
                                <div style={{ position: 'relative' }}>
                                    <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="text"
                                        placeholder="Search services..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--hover-bg)',
                                            fontSize: '0.85rem'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                {isLoading ? (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '3rem',
                                        background: 'var(--hover-bg)',
                                        borderRadius: '12px'
                                    }}>
                                        <Loader2 className="animate-spin text-primary" size={32} />
                                    </div>
                                ) : error ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '3rem 1rem',
                                        background: 'var(--hover-bg)',
                                        borderRadius: '12px',
                                        border: '1px dashed #ef4444',
                                        color: '#ef4444'
                                    }}>
                                        <p style={{ margin: 0 }}>{error}</p>
                                        <button
                                            className="secondary-btn"
                                            onClick={fetchAvailableServices}
                                            style={{ marginTop: '1rem' }}
                                        >
                                            Retry
                                        </button>
                                    </div>
                                ) : filteredAvailableServices.length > 0 ? (
                                    filteredAvailableServices.map(service => (
                                        <div
                                            key={service.id}
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '12px',
                                                border: '1px solid var(--border-color)',
                                                background: 'transparent',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                transition: 'all 0.2s',
                                                cursor: 'pointer'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                                                    {service.name}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                    {service.category && (
                                                        <span style={{
                                                            padding: '0.15rem 0.5rem',
                                                            borderRadius: '12px',
                                                            background: 'var(--hover-bg)',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            {service.category}
                                                        </span>
                                                    )}
                                                    {service.serviceTime && (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                            <Clock size={12} />
                                                            {service.serviceTime}
                                                        </span>
                                                    )}
                                                    {service.totalPrice && (
                                                        <span style={{ fontWeight: '600' }}>
                                                            {service.totalPrice}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                className="secondary-btn"
                                                onClick={() => handleAddService(service)}
                                                disabled={processingId === service.id}
                                                style={{
                                                    padding: '0.4rem 0.75rem',
                                                    fontSize: '0.85rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    marginLeft: '1rem',
                                                    minWidth: '70px',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {processingId === service.id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <>
                                                        <Plus size={14} />
                                                        Add
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '3rem 1rem',
                                        background: 'var(--hover-bg)',
                                        borderRadius: '12px',
                                        border: '1px dashed var(--border-color)',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        <Search size={32} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                                        <p style={{ margin: 0 }}>
                                            {searchTerm ? 'No services found' : 'All services assigned'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer" style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="button" className="primary-btn" onClick={onClose}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManagePointServicesModal;
