import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getConfig } from '../config';
import RoleModal from '../components/RoleModal';
import ConfirmDialog from '../components/ConfirmDialog';
import '../App.css';

const Roles = () => {
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [roles, setRoles] = useState([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);

    // Fetch roles from API
    useEffect(() => {
        fetchRoles();
    }, []);

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
            console.error('Failed to load roles:', error);
            toast.error('Failed to load roles');
            setRoles([]);
        } finally {
            setIsLoadingRoles(false);
        }
    };

    const handleAddRole = () => {
        setEditingRole(null);
        setIsRoleModalOpen(true);
    };

    const handleEditRole = (role) => {
        setEditingRole(role);
        setIsRoleModalOpen(true);
    };

    const handleSaveRole = (roleData) => {
        // After saving, refresh the roles list
        fetchRoles();
        setIsRoleModalOpen(false);
    };

    const handleDeleteRole = async (roleId) => {
        // Show confirmation dialog
        setRoleToDelete(roleId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteRole = async () => {
        if (!roleToDelete) return;

        try {
            const baseUrl = getConfig().baseUrl;
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${baseUrl}/role/${roleToDelete}/delete`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data) {
                toast.success('Role deleted successfully');
                fetchRoles(); // Refresh the roles list
            } else {
                toast.error(response.data?.message || 'Failed to delete role');
            }
        } catch (error) {
            console.error('Failed to delete role:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete role';
            toast.error(errorMessage);
        } finally {
            setRoleToDelete(null);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h3>Roles Management</h3>
                    <p className="subtitle">Manage user roles and permissions</p>
                </div>
                <div className="header-actions">
                    <button className="primary-btn" onClick={handleAddRole}>
                        <Plus size={18} />
                        <span>Add Role</span>
                    </button>
                </div>
            </div>

            <RoleModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                role={editingRole}
                onSave={handleSaveRole}
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setRoleToDelete(null);
                }}
                onConfirm={confirmDeleteRole}
                title="Delete Role"
                message="Are you sure you want to delete this role? This action cannot be undone and will permanently remove the role and its permissions."
                confirmText="Delete"
                cancelText="Cancel"
            />

            <div className="content-card no-padding">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Role Name</th>
                            <th>Permissions</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingRoles ? (
                            <tr>
                                <td colSpan="3" className="text-center" style={{ padding: '2rem' }}>
                                    <div style={{ color: 'var(--text-secondary)' }}>Loading roles...</div>
                                </td>
                            </tr>
                        ) : roles.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="text-center" style={{ padding: '2rem' }}>
                                    <div style={{ color: 'var(--text-secondary)' }}>No roles found</div>
                                </td>
                            </tr>
                        ) : (
                            roles.map((role) => (
                                <tr key={role.id}>
                                    <td style={{ width: '25%' }}>
                                        <div className="role-cell">
                                            <Shield size={16} className="text-secondary" />
                                            <span className="font-medium">{role.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="permissions-list">
                                            {role.permissions.map((perm, index) => (
                                                <span key={index} className="badge-pill">{perm}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons justify-end">
                                            <button
                                                className="icon-action-btn"
                                                title="Edit"
                                                onClick={() => handleEditRole(role)}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="icon-action-btn text-danger"
                                                title="Delete"
                                                onClick={() => handleDeleteRole(role.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Roles;
