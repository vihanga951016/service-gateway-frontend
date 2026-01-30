import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Search, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getConfig } from '../config';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const RoleModal = ({ isOpen, onClose, role, onSave }) => {
    const navigate = useNavigate();
    const [roleName, setRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [permissionsList, setPermissionsList] = useState([]);
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch permissions from API
    useEffect(() => {
        const fetchPermissions = async () => {
            if (isOpen) {
                setIsLoadingPermissions(true);
                try {
                    const baseUrl = getConfig().baseUrl;
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${baseUrl}/role/load-system-permissions`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.data && response.data.data) {
                        setPermissionsList(response.data.data);
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
                    setIsLoadingPermissions(false);
                }
            }
        };

        fetchPermissions();
    }, [isOpen]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            if (role) {
                setRoleName(role.name);
                setSelectedPermissions(role.permissions || []);
            } else {
                setRoleName('');
                setSelectedPermissions([]);
            }
            setSearchTerm('');
            setIsDropdownOpen(false);
        }
    }, [isOpen, role]);

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

    const togglePermission = (permission) => {
        if (selectedPermissions.includes(permission)) {
            setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
        } else {
            setSelectedPermissions([...selectedPermissions, permission]);
        }
    };

    const removePermission = (permission) => {
        setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
    };

    const handleSave = async () => {
        // Validation
        if (!roleName.trim()) {
            toast.error('Please enter a role name');
            return;
        }

        if (selectedPermissions.length === 0) {
            toast.error('Please select at least one permission');
            return;
        }

        setIsSaving(true);

        try {
            const baseUrl = getConfig().baseUrl;
            const token = localStorage.getItem('token');

            if (role) {
                // Edit mode - update existing role
                const response = await axios.post(
                    `${baseUrl}/role/update`,
                    {
                        roleId: role.id,
                        roleName: roleName,
                        permissions: selectedPermissions
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.data) {
                    toast.success('Role updated successfully');
                    onSave();
                } else {
                    setIsSaving(false);
                    return;
                }
            } else {
                // Add new role
                const response = await axios.post(
                    `${baseUrl}/role/add`,
                    {
                        roleName: roleName,
                        permissions: selectedPermissions
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.data) {
                    toast.success('Role added successfully');
                    onSave();
                } else {
                    toast.error(response.data?.message || 'Failed to add role');
                    setIsSaving(false);
                    return;
                }
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
            setIsSaving(false);
        }
    };

    const filteredPermissions = permissionsList.filter(perm =>
        perm.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{role ? 'Edit Role' : 'Add New Role'}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="form-group">
                        <label className="form-label">Role Name</label>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Enter role name"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Permissions</label>

                        {/* Selected Permissions Tags */}
                        <div className="selected-tags mb-2">
                            {selectedPermissions.map(perm => (
                                <span key={perm} className="tag-pill">
                                    {perm}
                                    <button onClick={() => removePermission(perm)} className="tag-remove">
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>

                        {/* Custom Searchable Dropdown */}
                        <div className="custom-dropdown" ref={dropdownRef}>
                            <div
                                className="dropdown-input-wrapper"
                                onClick={() => setIsDropdownOpen(true)}
                            >
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search permissions..."
                                    className="dropdown-search-input"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setIsDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                />
                                <button className="dropdown-toggle-btn">
                                    {isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                            </div>

                            {isDropdownOpen && (
                                <div className="dropdown-options-list">
                                    {isLoadingPermissions ? (
                                        <div className="no-options">Loading permissions...</div>
                                    ) : filteredPermissions.length > 0 ? (
                                        filteredPermissions.map(perm => {
                                            const isSelected = selectedPermissions.includes(perm);
                                            return (
                                                <div
                                                    key={perm}
                                                    className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => togglePermission(perm)}
                                                >
                                                    <span>{perm}</span>
                                                    {isSelected && <Check size={16} className="text-primary" />}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="no-options">No permissions found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="secondary-btn" onClick={onClose} disabled={isSaving}>Cancel</button>
                        <button className="primary-btn" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Saving...
                                </>
                            ) : (
                                role ? 'Save Changes' : 'Create Role'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleModal;
