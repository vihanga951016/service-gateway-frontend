import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Shield, Clock, Building, CheckCircle, AlertCircle, Search, Filter, Edit2, Save, X } from 'lucide-react';
import '../App.css';
import axios from 'axios';
import { getConfig } from '../config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ServiceProviderProfile = () => {
    const navigate = useNavigate();
    // Mock Data
    const [provider, setProvider] = useState({
        id: 1,
        name: "TechSolutions Lanka (Pvt) Ltd",
        regNo: "PV-123456",
        email: "info@techsolutions.lk",
        contact: "+94 11 234 5678",
        address: "No. 123, Galle Road, Colombo 03, Sri Lanka",
        website: "www.techsolutions.lk",
        status: "Active",
        joinDate: "Jan 01, 2023",
        description: "Leading provider of digital government services and citizen engagement platforms."
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState(null);

    const handleEditClick = () => {
        setEditFormData({ ...provider });
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const baseUrl = getConfig().baseUrl;
            const token = localStorage.getItem('token');
            const response = await axios.post(`${baseUrl}/service-provider/edit`, {
                name: editFormData.name,
                email: editFormData.email,
                contact: editFormData.contact,
                address: editFormData.address,
                website: editFormData.website,
                joinDate: editFormData.joinDate,
                description: editFormData.description
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data && response.data.code === 0) {
                toast.success("Service Provider updated successfully");
                setProvider(editFormData);
                setIsEditing(false);
            } else {
                toast.error(response.data.message || "Failed to update profile");
            }
        } catch (error) {
            if (error?.response?.data?.data) {
                if (error?.response?.data?.code === 1) {
                    toast.info("Session expired. Please login again.");
                    navigate('/login');
                } else {
                    toast.error(error?.response?.data?.data);
                }
            } else {
                console.error("Error updating profile:", error);
                toast.error("Failed to update profile");
            }
        }
    };

    const [serviceCenters] = useState([
        {
            id: 101,
            name: "Head Office - Colombo",
            location: "Colombo 03",
            contact: "+94 11 234 5678",
            status: "Active",
            type: "Main Branch"
        },
        {
            id: 102,
            name: "Regional Center - Kandy",
            location: "Kandy City Center",
            contact: "+94 81 234 5678",
            status: "Active",
            type: "Regional Branch"
        },
        {
            id: 103,
            name: "Service Point - Galle",
            location: "Galle Fort",
            contact: "+94 91 234 5678",
            status: "Maintenance",
            type: "Service Point"
        }
    ]);

    const getStatusBadgeClass = (status) => {
        return status === 'Active' ? 'badge-pill badge-success' : 'badge-pill badge-warning';
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h3>Service Provider Profile</h3>
                    <p className="subtitle">Manage provider details and service centers</p>
                </div>
                <div className="header-actions">
                    <button className="primary-btn" onClick={handleEditClick}>
                        <Edit2 size={18} />
                        <span>Edit Profile</span>
                    </button>
                </div>
            </div>

            <div className="profile-layout" style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2.5fr', gap: '1.5rem' }}>

                {/* Left Column: Provider Identity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="content-card" style={{ padding: '0', overflow: 'hidden', textAlign: 'center' }}>
                        <div style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', height: '140px' }}></div>
                        <div style={{ marginTop: '-70px', padding: '0 1.5rem 2rem' }}>
                            <div style={{
                                width: '140px',
                                height: '140px',
                                borderRadius: '1rem',
                                border: '4px solid #1e293b',
                                background: '#1e293b',
                                margin: '0 auto 1rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '3.5rem',
                                fontWeight: 'bold',
                                color: 'white',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                            }}>
                                <Building size={64} />
                            </div>

                            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{provider.name}</h2>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <span className={getStatusBadgeClass(provider.status)}>{provider.status}</span>
                                <span className="badge-pill bg-dark-lighter text-muted">{provider.regNo}</span>
                            </div>

                            <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '1rem' }}>
                                <div className="detail-group">
                                    <label style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Contact Information</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                                            <Mail size={16} className="text-primary" />
                                            {provider.email}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                                            <Phone size={16} className="text-primary" />
                                            {provider.contact}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                                            <Globe size={16} className="text-primary" />
                                            {provider.website}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', fontSize: '0.95rem' }}>
                                            <MapPin size={16} className="text-primary" style={{ marginTop: '3px' }} />
                                            {provider.address}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Service Centers & Overview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Overview Card */}
                    <div className="content-card">
                        <h4 className="card-title">
                            <Shield className="text-primary" size={20} style={{ marginRight: '0.5rem' }} />
                            About Provider
                        </h4>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>{provider.description}</p>
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Centers</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{serviceCenters.length}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Active Since</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{provider.joinDate}</div>
                            </div>
                        </div>
                    </div>

                    {/* Service Centers Grid */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={20} className="text-success" />
                                Service Centers
                            </h4>
                            <button className="secondary-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                                <Filter size={14} />
                                <span>Filter</span>
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {serviceCenters.map(center => (
                                <div key={center.id} className="content-card" style={{
                                    borderLeft: `4px solid ${center.status === 'Active' ? '#10b981' : '#f59e0b'}`,
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                        <h5 style={{ margin: 0, fontSize: '1.1rem' }}>{center.name}</h5>
                                        <span className={getStatusBadgeClass(center.status)} style={{ fontSize: '0.75rem' }}>{center.status}</span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <MapPin size={14} className="text-muted" />
                                            {center.location}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Phone size={14} className="text-muted" />
                                            {center.contact}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Building size={14} className="text-muted" />
                                            {center.type}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Add New Placeholder */}
                            <div className="content-card" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px dashed #334155',
                                background: 'transparent',
                                minHeight: '160px',
                                cursor: 'pointer',
                                color: '#64748b',
                                transition: 'all 0.2s'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#3b82f6'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#64748b'; }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: '0.5rem'
                                }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>+</span>
                                </div>
                                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Add Service Center</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="modal-overlay" onClick={() => setIsEditing(false)}>
                    <div className="modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Provider Details</h3>
                            <button className="close-btn" onClick={() => setIsEditing(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="modal-body">
                                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                                    {/* Company Name */}
                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                        <Building className="input-icon" size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Company Name"
                                            value={editFormData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Reg No */}
                                    <div className="input-group">
                                        <Shield className="input-icon" size={18} />
                                        <input
                                            type="text"
                                            name="regNo"
                                            placeholder="Registration Number"
                                            value={editFormData.regNo}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="input-group">
                                        <Mail className="input-icon" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address"
                                            value={editFormData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Contact */}
                                    <div className="input-group">
                                        <Phone className="input-icon" size={18} />
                                        <input
                                            type="tel"
                                            name="contact"
                                            placeholder="Contact Number"
                                            value={editFormData.contact}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Website */}
                                    <div className="input-group">
                                        <Globe className="input-icon" size={18} />
                                        <input
                                            type="text"
                                            name="website"
                                            placeholder="Website URL"
                                            value={editFormData.website}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Address */}
                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                        <MapPin className="input-icon" size={18} />
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="Physical Address"
                                            value={editFormData.address}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                        <textarea
                                            name="description"
                                            placeholder="Description"
                                            value={editFormData.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '0.5rem',
                                                color: 'white',
                                                fontSize: '0.95rem',
                                                fontFamily: 'inherit',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" className="secondary-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                                <button type="submit" className="primary-btn">
                                    <Save size={18} />
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceProviderProfile;
