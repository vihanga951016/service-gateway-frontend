import React, { useState, useMemo } from 'react';
import { X, Activity, Building2, User, Search, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import '../App.css';

const ServicePointsModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Dummy data for Service Points
    const servicePoints = useMemo(() => [
        { id: 'SP-001', name: 'Counter 01', center: 'Colombo Main Center', assignedStaff: 2, status: 'Active', jobsAllocated: 12 },
        { id: 'SP-002', name: 'Counter 02', center: 'Colombo Main Center', assignedStaff: 1, status: 'Active', jobsAllocated: 5 },
        { id: 'SP-003', name: 'Express Lane', center: 'Colombo Main Center', assignedStaff: 3, status: 'Active', jobsAllocated: 24 },
        { id: 'SP-004', name: 'Inspection Bay A', center: 'North Branch', assignedStaff: 2, status: 'Active', jobsAllocated: 8 },
        { id: 'SP-005', name: 'Inspection Bay B', center: 'North Branch', assignedStaff: 0, status: 'Inactive', jobsAllocated: 0 },
        { id: 'SP-006', name: 'Wash Bay 1', center: 'East End Motors', assignedStaff: 4, status: 'Active', jobsAllocated: 15 },
        { id: 'SP-007', name: 'Detailing Hub', center: 'East End Motors', assignedStaff: 2, status: 'Active', jobsAllocated: 6 },
        { id: 'SP-008', name: 'Quick Lube', center: 'South Point Hub', assignedStaff: 1, status: 'Active', jobsAllocated: 10 },
        { id: 'SP-009', name: 'Heavy Repair', center: 'South Point Hub', assignedStaff: 0, status: 'Inactive', jobsAllocated: 0 },
        { id: 'SP-010', name: 'Counter 03', center: 'Downtown Center', assignedStaff: 2, status: 'Active', jobsAllocated: 14 },
        { id: 'SP-011', name: 'Diagnostic Bay', center: 'Westside Auto', assignedStaff: 1, status: 'Active', jobsAllocated: 4 },
        { id: 'SP-012', name: 'Counter 04 - VIP', center: 'Downtown Center', assignedStaff: 1, status: 'Inactive', jobsAllocated: 0 },
    ], []);

    // Filter service points based on search term
    const filteredPoints = useMemo(() => {
        return servicePoints.filter(point =>
            point.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            point.center.toLowerCase().includes(searchTerm.toLowerCase()) ||
            point.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [servicePoints, searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredPoints.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPoints = filteredPoints.slice(indexOfFirstItem, indexOfLastItem);

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

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Building2 size={24} style={{ color: 'var(--primary-color)' }} />
                        <h3>Service Points Details</h3>
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
                            placeholder="Search by ID, Name, Center, or Status..."
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

                    {/* Service Points List */}
                    <div className="hide-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
                        {currentPoints.length > 0 ? (
                            currentPoints.map((point, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    padding: '16px',
                                    background: 'rgba(148, 163, 184, 0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    borderLeft: point.status === 'Active' ? '4px solid #10b981' : '4px solid #ef4444',
                                    flexShrink: 0
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>{point.name}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--hover-bg)', padding: '2px 6px', borderRadius: '4px' }}>{point.id}</span>
                                        </div>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            background: point.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                            padding: '4px 10px', borderRadius: '12px',
                                            color: point.status === 'Active' ? '#10b981' : '#ef4444'
                                        }}>
                                            <Activity size={12} />
                                            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{point.status}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Building2 size={14} style={{ color: 'var(--text-secondary)' }} />
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{point.center}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <User size={14} style={{ color: 'var(--text-secondary)' }} />
                                            <span style={{ fontSize: '0.85rem', color: point.assignedStaff === 0 ? '#ef4444' : 'var(--text-primary)' }}>
                                                {point.assignedStaff} Staff Assigned
                                            </span>
                                        </div>
                                        {point.status === 'Active' && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Layers size={14} style={{ color: 'var(--text-secondary)' }} />
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                                    {point.jobsAllocated} Jobs Allocated
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                No service points found matching your search.
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPoints.length)} of {filteredPoints.length} points
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

export default ServicePointsModal;
