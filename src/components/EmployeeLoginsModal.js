import React, { useState, useMemo } from 'react';
import { X, Search, ChevronLeft, ChevronRight, User, UserCheck, UserX, CalendarDays, Briefcase, Mail } from 'lucide-react';
import '../App.css';

const EmployeeLoginsModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Dummy data for Employee Logins
    const employeesData = useMemo(() => [
        { id: 'EMP-001', name: 'John Doe', role: 'Senior Technician', email: 'john.d@example.com', status: 'Logged In', lastActive: 'Just now' },
        { id: 'EMP-002', name: 'Jane Smith', role: 'Service Advisor', email: 'jane.s@example.com', status: 'Logged In', lastActive: '5 mins ago' },
        { id: 'EMP-003', name: 'Mike Johnson', role: 'Mechanic', email: 'mike.j@example.com', status: 'Not Logged In', lastActive: 'Yesterday, 5:00 PM' },
        { id: 'EMP-004', name: 'Sarah Williams', role: 'Washer', email: 'sarah.w@example.com', status: 'Logged In', lastActive: '2 mins ago' },
        { id: 'EMP-005', name: 'David Brown', role: 'Mechanic', email: 'david.b@example.com', status: 'On Leave', lastActive: 'Oct 24, 2026' },
        { id: 'EMP-006', name: 'Emily Davis', role: 'Cashier', email: 'emily.d@example.com', status: 'Logged In', lastActive: '1 hr ago' },
        { id: 'EMP-007', name: 'Chris Wilson', role: 'Technician', email: 'chris.w@example.com', status: 'Not Logged In', lastActive: 'Today, 8:00 AM' },
        { id: 'EMP-008', name: 'Lisa Taylor', role: 'Service Advisor', email: 'lisa.t@example.com', status: 'Logged In', lastActive: '10 mins ago' },
        { id: 'EMP-009', name: 'Kevin Anderson', role: 'Manager', email: 'kevin.a@example.com', status: 'Logged In', lastActive: 'Just now' },
        { id: 'EMP-010', name: 'Amanda Thomas', role: 'Washer', email: 'amanda.t@example.com', status: 'On Leave', lastActive: 'Oct 20, 2026' },
        { id: 'EMP-011', name: 'Brian Jackson', role: 'Mechanic', email: 'brian.j@example.com', status: 'Not Logged In', lastActive: 'Yesterday, 6:00 PM' },
        { id: 'EMP-012', name: 'Rachel White', role: 'Technician', email: 'rachel.w@example.com', status: 'Logged In', lastActive: '15 mins ago' },
    ], []);

    // Filter employees based on search term
    const filteredEmployees = useMemo(() => {
        return employeesData.filter(emp =>
            emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [employeesData, searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

    // Reset state when search changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Reset state when modal closes
    React.useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setCurrentPage(1);
        }
    }, [isOpen]);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Logged In':
                return { icon: UserCheck, color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)' };
            case 'Not Logged In':
                return { icon: UserX, color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)' };
            case 'On Leave':
                return { icon: CalendarDays, color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)' };
            default:
                return { icon: User, color: 'var(--text-secondary)', bgColor: 'var(--hover-bg)' };
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <User size={24} style={{ color: '#10b981' }} />
                        <h3>Employee Status</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'hidden' }}>
                    {/* Search Bar */}
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search by ID, Name, Role, or Status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px 10px 38px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Employees List */}
                    <div className="hide-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
                        {currentEmployees.length > 0 ? (
                            currentEmployees.map((emp, index) => {
                                const config = getStatusConfig(emp.status);
                                return (
                                    <div key={index} style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px',
                                        padding: '16px',
                                        background: 'rgba(16, 185, 129, 0.05)',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border-color)',
                                        borderLeft: `4px solid ${config.color}`,
                                        flexShrink: 0
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>{emp.name}</span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--hover-bg)', padding: '2px 6px', borderRadius: '4px' }}>{emp.id}</span>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                background: config.bgColor,
                                                padding: '4px 10px', borderRadius: '12px',
                                                color: config.color
                                            }}>
                                                <config.icon size={14} />
                                                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{emp.status}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Briefcase size={14} style={{ color: 'var(--text-secondary)' }} />
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{emp.role}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Mail size={14} style={{ color: 'var(--text-secondary)' }} />
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{emp.email}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    {emp.status === 'Logged In' ? 'Active: ' : 'Last seen: '} <span style={{ color: 'var(--text-primary)' }}>{emp.lastActive}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                No employees found matching your search.
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEmployees.length)} of {filteredEmployees.length} employees
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)',
                                        background: currentPage === 1 ? 'rgba(148, 163, 184, 0.1)' : 'var(--bg-card)',
                                        color: currentPage === 1 ? 'var(--text-secondary)' : 'var(--text-primary)',
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            style={{
                                                minWidth: '28px', height: '28px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                borderRadius: '6px', border: '1px solid var(--border-color)',
                                                background: currentPage === page ? 'var(--primary-color)' : 'var(--bg-card)',
                                                color: currentPage === page ? 'white' : 'var(--text-primary)',
                                                fontWeight: currentPage === page ? '600' : '400',
                                                fontSize: '0.85rem', cursor: 'pointer',
                                            }}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)',
                                        background: currentPage === totalPages ? 'rgba(148, 163, 184, 0.1)' : 'var(--bg-card)',
                                        color: currentPage === totalPages ? 'var(--text-secondary)' : 'var(--text-primary)',
                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeLoginsModal;
