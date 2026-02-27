import React, { useState, useEffect, useRef } from 'react';
import { X, User, Phone, Mail, ClipboardList, Building, MapPin, Calendar, Clock, MessageSquare, Briefcase, Search, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { getServiceCenterDropdown, getProvidingServicesByCenterId } from '../services/serviceProviderService';
import { prepareJob, createJob, removeJobAndCustomer } from '../services/jobService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateJobModal = ({ isOpen, onClose, onJobCreated }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        centerName: '',
        centerId: '',
        serviceName: '',
        centerClusterId: '',
        pointName: '',
        appointmentDate: '',
        appointmentMethod: 'Walk-in',
        description: ''
    });

    const [centers, setCenters] = useState([]);
    const [services, setServices] = useState([]); // Cluster services
    const [nonClusterServices, setNonClusterServices] = useState([]); // Non-cluster services
    const [isCustomService, setIsCustomService] = useState(false);
    const [selectedCustomServices, setSelectedCustomServices] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPreparing, setIsPreparing] = useState(false);
    const [showTimeline, setShowTimeline] = useState(false);
    const [timelineData, setTimelineData] = useState([]);
    const [preparedJobIds, setPreparedJobIds] = useState(null); // { jobId, customerId }
    const [isCleaningUp, setIsCleaningUp] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            const fetchCenters = async () => {
                try {
                    const data = await getServiceCenterDropdown();
                    setCenters(data || []);
                } catch (error) {
                    console.error('Failed to fetch centers:', error);
                }
            };
            fetchCenters();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = async (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'isCustomService') {
            setIsCustomService(checked);
            setFormData(prev => ({ ...prev, serviceName: '', centerClusterId: '' }));
            setSelectedCustomServices([]);
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'serviceName' && !isCustomService) {
            const selectedService = services.find(s => s.service === value);
            if (selectedService) {
                // Using serviceId as centerClusterId as per user instruction
                setFormData(prev => ({ ...prev, centerClusterId: selectedService.serviceId }));
            }
        }

        if (name === 'centerName') {
            // Reset service selection when center changes
            setFormData(prev => ({
                ...prev,
                centerName: value,
                centerId: centers.find(c => c.name === value)?.id || '',
                serviceName: '',
                centerClusterId: ''
            }));
            setServices([]);
            setNonClusterServices([]);
            setSelectedCustomServices([]);

            if (value) {
                const selectedCenter = centers.find(c => c.name === value);
                if (selectedCenter) {
                    try {
                        const servicesData = await getProvidingServicesByCenterId(selectedCenter.id);
                        const data = servicesData || [];

                        setServices(data.filter(s => s.cluster === true));
                        setNonClusterServices(data.filter(s => s.cluster === false));
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
                    }
                }
            }
        }
    };

    const toggleCustomService = (service) => {
        const isSelected = selectedCustomServices.find(s => s.serviceId === service.serviceId);
        if (isSelected) {
            setSelectedCustomServices(selectedCustomServices.filter(s => s.serviceId !== service.serviceId));
        } else {
            setSelectedCustomServices([...selectedCustomServices, service]);
        }
    };

    const filteredNonClusterServices = nonClusterServices.filter(s =>
        s.service.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsPreparing(true);
        try {
            const prepareData = {
                customer: formData.customerName,
                phone: formData.customerPhone,
                centerClusterId: isCustomService ? null : (formData.centerClusterId || null),
                servicesIds: isCustomService ? selectedCustomServices.map(s => s.serviceId) : [],
                serviceCenterId: formData.centerId,
                appointmentDate: formData.appointmentDate,
                notes: formData.description
            };

            const data = await prepareJob(prepareData);
            console.log('Prepare Job Response:', data);
            setTimelineData(data || []);
            // Assuming response contains jobId and customerId based on user request /jobs/{jobId}/remove/customer/{customerId}
            if (data?.jobId && data?.customerId) {
                console.log('Setting preparedJobIds:', { jobId: data.jobId, customerId: data.customerId });
                setPreparedJobIds({ jobId: data.jobId, customerId: data.customerId });
            } else {
                console.warn('JobId or CustomerId missing in response:', data);
            }
            setShowTimeline(true);
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
            setIsPreparing(false);
        }
    };

    const handleFinalCreate = async () => {
        setLoading(true);
        try {
            const jobData = {
                customer: formData.customerName,
                phone: formData.customerPhone,
                centerClusterId: isCustomService ? null : (formData.centerClusterId || null),
                servicesIds: isCustomService ? selectedCustomServices.map(s => s.serviceId) : [],
                serviceCenterId: formData.centerId,
                appointmentDate: formData.appointmentDate,
                notes: formData.description
            };

            const response = await createJob(jobData);
            toast.success('Job created successfully!');
            onJobCreated(response);
            onClose();

            // Reset form
            setFormData({
                customerName: '',
                customerPhone: '',
                customerEmail: '',
                centerName: '',
                centerId: '',
                serviceName: '',
                centerClusterId: '',
                pointName: '',
                appointmentDate: '',
                appointmentMethod: 'Walk-in',
                description: ''
            });
            setIsCustomService(false);
            setSelectedCustomServices([]);
            setSearchTerm('');
            setShowTimeline(false);
            setPreparedJobIds(null);
        } catch (error) {
            toast.error(error.message || 'Failed to create job');
        } finally {
            setLoading(false);
        }
    };

    const handleCleanup = async () => {
        console.log('handleCleanup called, preparedJobIds:', preparedJobIds);
        if (!preparedJobIds) {
            console.log('No preparedJobIds, skipping cleanup');
            return true;
        }

        setIsCleaningUp(true);
        console.log('Calling removeJobAndCustomer service...');
        try {
            await removeJobAndCustomer(preparedJobIds.jobId, preparedJobIds.customerId);
            console.log('Cleanup successful');
            setPreparedJobIds(null);
            return true;
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
            setIsCleaningUp(false);
        }
    };

    const handleBack = async () => {
        const success = await handleCleanup();
        console.log("success: ", success);

        if (success) {
            setShowTimeline(false);
        }
    };

    const handleModalClose = async () => {
        if (showTimeline && preparedJobIds) {
            const success = await handleCleanup();
            if (success) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    const renderTimeline = () => {
        // Timeline data structure from API: 
        // { appointmentDate: "...", appointmentTime: "...", jobsAtPoint: [...] }
        const jobsAtPoint = timelineData?.jobsAtPoint || [];

        return (
            <div className="timeline-view" style={{ padding: '1.5rem', minHeight: '400px', animation: 'fadeIn 0.3s ease-in-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h5 style={{ color: 'var(--primary-color)', fontSize: '1.1rem', fontWeight: '600', marginBottom: '4px' }}>Proposed Job Schedule</h5>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Review the suggested schedule for the requested services</p>
                    </div>
                    <div style={{ fontSize: '0.85rem', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary-color)', padding: '6px 14px', borderRadius: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} />
                        {timelineData?.appointmentDate || formData.appointmentDate || 'Today'}
                    </div>
                </div>

                <div style={{ position: 'relative', paddingLeft: '20px' }}>
                    {/* Vertical line (track) */}
                    <div style={{
                        position: 'absolute',
                        left: '31px',
                        top: '10px',
                        bottom: '20px',
                        width: '2px',
                        background: 'var(--border-color)',
                        zIndex: 0
                    }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {jobsAtPoint.map((item, index) => {
                            const isNewJob = item.id === null;
                            const service = item.service || {};
                            const servicePoint = item.servicePoint || {};
                            const startTime = item.startTime;
                            const endTime = item.endTime;
                            const customer = item.job?.customer?.customer || 'Unknown';

                            return (
                                <div key={index} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                                    {/* Node */}
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: 'var(--modal-bg)',
                                        border: `2px ${isNewJob ? 'dashed' : 'solid'} var(--primary-color)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: '4px',
                                        flexShrink: 0,
                                        boxShadow: '0 0 0 4px var(--modal-bg)'
                                    }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color)' }} />
                                    </div>

                                    {/* Content */}
                                    <div style={{
                                        flex: 1,
                                        background: isNewJob ? 'rgba(37, 99, 235, 0.05)' : 'rgba(0,0,0,0.02)',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: isNewJob ? '1px dashed var(--primary-color)' : '1px solid var(--border-color)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer'
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = isNewJob ? 'rgba(37, 99, 235, 0.08)' : 'rgba(0,0,0,0.04)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = isNewJob ? 'rgba(37, 99, 235, 0.05)' : 'rgba(0,0,0,0.02)'}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: '700', fontSize: '0.95rem', color: isNewJob ? 'var(--primary-color)' : 'var(--text-primary)' }}>
                                                    {service.name || 'Service'}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: '#10b981' }}>
                                                <span className="text-success" style={{ fontSize: '0.75rem', background: 'rgba(37, 99, 235, 0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                                                    {servicePoint.name || 'TBD'}
                                                </span>
                                                {service.totalPrice && (
                                                    <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>Rs. {service.totalPrice.toLocaleString()}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={14} style={{ color: 'var(--primary-color)' }} />
                                                {startTime?.substring(0, 5)} - {endTime?.substring(0, 5)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem', padding: '1rem', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '12px', border: '1px solid rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ color: 'var(--primary-color)', marginTop: '2px' }}><MessageSquare size={16} /></div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        This view shows the proposed schedule for the selected services. Please review the bay assignments and times before confirming.
                    </p>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleModalClose}>
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
                    <button className="close-btn" onClick={handleModalClose} disabled={isCleaningUp || loading || isPreparing}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        {!showTimeline ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                {/* Customer Section */}
                                <div style={{ gridColumn: 'span 2' }}>
                                    <h5 style={{ marginBottom: '1rem', color: 'var(--primary-color)', fontSize: '0.9rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Customer Information</h5>
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><User size={14} /> Customer</label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        placeholder="Customer"
                                        required
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><Phone size={14} /> Phone Number</label>
                                    <input
                                        type="tel"
                                        name="customerPhone"
                                        value={formData.customerPhone}
                                        onChange={handleChange}
                                        placeholder="Customer Phone"
                                        required
                                        className="form-control"
                                    />
                                </div>

                                {/* <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><Mail size={14} /> Email Address</label>
                                    <input
                                        type="email"
                                        name="customerEmail"
                                        value={formData.customerEmail}
                                        onChange={handleChange}
                                        placeholder="customer@example.com"
                                        className="form-control"
                                    />
                                </div> */}

                                {/* Service Section */}
                                <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                    <h5 style={{ marginBottom: '1rem', color: 'var(--primary-color)', fontSize: '0.9rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Service Details</h5>
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><Building size={14} /> Service Center</label>
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

                                <div className="form-group" style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    <label className="checkbox-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                                        <input
                                            type="checkbox"
                                            name="isCustomService"
                                            checked={isCustomService}
                                            onChange={handleChange}
                                        />
                                        <span>Custom Services (Non-Cluster)</span>
                                    </label>
                                </div>

                                {!isCustomService ? (
                                    <div className="form-group">
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><ClipboardList size={14} /> Service Type</label>
                                        <select
                                            name="serviceName"
                                            value={formData.serviceName}
                                            onChange={handleChange}
                                            required
                                            className="form-control"
                                        >
                                            <option value="">Select Service</option>
                                            {services.map(service => (
                                                <option key={service.serviceId} value={service.service}>{service.service}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><ClipboardList size={14} /> Custom Services</label>
                                        <div className="custom-dropdown" ref={dropdownRef}>
                                            <div
                                                className="dropdown-input-wrapper"
                                                onClick={() => setIsDropdownOpen(true)}
                                                style={{
                                                    border: isDropdownOpen ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                                                    boxShadow: isDropdownOpen ? '0 0 0 3px rgba(37, 99, 235, 0.1)' : 'none',
                                                }}
                                            >
                                                <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                                                <input
                                                    type="text"
                                                    placeholder={selectedCustomServices.length > 0 ? "" : "Search non-cluster services..."}
                                                    className="dropdown-search-input"
                                                    value={searchTerm}
                                                    onChange={(e) => {
                                                        setSearchTerm(e.target.value);
                                                        setIsDropdownOpen(true);
                                                    }}
                                                    onFocus={() => setIsDropdownOpen(true)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <button
                                                    className="dropdown-toggle-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsDropdownOpen(!isDropdownOpen);
                                                    }}
                                                    type="button"
                                                >
                                                    {isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </button>
                                            </div>

                                            {isDropdownOpen && (
                                                <div className="dropdown-options-list" style={{ maxHeight: '200px' }}>
                                                    {filteredNonClusterServices.length > 0 ? (
                                                        filteredNonClusterServices.map(service => {
                                                            const isSelected = selectedCustomServices.some(s => s.serviceId === service.serviceId);
                                                            return (
                                                                <div
                                                                    key={service.serviceId}
                                                                    className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                                                                    onClick={() => toggleCustomService(service)}
                                                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                                >
                                                                    <span>{service.service}</span>
                                                                    {isSelected && <Check size={16} />}
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="no-options" style={{ padding: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No services found</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {selectedCustomServices.length > 0 && (
                                            <div className="selected-tags" style={{ marginTop: '0.75rem', gap: '0.5rem' }}>
                                                {selectedCustomServices.map(service => (
                                                    <div key={service.serviceId} className="tag-pill">
                                                        <span>{service.service}</span>
                                                        <button
                                                            type="button"
                                                            className="tag-remove"
                                                            onClick={() => toggleCustomService(service)}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}



                                {/* Schedule Section */}
                                <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                    <h5 style={{ marginBottom: '1rem', color: 'var(--primary-color)', fontSize: '0.9rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Schedule</h5>
                                </div>

                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><Calendar size={14} /> Appointment Date</label>
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
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><MessageSquare size={14} /> Observations / Notes</label>
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
                        ) : (
                            renderTimeline()
                        )}
                    </div>

                    <div className="modal-footer" style={{
                        padding: '1.25rem 1.5rem',
                        borderTop: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem'
                    }}>
                        {!showTimeline ? (
                            <>
                                <button type="button" className="secondary-btn" onClick={handleModalClose} disabled={isPreparing || loading || isCleaningUp}>
                                    Cancel
                                </button>
                                <button type="submit" className="primary-btn" disabled={isPreparing || loading || isCleaningUp}>
                                    {isPreparing ? 'Preparing...' : 'Prepare Job'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button type="button" className="secondary-btn" onClick={handleBack} disabled={loading || isCleaningUp}>
                                    {isCleaningUp ? 'Cleaning up...' : 'Back'}
                                </button>
                                <button type="button" className="primary-btn" onClick={handleFinalCreate} disabled={loading || isCleaningUp}>
                                    {loading ? 'Creating...' : 'Create Job'}
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateJobModal;
