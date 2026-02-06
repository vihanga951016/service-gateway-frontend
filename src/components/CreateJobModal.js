import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, ClipboardList, Building, MapPin, Calendar, Clock, MessageSquare, Briefcase } from 'lucide-react';
import { getAllServiceCenters } from '../services/serviceProviderService';
import { toast } from 'react-toastify';

const CreateJobModal = ({ isOpen, onClose, onJobCreated }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        serviceName: '',
        centerName: '',
        pointName: '',
        appointmentDate: '',
        appointmentTime: '',
        appointmentMethod: 'Walk-in',
        description: ''
    });

    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchCenters = async () => {
                try {
                    const data = await getAllServiceCenters();
                    setCenters(data || []);
                } catch (error) {
                    console.error('Failed to fetch centers:', error);
                }
            };
            fetchCenters();
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Mocking API call
        setTimeout(() => {
            const newJob = {
                id: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
                ...formData,
                status: 'Pending',
                createdAt: new Date().toLocaleString(),
                totalAmount: 0.00,
                paidAmount: 0.00,
                serviceTime: 'TBD'
            };

            toast.success('Job created successfully!');
            onJobCreated(newJob);
            setLoading(false);
            onClose();
            // Reset form
            setFormData({
                customerName: '',
                customerPhone: '',
                customerEmail: '',
                serviceName: '',
                centerName: '',
                pointName: '',
                appointmentDate: '',
                appointmentTime: '',
                appointmentMethod: 'Walk-in',
                description: ''
            });
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '700px',
                    width: '90%',
                    background: 'var(--modal-bg)',
                    boxShadow: 'var(--card-shadow)',
                    border: '1px solid var(--border-color)',
                    animation: 'slideUp 0.3s ease-out'
                }}
            >
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            background: 'rgba(37, 99, 235, 0.1)',
                            color: 'var(--primary-color)',
                            padding: '10px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <h3>Create New Job</h3>
                            <p className="subtitle">Register a new service request</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {/* Customer Section */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <h5 style={{ marginBottom: '1rem', color: 'var(--primary-color)', fontSize: '0.9rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Customer Information</h5>
                            </div>

                            <div className="form-group">
                                <label><User size={14} /> Customer Name</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    required
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label><Phone size={14} /> Phone Number</label>
                                <input
                                    type="tel"
                                    name="customerPhone"
                                    value={formData.customerPhone}
                                    onChange={handleChange}
                                    placeholder="+94 7X XXX XXXX"
                                    required
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label><Mail size={14} /> Email Address</label>
                                <input
                                    type="email"
                                    name="customerEmail"
                                    value={formData.customerEmail}
                                    onChange={handleChange}
                                    placeholder="customer@example.com"
                                    className="form-control"
                                />
                            </div>

                            {/* Service Section */}
                            <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                <h5 style={{ marginBottom: '1rem', color: 'var(--primary-color)', fontSize: '0.9rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Service Details</h5>
                            </div>

                            <div className="form-group">
                                <label><ClipboardList size={14} /> Service Type</label>
                                <select
                                    name="serviceName"
                                    value={formData.serviceName}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                >
                                    <option value="">Select Service</option>
                                    <option value="Standard Repair">Standard Repair</option>
                                    <option value="Premium Inspection">Premium Inspection</option>
                                    <option value="Oil Change">Oil Change</option>
                                    <option value="Wheel Alignment">Wheel Alignment</option>
                                    <option value="Full Diagnostics">Full Diagnostics</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label><Building size={14} /> Service Center</label>
                                <select
                                    name="centerName"
                                    value={formData.centerName}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                >
                                    <option value="">Select Center</option>
                                    {centers.map(center => (
                                        <option key={center.id} value={center.name}>{center.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Schedule Section */}
                            <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                <h5 style={{ marginBottom: '1rem', color: 'var(--primary-color)', fontSize: '0.9rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Schedule</h5>
                            </div>

                            <div className="form-group">
                                <label><Calendar size={14} /> Appointment Date</label>
                                <input
                                    type="date"
                                    name="appointmentDate"
                                    value={formData.appointmentDate}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label><MessageSquare size={14} /> Observations / Notes</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Add any specific requirements or notes..."
                                    className="form-control"
                                    style={{ minHeight: '100px', resize: 'vertical' }}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer" style={{
                        padding: '1.25rem 1.5rem',
                        borderTop: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem'
                    }}>
                        <button type="button" className="secondary-btn" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="primary-btn" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateJobModal;
