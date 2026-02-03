import React, { useState, useEffect, useRef } from 'react';
import { X, Search, UserPlus, Loader2, User, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { getNonAssignedUsers, assignUserToCenter } from '../services/serviceProviderService';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const AssignUserModal = ({ isOpen, onClose, centerId, onSave }) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const dropdownRef = useRef(null);

    const fetchInitiated = useRef(false);
    useEffect(() => {
        if (isOpen && centerId && !fetchInitiated.current) {
            fetchNonAssignedUsers();
            fetchInitiated.current = true;
        }
        if (!isOpen) {
            setSearchTerm('');
            setIsDropdownOpen(false);
            setSelectedUser(null);
            fetchInitiated.current = false;
        }
    }, [isOpen, centerId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchNonAssignedUsers = async () => {
        setLoading(true);
        try {
            const data = await getNonAssignedUsers(centerId);
            setUsers(data || []);
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
            setLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedUser) {
            toast.error('Please select a user first');
            return;
        }

        setAssigning(true);
        try {
            await assignUserToCenter(centerId, selectedUser.id);
            toast.success('User assigned successfully');
            onSave(); // Refresh list in parent
            onClose(); // Close modal after successful assignment
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
            setAssigning(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectUser = (user) => {
        setSelectedUser(user);
        setSearchTerm(user.name);
        setIsDropdownOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="icon-circle" style={{ background: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                            <UserPlus size={20} />
                        </div>
                        <h3>Assign Employee</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Search and select an employee to assign to this service center.
                    </p>

                    <div className="form-group">
                        <label className="form-label">Select Employee</label>
                        <div className="custom-dropdown" ref={dropdownRef}>
                            <div
                                className="dropdown-input-wrapper"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                style={{
                                    border: isDropdownOpen ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                                    boxShadow: isDropdownOpen ? '0 0 0 3px var(--primary-light)' : 'none'
                                }}
                            >
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search by name"
                                    className="dropdown-search-input"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setIsDropdownOpen(true);
                                        if (selectedUser && e.target.value !== selectedUser.name) {
                                            setSelectedUser(null);
                                        }
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                />
                                <button className="dropdown-toggle-btn">
                                    {isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                            </div>

                            {isDropdownOpen && (
                                <div className="dropdown-options-list" style={{ maxHeight: '250px' }}>
                                    {loading ? (
                                        <div className="no-options">
                                            <Loader2 className="animate-spin" size={16} />
                                            <span>Loading users...</span>
                                        </div>
                                    ) : filteredUsers.length > 0 ? (
                                        filteredUsers.map(user => {
                                            const isSelected = selectedUser?.id === user.id;
                                            return (
                                                <div
                                                    key={user.id}
                                                    className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => selectUser(user)}
                                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                >
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: '500' }}>{user.name}</span>
                                                    </div>
                                                    {isSelected && <Check size={16} className="text-primary" />}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="no-options">No users found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="modal-footer" style={{ marginBottom: '1.5rem', marginRight: '1.5rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" className="secondary-btn" onClick={onClose} disabled={assigning}>Cancel</button>
                    <button
                        type="button"
                        className="primary-btn"
                        onClick={handleAssign}
                        disabled={assigning || !selectedUser}
                        style={{ minWidth: '120px' }}
                    >
                        {assigning ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                <span>Assigning...</span>
                            </>
                        ) : (
                            'Assign User'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignUserModal;
