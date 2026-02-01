import React, { useState, useEffect } from 'react';
import { Mail, Phone, FileText, Shield, MapPin, Edit2, Calendar, User, Camera, X, Save, Lock, Briefcase } from 'lucide-react';
import '../App.css';
import axios from 'axios';
import { getConfig } from '../config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();
    // Static data for design demonstration
    const [user, setUser] = useState({
        userId: 1,
        fname: "",
        lname: "",
        email: "",
        contact: "",
        nic: "",
        userType: "",
        role: "",
        roleId: null,
        serviceCenter: "",
        serviceCenterId: null,
        joinDate: "",
        avatarColor: ""
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const [roles, setRoles] = useState([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const baseUrl = getConfig().baseUrl;
            const token = localStorage.getItem('token');
            const response = await axios.get(`${baseUrl}/user/profile-details`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data && response.data.data) {
                const data = response.data.data;
                setUser({
                    userId: 0,
                    fname: data.fname,
                    lname: data.lname,
                    email: data.email,
                    contact: data.contact,
                    nic: data.nic,
                    userType: data.userType,
                    role: data.role,
                    roleId: null,
                    serviceCenter: data.serviceCenter,
                    serviceCenterId: null,
                    joinDate: data.joinedDate,
                    avatarColor: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                    imageUrl: data.imageUrl
                });
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
                toast.error('Network error');
            }
        }
    };

    useEffect(() => {
        if (isEditing) {
            fetchRoles();
            fetchUserProfileData();
        }
    }, [isEditing]);

    const fetchUserProfileData = async () => {
        try {
            const baseUrl = getConfig().baseUrl;
            const token = localStorage.getItem('token');
            const response = await axios.get(`${baseUrl}/user/profile-data`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data && response.data.data) {
                const userData = response.data.data;
                setEditFormData({
                    userId: userData.id,
                    firstName: userData.fname,
                    lastName: userData.lname,
                    email: userData.email,
                    contact: userData.mobile || userData.contact,
                    nic: userData.nic,
                    userType: userData.userType === 0 ? 'USER' : userData.userType === 1 ? 'ADMIN' : 'EMPLOYEE',
                    role: userData.role && userData.role.name ? userData.role.name : (userData.roleName || "No Role"),
                    roleId: userData.role && userData.role.id ? userData.role.id : (userData.roleId || ''),
                    serviceCenter: userData.serviceCenter && userData.serviceCenter.name ? userData.serviceCenter.name : (userData.serviceCenterName || "Head Office"),
                    serviceCenterId: userData.serviceCenter && userData.serviceCenter.id ? userData.serviceCenter.id : (userData.serviceCenterId || ''),
                    password: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            if (error?.response?.data?.data) {
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
            } else {
                toast.error('Network error');
            }
        }
    };

    const fetchRoles = async () => {
        setIsLoadingRoles(true);
        try {
            const baseUrl = getConfig().baseUrl;
            const token = localStorage.getItem('token');
            const response = await axios.get(`${baseUrl}/role/get-all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data && response.data.data) {
                setRoles(response.data.data);
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
                toast.error('Network error');
            }
        } finally {
            setIsLoadingRoles(false);
        }
    };

    const handleEditClick = () => {
        // Initialize with basic empty state or current view data while loading
        // Actual data will be fetched in useEffect
        setEditFormData({
            ...user,
            password: '',
            confirmPassword: ''
        });
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'roleId') {
            const roleId = parseInt(value);
            const selectedRole = roles.find(r => r.id === roleId);
            setEditFormData(prev => ({
                ...prev,
                roleId: roleId || '',
                role: selectedRole ? selectedRole.name : prev.role
            }));
        } else {
            setEditFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (editFormData.password && editFormData.password !== editFormData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const baseUrl = getConfig().baseUrl;
            const token = localStorage.getItem('token');
            const userTypeInt = editFormData.userType === 'ADMIN' ? 1
                : editFormData.userType === 'EMPLOYEE' ? 2
                    : 0;

            const payload = {
                fName: editFormData.firstName,
                lName: editFormData.lastName,
                email: editFormData.email,
                contact: editFormData.contact,
                nic: editFormData.nic,
                userType: userTypeInt,
                roleId: editFormData.roleId,
                serviceCenterId: editFormData.serviceCenterId,
                password: editFormData.password || undefined // Only send if set
            };

            await axios.post(`${baseUrl}/user/update-profile`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            toast.success("Profile updated successfully");
            setIsEditing(false);
            fetchUserProfile(); // Refresh the main profile view
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

    const getUserTypeBadgeClass = (type) => {
        const typeStr = type.toLowerCase();
        if (typeStr === 'admin') return 'badge-pill badge-primary';
        if (typeStr === 'user') return 'badge-pill badge-info';
        if (typeStr === 'employee') return 'badge-pill badge-success';
        return 'badge-pill';
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h3>User Profile</h3>
                    <p className="subtitle">View and manage your account details</p>
                </div>
                <div className="header-actions">
                    <button className="primary-btn" onClick={handleEditClick}>
                        <Edit2 size={18} />
                        <span>Edit Profile</span>
                    </button>
                </div>
            </div>

            <div className="profile-layout" style={{ maxWidth: '1800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>

                {/* Left Column: Identity Card */}
                <div className="content-card" style={{ padding: '0', overflow: 'hidden', textAlign: 'center' }}>
                    <div style={{ background: user.avatarColor, height: '120px', position: 'relative' }}>
                        {/* Cover area */}
                    </div>
                    <div style={{ marginTop: '-60px', padding: '0 1.5rem 2rem' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            border: '4px solid #1e293b', // Matching dark theme bg assumption
                            background: '#1e293b',
                            margin: '0 auto 1rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                background: user.avatarColor,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                fontSize: '3rem',
                                fontWeight: 'bold'
                            }}>
                                {user.fname[0]}{user.lname[0]}
                            </div>
                            <button style={{
                                position: 'absolute',
                                bottom: '0',
                                right: '0',
                                background: '#3b82f6',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                cursor: 'pointer'
                            }}>
                                <Camera size={16} />
                            </button>
                        </div>

                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{user.fname} {user.lname}</h2>
                        <span className={getUserTypeBadgeClass(user.userType)} style={{ marginBottom: '1rem', display: 'inline-block' }}>
                            {user.userType}
                        </span>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            color: '#94a3b8',
                            marginTop: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            <Calendar size={14} />
                            <span>Member since {user.joinDate}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="content-card">
                    <h4 style={{
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        paddingBottom: '1rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <User size={20} className="text-primary" />
                        Personal Information
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {user.email ? (
                            <div className="detail-group">
                                <label style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>
                                        <Mail size={18} />
                                    </div>
                                    {user.email}
                                </div>
                            </div>
                        ) : null}

                        {user.contact ? (
                            <div className="detail-group">
                                <label style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Phone Number</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>
                                        <Phone size={18} />
                                    </div>
                                    {user.contact}
                                </div>
                            </div>
                        ) : null}

                        {
                            user.nic ? (
                                <div className="detail-group">
                                    <label style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>National ID (NIC)</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                                        <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>
                                            <FileText size={18} />
                                        </div>
                                        {user.nic}
                                    </div>
                                </div>
                            ) : null
                        }

                        <div className="detail-group">
                            <label style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Service Information</label>
                            {user.role ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', marginBottom: '0.5rem' }}>
                                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
                                        <Shield size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{user.role}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Current Role</div>
                                    </div>
                                </div>
                            ) : null}
                            {user.serviceCenter ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', marginBottom: '0.5rem' }}>
                                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{user.serviceCenter}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Service Center</div>
                                    </div>
                                </div>
                            ) : null
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="modal-overlay" onClick={() => setIsEditing(false)}>
                    <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Profile</h3>
                            <button className="close-btn" onClick={() => setIsEditing(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="modal-body">
                                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    {/* First Name */}
                                    <div className="input-group">
                                        <User className="input-icon" size={18} />
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="First Name"
                                            value={editFormData.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div className="input-group">
                                        <User className="input-icon" size={18} />
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last Name"
                                            value={editFormData.lastName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
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
                                        />
                                    </div>

                                    {/* NIC */}
                                    <div className="input-group">
                                        <FileText className="input-icon" size={18} />
                                        <input
                                            type="text"
                                            name="nic"
                                            placeholder="NIC"
                                            value={editFormData.nic}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* User Type - Mocked Read Only or Select */}
                                    <div className="input-group">
                                        <Briefcase className="input-icon" size={18} />
                                        <select
                                            name="userType"
                                            value={editFormData.userType}
                                            onChange={handleInputChange}
                                            className="modal-select"
                                            style={{ width: '100%', paddingLeft: '2.5rem', height: '100%', border: 'none', color: 'inherit', background: 'transparent', outline: 'none', appearance: 'none', WebkitAppearance: 'none' }}
                                        >
                                            <option value="USER">User</option>
                                            <option value="ADMIN">Admin</option>
                                            <option value="EMPLOYEE">Employee</option>
                                        </select>
                                    </div>

                                    {/* Role */}
                                    <div className="input-group">
                                        <Shield className="input-icon" size={18} />
                                        {isLoadingRoles ? (
                                            <div style={{ padding: '0.8rem 0.8rem 0.8rem 2.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>Loading...</div>
                                        ) : (
                                            <select
                                                name="roleId"
                                                value={editFormData.roleId}
                                                onChange={handleInputChange}
                                                className="modal-select"
                                                required
                                                style={{ width: '100%', paddingLeft: '2.5rem', height: '100%', border: 'none', color: 'inherit', background: 'transparent', outline: 'none', appearance: 'none', WebkitAppearance: 'none' }}
                                            >
                                                <option value="">Select Role</option>
                                                {roles.map(role => (
                                                    <option key={role.id} value={role.id}>{role.name}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    {/* Service Center - Mocked Read Only */}
                                    <div className="input-group">
                                        <MapPin className="input-icon" size={18} />
                                        <input
                                            type="text"
                                            name="serviceCenter"
                                            value={editFormData.serviceCenter}
                                            disabled
                                            style={{ opacity: 0.7, cursor: 'not-allowed' }}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="input-group">
                                        <Lock className="input-icon" size={18} />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="New Password (Optional)"
                                            value={editFormData.password}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="input-group">
                                        <Lock className="input-icon" size={18} />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm New Password"
                                            value={editFormData.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" className="secondary-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                                <button type="submit" className="primary-btn">
                                    <Save size={18} />
                                    <span>Update Profile</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
