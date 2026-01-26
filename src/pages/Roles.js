import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Shield } from 'lucide-react';
import AddRoleModal from '../components/AddRoleModal';
import '../App.css';

const Roles = () => {
    const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);

    // Mock data for roles
    const [roles] = useState([
        {
            id: 1,
            name: 'Super Admin',
            permissions: ['All Access', 'Manage Users', 'System Settings', 'View Logs']
        },
        {
            id: 2,
            name: 'Service Center Manager',
            permissions: ['Manage Center', 'View Technicians', 'Approve Requests']
        },
        {
            id: 3,
            name: 'Technician',
            permissions: ['View Tasks', 'Update Status', 'View Inventory']
        },
        {
            id: 4,
            name: 'Customer Support',
            permissions: ['View Tickets', 'Reply to Users', 'Search Knowledge Base']
        },
        {
            id: 5,
            name: 'User',
            permissions: ['Create Request', 'View History', 'Edit Profile']
        },
    ]);

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h3>Roles Management</h3>
                    <p className="subtitle">Manage user roles and permissions</p>
                </div>
                <div className="header-actions">
                    <button className="primary-btn" onClick={() => setIsAddRoleOpen(true)}>
                        <Plus size={18} />
                        <span>Add Role</span>
                    </button>
                    <button className="secondary-btn">
                        <Plus size={18} />
                        <span>Add Temp Role</span>
                    </button>
                </div>
            </div>

            <AddRoleModal
                isOpen={isAddRoleOpen}
                onClose={() => setIsAddRoleOpen(false)}
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
                        {roles.map((role) => (
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
                                        <button className="icon-action-btn" title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="icon-action-btn text-danger" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Roles;
