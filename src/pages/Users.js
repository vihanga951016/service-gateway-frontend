import React, { useState, useEffect } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, User, Phone, Mail, FileText, Briefcase, CheckCircle, Clock, Edit2, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getConfig } from '../config';
import ConfirmDialog from '../components/ConfirmDialog';
import InfoModal from '../components/InfoModal';
import UserModal from '../components/UserModal';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);

    const [specialSearchOne, setSpecialSearchOne] = useState('');
    const [specialSearchTwo, setSpecialSearchTwo] = useState('');
    const [searchFilter, setSearchFilter] = useState('none'); // 'none', 'nic', 'contact'

    // Deletion State
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Add User Modal State
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Info Modal State
    const [infoModal, setInfoModal] = useState({
        isOpen: false,
        title: '',
        content: ''
    });

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchQuery, searchFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const baseUrl = getConfig().baseUrl;
            const token = localStorage.getItem('token');

            const payload = {
                page: currentPage - 1, // API is 0-indexed
                size: usersPerPage,
                searchText: searchFilter === 'none' ? searchQuery : '',
                specialSearchOne: searchFilter === 'nic' ? searchQuery : '',
                specialSearchTwo: searchFilter === 'contact' ? searchQuery : '',
                sort: { direction: 'DESC', property: 'id' } // Default sort
            };

            const response = await axios.post(`${baseUrl}/user/get-all`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data && response.data.data) {
                // Handle response.data.data as either list or Page object
                if (Array.isArray(response.data.data)) {
                    setUsers(response.data.data);
                    // If backend doesn't return total count, we can't calculate pages accurately without it.
                    // For now, setting totalUsers to length logic or if response has a metadata field
                    console.log(response.data.totalCount || response.data.data.length);
                    setTotalUsers(response.data.totalCount || response.data.data.length);
                } else if (response.data.data.content) {
                    // If it follows Spring Page structure
                    setUsers(response.data.data.content);
                    setTotalUsers(response.data.data.totalElements);
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
            setLoading(false);
        }
    };

    // Pagination logic
    // Server-side pagination means 'users' is already the current page content
    const totalPages = Math.ceil(totalUsers / usersPerPage) || 1;

    const totPages = totalUsers / usersPerPage;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleSpecialSearchOne = (e) => {
        setSpecialSearchOne(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleSpecialSearchTwo = (e) => {
        setSpecialSearchTwo(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const getUserTypeBadgeClass = (type) => {
        switch (type?.toLowerCase()) {
            case 'admin': return 'badge-pill badge-primary'; // Adjust classes as needed based on App.css or expected styles
            case 'user': return 'badge-pill badge-info';
            case 'customer': return 'badge-pill badge-success';
            default: return 'badge-pill';
        }
    };

    // Action Handlers
    const handleAddUser = () => {
        setSelectedUser(null);
        setIsUserModalOpen(true);
    };

    const handleEditUser = (user) => {
        // Prepare user object for the modal
        // Depending on how roles are returned (object or name), we might need to handle it in the modal or here
        // The modal expects roleId in user.role.id or user.roleId
        setSelectedUser(user);
        setIsUserModalOpen(true);
    };

    const handleApproveUser = async (user) => {
        try {
            const baseUrl = getConfig().baseUrl;
            const token = localStorage.getItem('token');
            // Assuming approval endpoint or logic
            // For now just toast as placeholder logic wasn't fully detailed in provided snippet
            await axios.post(`${baseUrl}/user/approve/${user.id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success(`User ${user.name} approved successfully`);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to approve user');
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            const baseUrl = getConfig().baseUrl;
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${baseUrl}/user/${userToDelete.id}/delete`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data) {
                toast.success('User deleted successfully');
                fetchUsers();
            } else {
                toast.error(response.data?.message || 'Failed to delete user');
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
            setUserToDelete(null);
        }
    };

    const handleDecrypt = async (value) => {

        if (value === undefined) {
            setInfoModal({
                isOpen: true,
                title: 'Contact Information',
                content: "No contact information available"
            });
            return;
        }

        try {
            const payload = {
                key: value
            };

            const baseUrl = getConfig().baseUrl;
            const token = localStorage.getItem('token');
            const response = await axios.post(`${baseUrl}/user/decrypt`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data && response.data.data) {
                setInfoModal({
                    isOpen: true,
                    title: 'Contact Information',
                    content: response.data.data
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
        } finally {
            setUserToDelete(null);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h3>User Management</h3>
                    <p className="subtitle">Manage users of system and employees</p>
                </div>
                <div className="header-actions">
                    <button className="primary-btn" onClick={handleAddUser}>
                        <Plus size={18} />
                        <span>Add User</span>
                    </button>
                </div>
            </div>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setUserToDelete(null);
                }}
                onConfirm={confirmDeleteUser}
                title="Delete User"
                message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
            />

            <InfoModal
                isOpen={infoModal.isOpen}
                onClose={() => setInfoModal({ ...infoModal, isOpen: false })}
                title={infoModal.title}
                content={infoModal.content}
            />

            <UserModal
                isOpen={isUserModalOpen}
                onClose={() => {
                    setIsUserModalOpen(false);
                    setSelectedUser(null);
                }}
                onSave={fetchUsers}
                user={selectedUser}
            />

            <div className="content-card">
                {/* Search and Toolbar */}
                <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="search-bar" style={{ position: 'relative', width: '300px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                            <input
                                type="text"
                                placeholder={searchFilter === 'nic' ? "Search by NIC..." : searchFilter === 'contact' ? "Search by Contact..." : "Search users..."}
                                value={searchQuery}
                                onChange={handleSearch}
                                className="form-control"
                                style={{ paddingLeft: '35px', width: '100%' }}
                            />
                        </div>
                        <div className="search-filters" style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                className={`filter-btn ${searchFilter === 'none' ? 'active' : ''}`}
                                onClick={() => setSearchFilter('none')}
                            >
                                None
                            </button>
                            <button
                                className={`filter-btn ${searchFilter === 'nic' ? 'active' : ''}`}
                                onClick={() => setSearchFilter('nic')}
                            >
                                NIC
                            </button>
                            <button
                                className={`filter-btn ${searchFilter === 'contact' ? 'active' : ''}`}
                                onClick={() => setSearchFilter('contact')}
                            >
                                Contact
                            </button>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>NIC</th>
                                <th>User Type</th>
                                <th>Role</th>
                                <th>Service Center</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center" style={{ padding: '2rem' }}>
                                        <div style={{ color: 'var(--text-secondary)' }}>Loading users...</div>
                                    </td>
                                </tr>
                            ) : totalUsers === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center" style={{ padding: '2rem' }}>
                                        <div style={{ color: 'var(--text-secondary)' }}>No users found</div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={user.id || index}>
                                        <td>
                                            <div className="user-cell" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div className="avatar-placeholder" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <User size={16} className="text-secondary" />
                                                </div>
                                                <span className="font-medium">{user.name || `${user.firstName || ''} ${user.lastName || ''}`}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {/* <Mail size={14} className="text-muted" /> */}
                                                {user.email}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {/* <Phone size={14} className="text-muted" />
                                                {user.contact || user.mobile} */}
                                                {
                                                    user.mobile ? (
                                                        <button className='icon-action-btn text-success' onClick={() => handleDecrypt(user.mobile)}>View Contact</button>
                                                    ) : (
                                                        <span> -- </span>
                                                    )
                                                }
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {/* <FileText size={14} className="text-muted" /> */}
                                                {
                                                    user.nic ? (
                                                        <button className='icon-action-btn text-success' onClick={() => handleDecrypt(user.nic)}>View NIC</button>
                                                    ) : (
                                                        <span> -- </span>
                                                    )
                                                }
                                                {/* {user.nic} */}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={getUserTypeBadgeClass(user.userType)}>
                                                {user.userType}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {/* <Briefcase size={14} className="text-muted" /> */}
                                                {user.role?.name || user.role || '-'}
                                            </div>
                                        </td>
                                        <td>
                                            {user.serviceCenter ? (
                                                <div className="service-center-info">
                                                    <div className="font-medium">{user.serviceCenter.name || user.serviceCenter}</div>
                                                    <div className={`status-text ${user.isProviderApproved ? 'text-success' : 'text-warning'}`} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        {user.isProviderApproved ? (
                                                            <><CheckCircle size={10} /> Approved</>
                                                        ) : (
                                                            <><Clock size={10} /> Pending</>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-muted">-</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="action-buttons justify-end">
                                                {/* Approve Button - Only if not already approved or strictly for providers? Assuming logical check */}
                                                {!user.isProviderApproved && user.serviceCenter && (
                                                    <button
                                                        className="icon-action-btn text-success"
                                                        title="Approve"
                                                        onClick={() => handleApproveUser(user)}
                                                    >
                                                        <ShieldCheck size={16} />
                                                    </button>
                                                )}

                                                <button
                                                    className="icon-action-btn"
                                                    title="Edit"
                                                    onClick={() => handleEditUser(user)}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    className="icon-action-btn text-danger"
                                                    title="Delete"
                                                    onClick={() => handleDeleteClick(user)}
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

                {/* Pagination Controls */}
                {!loading && totalUsers > 0 && (
                    <div className="pagination-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', padding: '0.5rem' }}>
                        <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                            Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} entries
                        </div>
                        <div className="pagination-controls" style={{ display: 'flex', gap: '5px' }}>
                            <button
                                className="icon-btn"
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                style={{ padding: '0.5rem', borderRadius: '4px', background: currentPage === 1 ? '#f5f5f5' : 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {/* Simple Page Numbers */}
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    // onClick={() => paginate(i + 1)}
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px',
                                        background: '#007bff',
                                        color: currentPage === i + 1 ? 'white' : 'inherit',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {currentPage}
                                </button>
                            ))}

                            <button
                                className="icon-btn"
                                onClick={() => paginate(currentPage + 1)}
                                disabled={totPages < 1}
                                style={{ padding: '0.5rem', borderRadius: '4px', background: currentPage === totalPages ? '#f5f5f5' : 'white', cursor: totPages < 1 ? 'not-allowed' : 'pointer' }}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
