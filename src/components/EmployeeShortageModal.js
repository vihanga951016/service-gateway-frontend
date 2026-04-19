import React, { useState, useMemo } from 'react';
import { X, Search, ChevronLeft, ChevronRight, AlertCircle, Building2, Clock } from 'lucide-react';
import '../App.css';

const EmployeeShortageModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Dummy data for Employee Shortages
    const shortagesData = useMemo(() => [
        { id: 'SP-005', pointName: 'Inspection Bay B', center: 'North Branch', shortageCount: 2, pendingJobs: 8 },
        { id: 'SP-009', pointName: 'Heavy Repair', center: 'South Point Hub', shortageCount: 3, pendingJobs: 12 },
        { id: 'SP-012', pointName: 'Counter 04 - VIP', center: 'Downtown Center', shortageCount: 1, pendingJobs: 4 },
        { id: 'SP-008', pointName: 'Quick Lube', center: 'South Point Hub', shortageCount: 1, pendingJobs: 15 },
        { id: 'SP-002', pointName: 'Counter 02', center: 'Colombo Main Center', shortageCount: 2, pendingJobs: 9 },
        { id: 'SP-014', pointName: 'Detailing Hub B', center: 'East End Motors', shortageCount: 1, pendingJobs: 5 },
        { id: 'SP-016', pointName: 'Express Wash', center: 'Westside Auto', shortageCount: 4, pendingJobs: 22 },
        { id: 'SP-018', pointName: 'Tire Center', center: 'North Branch', shortageCount: 1, pendingJobs: 6 }
    ], []);

    // Filter shortages based on search term
    const filteredShortages = useMemo(() => {
        return shortagesData.filter(item =>
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.pointName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.center.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [shortagesData, searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredShortages.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentShortages = filteredShortages.slice(indexOfFirstItem, indexOfLastItem);

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
                        <AlertCircle size={24} style={{ color: '#ef4444' }} />
                        <h3>Employee Shortages</h3>
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
                            placeholder="Search by ID, Point Name, or Center..."
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

                    {/* Shortages List */}
                    <div className="hide-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
                        {currentShortages.length > 0 ? (
                            currentShortages.map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    padding: '16px',
                                    background: 'rgba(239, 68, 68, 0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    borderLeft: '4px solid #ef4444',
                                    flexShrink: 0
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>{item.pointName}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--hover-bg)', padding: '2px 6px', borderRadius: '4px' }}>{item.id}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Building2 size={12} style={{ color: 'var(--text-secondary)' }} />
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.center}</span>
                                            </div>
                                        </div>

                                        {/* <div style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            background: 'rgba(239, 68, 68, 0.15)',
                                            padding: '4px 10px', borderRadius: '12px',
                                            color: '#ef4444'
                                        }}>
                                            <AlertCircle size={14} />
                                            <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Shortage: {item.shortageCount}</span>
                                        </div> */}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', background: 'var(--bg-card)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <Clock size={16} style={{ color: '#f59e0b' }} />
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                            <span style={{ fontWeight: '600', color: '#f59e0b' }}>{item.pendingJobs}</span> jobs currently pending assignment
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                No shortages found matching your search.
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredShortages.length)} of {filteredShortages.length} locations
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

export default EmployeeShortageModal;
