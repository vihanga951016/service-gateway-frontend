import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Clock, MapPin, User, Settings, Search, ChevronLeft, ChevronRight, Play, CheckCircle, Briefcase } from 'lucide-react';
import '../App.css';

const StatusJobsModal = ({ isOpen, onClose, selectedJobId, status = 'Pending' }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Helper to get status-specific config
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Serving':
                return {
                    icon: Play,
                    color: '#3b82f6',
                    bgColor: 'rgba(59, 130, 246, 0.15)',
                    title: 'Serving Jobs',
                    timeLabel: 'Duration'
                };
            case 'Completed':
                return {
                    icon: CheckCircle,
                    color: '#10b981',
                    bgColor: 'rgba(16, 185, 129, 0.15)',
                    title: 'Completed Jobs',
                    timeLabel: 'Finished'
                };
            case 'Pending':
            case 'Total':
            default:
                return {
                    icon: Briefcase,
                    color: '#3b82f6',
                    bgColor: 'rgba(59, 130, 246, 0.15)',
                    title: status === 'Total' ? 'All Branch Jobs' : 'Pending Jobs',
                    timeLabel: 'Wait'
                };
        }
    };

    const config = getStatusConfig(status);

    // Expanded dummy data 
    const jobsData = useMemo(() => {
        if (status === 'Serving') {
            return [
                { id: 'JOB-2026-101', service: 'Full Service', center: 'Main Hub', assignedTo: 'John Doe', waitingTime: 'Started 10m ago' },
                { id: 'JOB-2026-102', service: 'Tire Change', center: 'Westside', assignedTo: 'Mike Smith', waitingTime: 'Started 5m ago' },
                { id: 'JOB-2026-103', service: 'Car Wash', center: 'East Branch', assignedTo: 'Sarah Lee', waitingTime: 'Started 20m ago' },
            ];
        } else if (status === 'Completed') {
            return [
                { id: 'JOB-2026-201', service: 'Oil Change', center: 'North Center', assignedTo: 'Alex J', waitingTime: 'Today, 10:30 AM' },
                { id: 'JOB-2026-202', service: 'Brake Fix', center: 'South Hub', assignedTo: 'David B', waitingTime: 'Today, 09:15 AM' },
                { id: 'JOB-2026-203', service: 'Battery', center: 'Downtown', assignedTo: 'Emma D', waitingTime: 'Yesterday, 4:00 PM' },
                { id: 'JOB-2026-204', service: 'Alignment', center: 'Main Hub', assignedTo: 'Chris W', waitingTime: 'Yesterday, 2:30 PM' },
                { id: 'JOB-2026-205', service: 'Detailing', center: 'Westside', assignedTo: 'Sarah Lee', waitingTime: 'Yesterday, 1:00 PM' },
                { id: 'JOB-2026-206', service: 'Inspection', center: 'East Branch', assignedTo: 'Mike Smith', waitingTime: 'Yesterday, 11:45 AM' },
            ];
        }

        // Default Pending
        return [
            { id: 'JOB-2026-001', service: 'Oil Change', center: 'Downtown Center', assignedTo: 'John Doe', waitingTime: '45 mins' },
            { id: 'JOB-2026-002', service: 'Brake Service', center: 'North Branch', assignedTo: 'Unassigned', waitingTime: '1.5 hrs' },
            { id: 'JOB-2026-003', service: 'Tire Rotation', center: 'Westside Auto', assignedTo: 'Mike Smith', waitingTime: '2 hrs' },
            { id: 'JOB-2026-004', service: 'Engine Diagnostic', center: 'South Point Hub', assignedTo: 'Sarah Lee', waitingTime: '30 mins' },
            { id: 'JOB-2026-005', service: 'Body Wash', center: 'East End Motors', assignedTo: 'Unassigned', waitingTime: '1 hr' },
            { id: 'JOB-2026-006', service: 'Battery Replacement', center: 'Downtown Center', assignedTo: 'Alex Johnson', waitingTime: '20 mins' },
            { id: 'JOB-2026-007', service: 'Wheel Alignment', center: 'North Branch', assignedTo: 'Chris Williams', waitingTime: '1 hr' },
            { id: 'JOB-2026-008', service: 'Oil Change', center: 'Westside Auto', assignedTo: 'Unassigned', waitingTime: '10 mins' },
            { id: 'JOB-2026-009', service: 'Transmission Flush', center: 'South Point Hub', assignedTo: 'David Brown', waitingTime: '3 hrs' },
            { id: 'JOB-2026-010', service: 'Brake Service', center: 'East End Motors', assignedTo: 'Emma Davis', waitingTime: '45 mins' },
            { id: 'JOB-2026-011', service: 'Tire Rotation', center: 'Downtown Center', assignedTo: 'Unassigned', waitingTime: '1.5 hrs' },
            { id: 'JOB-2026-012', service: 'Engine Diagnostic', center: 'North Branch', assignedTo: 'Frank Miller', waitingTime: '2.5 hrs' },
        ];
    }, [status]);

    // Filter jobs based on search term
    const filteredJobs = useMemo(() => {
        return jobsData.filter(job =>
            job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.center.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [jobsData, searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

    // Reset pagination when search changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Reset state when modal closes
    React.useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setCurrentPage(1);
        } else if (selectedJobId && searchTerm === '') {
            const index = jobsData.findIndex(job => job.id === selectedJobId);
            if (index !== -1) {
                const page = Math.floor(index / itemsPerPage) + 1;
                setCurrentPage(page);
            }
        }
    }, [isOpen, selectedJobId, jobsData, itemsPerPage, searchTerm]);

    const handleJobClick = (jobId) => {
        navigate(`/jobs/${jobId}`, { state: { fromStatusModal: true, returnStatus: status } });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <style>
                {`
                .job-item-hover {
                    transition: background-color 0.2s;
                    cursor: pointer;
                }
                .job-item-hover:hover {
                    background-color: rgba(148, 163, 184, 0.1) !important;
                }
                `}
            </style>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <config.icon size={24} style={{ color: config.color }} />
                        <h3>{config.title}</h3>
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
                            placeholder="Search by Job ID, Service, or Center..."
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

                    {/* Jobs List */}
                    <div className="hide-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
                        {currentJobs.length > 0 ? (
                            currentJobs.map((job, index) => (
                                <div key={index}
                                    className="job-item-hover"
                                    onClick={() => handleJobClick(job.id)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px',
                                        padding: '16px',
                                        background: job.id === selectedJobId ? 'rgba(59, 130, 246, 0.08)' : 'rgba(148, 163, 184, 0.05)',
                                        borderRadius: '12px',
                                        border: job.id === selectedJobId ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                                        borderLeft: job.id === selectedJobId ? `4px solid var(--primary-color)` : `4px solid ${config.color}`,
                                        flexShrink: 0,
                                        boxShadow: job.id === selectedJobId ? '0 0 0 1px var(--primary-color)' : 'none'
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>{job.id}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: config.bgColor, padding: '4px 10px', borderRadius: '12px', color: config.color }}>
                                            <config.icon size={12} />
                                            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{config.timeLabel}: {job.waitingTime}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Settings size={14} style={{ color: 'var(--text-secondary)' }} />
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{job.service}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <MapPin size={14} style={{ color: 'var(--text-secondary)' }} />
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{job.center}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <User size={14} style={{ color: 'var(--text-secondary)' }} />
                                            <span style={{ fontSize: '0.85rem', color: job.assignedTo === 'Unassigned' ? '#ef4444' : 'var(--text-primary)' }}>{job.assignedTo}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                No jobs found matching your search.
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredJobs.length)} of {filteredJobs.length} jobs
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

export default StatusJobsModal;

