import React, { useState, useEffect } from 'react';
import { X, Briefcase, Clock, DollarSign, Loader2, Coins } from 'lucide-react';
import { toast } from 'react-toastify';
import { addService, updateService } from '../services/serviceProviderService';
import '../App.css';

const ServiceModal = ({ isOpen, onClose, onSave, initialData, isViewOnly = false }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        hours: '0',
        minutes: '0',
        seconds: '0',
        totalPrice: '',
        downPrice: '',
        serviceTimeDepends: false,
        totalPriceDepends: false
    });

    useEffect(() => {
        if (initialData) {
            let h = '0', m = '0', s = '0';
            if (initialData.serviceTime) {
                // Handle HH:mm:ss string format
                if (typeof initialData.serviceTime === 'string' && initialData.serviceTime.includes(':')) {
                    const parts = initialData.serviceTime.split(':');
                    h = parts[0] || '0';
                    m = parts[1] || '0';
                    s = parts[2] || '0';
                } else {
                    const date = new Date(initialData.serviceTime);
                    if (!isNaN(date.getTime())) {
                        h = String(date.getHours());
                        m = String(date.getMinutes());
                        s = String(date.getSeconds());
                    }
                }
            }
            setFormData({
                id: initialData.id,
                name: initialData.name || '',
                description: initialData.description || '',
                hours: h,
                minutes: m,
                seconds: s,
                totalPrice: initialData.totalPrice || '',
                downPrice: initialData.downPrice || '',
                serviceTimeDepends: initialData.serviceTimeDepends || false,
                totalPriceDepends: initialData.totalPriceDepends || false
            });
        } else {
            setFormData({
                name: '',
                description: '',
                hours: '0',
                minutes: '0',
                seconds: '0',
                totalPrice: '',
                downPrice: '',
                serviceTimeDepends: false,
                totalPriceDepends: false
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSaving(true);
        try {
            // Format time as HH:mm:ss string
            const h = String(formData.hours).padStart(2, '0');
            const m = String(formData.minutes).padStart(2, '0');
            const s = String(formData.seconds).padStart(2, '0');
            const formattedTime = `${h}:${m}:${s}`;

            const dataToSave = {
                id: formData.id,
                name: formData.name,
                description: formData.description,
                serviceTime: formData.serviceTimeDepends ? null : formattedTime,
                serviceTimeDepends: formData.serviceTimeDepends,
                totalPrice: formData.totalPriceDepends ? 0 : parseInt(formData.totalPrice, 10),
                totalPriceDepends: formData.totalPriceDepends,
                downPrice: parseInt(formData.downPrice, 10)
            };

            let response;
            if (initialData) {
                response = await updateService(dataToSave);
            } else {
                response = await addService(dataToSave);
            }

            if (response && response.code === 0) {
                toast.success(initialData ? 'Service updated successfully' : 'Service added successfully');
                if (onSave) onSave();
                onClose();
            } else {
                toast.error(response?.message || 'Failed to save service');
            }
        } catch (error) {
            if (error?.response?.data?.data) {
                toast.error(error?.response?.data?.data);
            } else {
                toast.error('An error occurred while saving the service');
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <h3>{isViewOnly ? 'View Service' : (initialData ? 'Edit Service' : 'Add New Service')}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="input-group">
                                <Briefcase className="input-icon" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Service Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={isViewOnly}
                                />
                            </div>

                            <div className="input-group">
                                <textarea
                                    name="description"
                                    placeholder="Service Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={isViewOnly}
                                />
                            </div>

                            {/* <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                                <input
                                    type="checkbox"
                                    name="serviceTimeDepends"
                                    id="serviceTimeDepends"
                                    checked={formData.serviceTimeDepends}
                                    onChange={handleChange}
                                    disabled={isViewOnly}
                                />
                                <label htmlFor="serviceTimeDepends" style={{ margin: 0, cursor: 'pointer' }}>Service Time Depends</label>
                            </div> */}

                            {!formData.serviceTimeDepends && (
                                <>
                                    <label style={{ display: 'block', marginBottom: '4px' }}>Service Time</label>
                                    <div className="time-fields" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Hours</label>
                                            <input
                                                type="number"
                                                name="hours"
                                                min="0"
                                                max="23"
                                                value={formData.hours}
                                                onChange={handleChange}
                                                required
                                                disabled={isViewOnly}
                                                className="form-control"
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Mins</label>
                                            <input
                                                type="number"
                                                name="minutes"
                                                min="0"
                                                max="59"
                                                value={formData.minutes}
                                                onChange={handleChange}
                                                required
                                                disabled={isViewOnly}
                                                className="form-control"
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Secs</label>
                                            <input
                                                type="number"
                                                name="seconds"
                                                min="0"
                                                max="59"
                                                value={formData.seconds}
                                                onChange={handleChange}
                                                required
                                                disabled={isViewOnly}
                                                className="form-control"
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                                <input
                                    type="checkbox"
                                    name="totalPriceDepends"
                                    id="totalPriceDepends"
                                    checked={formData.totalPriceDepends}
                                    onChange={handleChange}
                                    disabled={isViewOnly}
                                />
                                <label htmlFor="totalPriceDepends" style={{ margin: 0, cursor: 'pointer' }}>Total Price Depends</label>
                            </div> */}

                            <label style={{ display: 'block', marginBottom: '4px' }}>Prices</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {!formData.totalPriceDepends && (
                                    <div className="input-group">
                                        <DollarSign className="input-icon" size={18} />
                                        <input
                                            type="number"
                                            name="totalPrice"
                                            placeholder="Total Price"
                                            value={formData.totalPrice}
                                            onChange={handleChange}
                                            required={!formData.totalPriceDepends}
                                            disabled={isViewOnly}
                                        />
                                    </div>
                                )}
                                <div className="input-group" style={{ gridColumn: formData.totalPriceDepends ? 'span 2' : 'auto' }}>
                                    <Coins className="input-icon" size={18} />
                                    <input
                                        type="number"
                                        name="downPrice"
                                        placeholder="Down Price"
                                        value={formData.downPrice}
                                        onChange={handleChange}
                                        required
                                        disabled={isViewOnly}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button type="button" className="secondary-btn" onClick={onClose} disabled={isSaving}>
                                {isViewOnly ? 'Close' : 'Cancel'}
                            </button>
                            {!isViewOnly && (
                                <button type="submit" className="primary-btn" disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            {initialData ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        initialData ? 'Update Service' : 'Create Service'
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ServiceModal;
