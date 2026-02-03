import React, { useState, useEffect } from 'react';
import { X, Layout, Clock, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { addServicePoint, updateServicePoint } from '../services/serviceProviderService';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const ServicePointModal = ({ isOpen, onClose, onSave, centerId, initialData }) => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        shortName: '',
        openTime: '08:00',
        closeTime: '17:00'
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                id: initialData.id,
                name: initialData.name || '',
                shortName: initialData.shortName || '',
                openTime: initialData.openTime || '08:00',
                closeTime: initialData.closeTime || '17:00'
            });
        } else if (!isOpen) {
            setFormData({
                name: '',
                shortName: '',
                openTime: '08:00',
                closeTime: '17:00'
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const dataToSave = {
                id: formData.id,
                name: formData.name,
                shortName: formData.shortName,
                openTime: formData.openTime,
                closeTime: formData.closeTime,
                serviceCenter: { id: parseInt(centerId) }
            };

            if (initialData) {
                await updateServicePoint(dataToSave);
                toast.success('Service point updated successfully');
            } else {
                await addServicePoint(dataToSave);
                toast.success('Service point added successfully');
            }
            onSave();
            onClose();
        } catch (error) {
            if (error?.response?.data?.data) {
                if (error?.response?.data?.code === 1) {
                    toast.info("Session expired. Please login again.");
                    navigate('/login');
                } else {
                    toast.error(error?.response?.data?.data);
                }
            } else {
                toast.error(error.message || `Failed to ${initialData ? 'update' : 'add'} service point`);
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Layout size={20} className="text-primary" />
                        <h3>{initialData ? 'Update Service Point' : 'Add Service Point'}</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Point Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Service Bay"
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Service Type</label>
                            <input
                                type="text"
                                name="shortName"
                                value={formData.shortName}
                                onChange={handleChange}
                                placeholder="e.g. Body Wash"
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Open Time</label>
                                <div style={{ position: 'relative' }}>
                                    <Clock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="time"
                                        name="openTime"
                                        value={formData.openTime}
                                        onChange={handleChange}
                                        className="form-control"
                                        style={{ paddingLeft: '3rem' }}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Close Time</label>
                                <div style={{ position: 'relative' }}>
                                    <Clock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="time"
                                        name="closeTime"
                                        value={formData.closeTime}
                                        onChange={handleChange}
                                        className="form-control"
                                        style={{ paddingLeft: '3rem' }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer" style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button type="button" className="secondary-btn" onClick={onClose} disabled={isSaving}>
                            Cancel
                        </button>
                        <button type="submit" className="primary-btn" disabled={isSaving}>
                            {isSaving ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>{initialData ? 'Updating...' : 'Saving...'}</span>
                                </div>
                            ) : (
                                initialData ? 'Update Service Point' : 'Add Service Point'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServicePointModal;
