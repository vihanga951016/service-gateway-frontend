import React, { useState, useEffect } from 'react';
import { X, MapPin, Phone, Building, Clock, Loader2, Type as TypeIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { addServiceCenter, updateServiceCenter } from '../services/serviceProviderService';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const ServiceCenterModal = ({ isOpen, onClose, onSave, initialData, isViewOnly = false }) => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        contact: '',
        openTime: '',
        closeTime: ''
    });

    useEffect(() => {
        // const formatTimeFromArray = (timeArray) => {
        //     if (Array.isArray(timeArray) && timeArray.length >= 2) {
        //         const hours = timeArray[0].toString().padStart(2, '0');
        //         const minutes = timeArray[1].toString().padStart(2, '0');
        //         return `${hours}:${minutes}`;
        //     }
        //     return timeArray || '';
        // };

        if (initialData) {
            console.log("initialData", initialData);
            setFormData({
                name: initialData.name || '',
                location: initialData.location || '',
                contact: initialData.contact || '',
                openTime: initialData.openTime,
                closeTime: initialData.closeTime
            });
        } else {
            // Reset for Add mode
            setFormData({
                name: '',
                location: '',
                contact: '',
                openTime: '',
                closeTime: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Helper not strictly used for submission (raw sent), but validation/formatting logic is here
    // const formatTime = (time) => ... (Removed per Step 405 change to send raw)

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.name.trim()) return toast.error('Center Name is required');
        if (!formData.location.trim()) return toast.error('Location is required');
        if (!formData.openTime) return toast.error('Opening Time is required');
        if (!formData.closeTime) return toast.error('Closing Time is required');

        setIsSaving(true);

        const submissionData = {
            name: formData.name,
            location: formData.location,
            contact: formData.contact,
            openTime: formData.openTime,
            closeTime: formData.closeTime
        };

        if (initialData && initialData.id) {
            submissionData.id = initialData.id;
            if (submissionData.openTime === initialData.openTime) {
                const timeWithSeconds = submissionData.openTime;
                delete submissionData.openTime;
                const timeWithoutSeconds = timeWithSeconds.split(':').slice(0, 2).join(':');
                submissionData.openTime = timeWithoutSeconds;
            }
            if (submissionData.closeTime === initialData.closeTime) {
                const timeWithSeconds = submissionData.closeTime;
                delete submissionData.closeTime;
                const timeWithoutSeconds = timeWithSeconds.split(':').slice(0, 2).join(':');
                submissionData.closeTime = timeWithoutSeconds;
            }
        }

        try {
            if (initialData) {
                await updateServiceCenter(submissionData);
                toast.success('Service Center updated successfully');
            } else {
                await addServiceCenter(submissionData);
                toast.success('Service Center added successfully');
            }
            onSave(submissionData);
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
                toast.error('Network error');
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <h3>{isViewOnly ? 'View Service Center' : (initialData ? 'Edit Service Center' : 'Add New Service Center')}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            {/* Name */}
                            <div className="input-group">
                                <Building className="input-icon" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Center Name (e.g. Service Point - Galle)"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={isViewOnly}
                                />
                            </div>

                            {/* Location */}
                            <div className="input-group">
                                <MapPin className="input-icon" size={18} />
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Location (e.g. Galle Fort)"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    disabled={isViewOnly}
                                />
                            </div>

                            {/* Contact */}
                            <div className="input-group">
                                <Phone className="input-icon" size={18} />
                                <input
                                    type="tel"
                                    name="contact"
                                    placeholder="Contact Number"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    disabled={isViewOnly}
                                />
                            </div>

                            {/* Type (Removed) */}

                            {/* Opening Hours */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem', display: 'block' }}>Open Time</label>
                                    <div className="input-group">
                                        <Clock className="input-icon" size={18} />
                                        <input
                                            type="time"
                                            name="openTime"
                                            value={formData.openTime}
                                            onChange={handleChange}
                                            required
                                            style={{ colorScheme: 'dark' }}
                                            disabled={isViewOnly}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem', display: 'block' }}>Close Time</label>
                                    <div className="input-group">
                                        <Clock className="input-icon" size={18} />
                                        <input
                                            type="time"
                                            name="closeTime"
                                            value={formData.closeTime}
                                            onChange={handleChange}
                                            required
                                            style={{ colorScheme: 'dark' }}
                                            disabled={isViewOnly}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button type="button" className="secondary-btn" onClick={onClose} disabled={isSaving}>{isViewOnly ? 'Close' : 'Cancel'}</button>
                            {!isViewOnly && (
                                <button type="submit" className="primary-btn" disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            {initialData ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        initialData ? 'Update Center' : 'Create Center'
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

export default ServiceCenterModal;
