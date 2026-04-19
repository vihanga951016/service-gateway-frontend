import React, { useState, useMemo } from 'react';
import { X, Building2, Search, ChevronLeft, ChevronRight, Layers, Clock, Play, CheckCircle, PieChart } from 'lucide-react';
import '../App.css';

const JobsAllocatedModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Dummy data for Jobs Allocated per Service Point
    const allocatedJobsData = useMemo(() => [
        { id: 'SP-001', name: 'Counter 01', center: 'Colombo Main Center', total: 12, pending: 4, serving: 2, completed: 6, completionIndex: '50%' },
        { id: 'SP-002', name: 'Counter 02', center: 'Colombo Main Center', total: 5, pending: 1, serving: 1, completed: 3, completionIndex: '60%' },
        { id: 'SP-003', name: 'Express Lane', center: 'Colombo Main Center', total: 24, pending: 10, serving: 4, completed: 10, completionIndex: '42%' },
        { id: 'SP-004', name: 'Inspection Bay A', center: 'North Branch', total: 8, pending: 2, serving: 1, completed: 5, completionIndex: '63%' },
        { id: 'SP-005', name: 'Inspection Bay B', center: 'North Branch', total: 0, pending: 0, serving: 0, completed: 0, completionIndex: 'N/A' },
        { id: 'SP-006', name: 'Wash Bay 1', center: 'East End Motors', total: 15, pending: 5, serving: 3, completed: 7, completionIndex: '47%' },
        { id: 'SP-007', name: 'Detailing Hub', center: 'East End Motors', total: 6, pending: 1, serving: 2, completed: 3, completionIndex: '50%' },
        { id: 'SP-008', name: 'Quick Lube', center: 'South Point Hub', total: 10, pending: 3, serving: 2, completed: 5, completionIndex: '50%' },
        { id: 'SP-009', name: 'Heavy Repair', center: 'South Point Hub', total: 0, pending: 0, serving: 0, completed: 0, completionIndex: 'N/A' },
        { id: 'SP-010', name: 'Counter 03', center: 'Downtown Center', total: 14, pending: 6, serving: 1, completed: 7, completionIndex: '50%' },
        { id: 'SP-011', name: 'Diagnostic Bay', center: 'Westside Auto', total: 4, pending: 1, serving: 1, completed: 2, completionIndex: '50%' },
        { id: 'SP-012', name: 'Counter 04 - VIP', center: 'Downtown Center', total: 0, pending: 0, serving: 0, completed: 0, completionIndex: 'N/A' },
    ], []);

    // Filter service points based on search term
    const filteredPoints = useMemo(() => {
        return allocatedJobsData.filter(point =>
            point.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            point.center.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allocatedJobsData, searchTerm]);

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
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', width: '90%', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Layers size={24} style={{ color: '#3b82f6' }} />
                        <h3>Jobs Allocated</h3>
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
                            placeholder="Search by ID, Name, or Center..."
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

                    {/* Allocated Jobs List */}
                    <div className="hide-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
                        {currentPoints.length > 0 ? (
                            currentPoints.map((point, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    padding: '16px',
                                    background: 'rgba(59, 130, 246, 0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    borderLeft: '4px solid #3b82f6',
                                    flexShrink: 0
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>{point.name}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--hover-bg)', padding: '2px 6px', borderRadius: '4px' }}>{point.id}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Building2 size={12} style={{ color: 'var(--text-secondary)' }} />
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{point.center}</span>
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            background: 'rgba(59, 130, 246, 0.15)',
                                            padding: '4px 10px', borderRadius: '12px',
                                            color: '#3b82f6'
                                        }}>
                                            <Layers size={14} />
                                            <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{point.total} Total</span>
                                        </div>
                                    </div>

                                    {/* Breakdown Grid */}
                                    {point.total > 0 && (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(4, 1fr)',
                                            gap: '8px',
                                            background: 'var(--hover-bg)',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            marginTop: '4px'
                                        }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                                                    <Clock size={12} style={{ color: '#f59e0b' }} />
                                                    <span style={{ fontSize: '0.75rem' }}>Pending</span>
                                                </div>
                                                <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{point.pending}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                                                    <Play size={12} style={{ color: '#3b82f6' }} />
                                                    <span style={{ fontSize: '0.75rem' }}>Serving</span>
                                                </div>
                                                <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{point.serving}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                                                    <CheckCircle size={12} style={{ color: '#10b981' }} />
                                                    <span style={{ fontSize: '0.75rem' }}>Done</span>
                                                </div>
                                                <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{point.completed}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                                                    <PieChart size={12} style={{ color: '#8b5cf6' }} />
                                                    <span style={{ fontSize: '0.75rem' }}>Index</span>
                                                </div>
                                                <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{point.completionIndex}</span>
                                            </div>
                                        </div>
                                    )}
                                    {point.total === 0 && (
                                        <div style={{
                                            padding: '12px',
                                            background: 'var(--hover-bg)',
                                            borderRadius: '8px',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.85rem',
                                            marginTop: '4px'
                                        }}>
                                            No jobs currently allocated to this point.
                                        </div>
                                    )}
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

export default JobsAllocatedModal;
