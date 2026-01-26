import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Search, ChevronDown, ChevronUp } from 'lucide-react';
import '../App.css';

const PERMISSIONS_LIST = [
    'All Access', 'Manage Users', 'View Users', 'Create Users', 'Edit Users', 'Delete Users',
    'Manage Roles', 'View Roles', 'Create Roles', 'Edit Roles', 'Delete Roles',
    'Manage Service Centers', 'View Service Centers', 'Create Service Centers', 'Edit Service Centers',
    'View Dashboard', 'View Reports', 'System Settings', 'View Logs', 'Approve Requests',
    'View Tasks', 'Update Status', 'View Inventory', 'Search Knowledge Base'
];

const AddRoleModal = ({ isOpen, onClose }) => {
    const [roleName, setRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setRoleName('');
            setSelectedPermissions([]);
            setSearchTerm('');
            setIsDropdownOpen(false);
        }
    }, [isOpen]);

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

    const filteredPermissions = PERMISSIONS_LIST.filter(perm =>
        perm.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Add New Role</h3>
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
                                    {filteredPermissions.length > 0 ? (
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
                        <button className="secondary-btn" onClick={onClose}>Cancel</button>
                        <button className="primary-btn" onClick={onClose}>Create Role</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRoleModal;
