import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ClipboardList, Clock, CheckCircle2, AlertCircle, Eye, MoreVertical, Plus, Building, Calendar } from 'lucide-react';
import { getServiceCenterDropdown, getServicePointsByCenterId } from '../services/serviceProviderService';
import { getJobSchedule } from '../services/jobService';
import CreateJobModal from '../components/CreateJobModal';
import '../App.css';
import { toast } from 'react-toastify';

const Jobs = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCenter, setSelectedCenter] = useState(''); // Stores center ID
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [centers, setCenters] = useState([]);
    const [servicePoints, setServicePoints] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [jobsList, setJobsList] = useState([]);
    const [isLoadingPoints, setIsLoadingPoints] = useState(false);
    const [isLoadingJobs, setIsLoadingJobs] = useState(false);
    const [highlightedJobId, setHighlightedJobId] = useState(null);

    React.useEffect(() => {
        const fetchCenters = async () => {
            try {
                const data = await getServiceCenterDropdown();
                setCenters(data || []);
                if (data && data.length > 0) {
                    setSelectedCenter(data[0].id.toString());
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
            }
        };
        fetchCenters();
    }, []);

    const fetchJobSchedule = async () => {
        if (!selectedCenter || !selectedDate) {
            setJobsList([]);
            return;
        }
        setIsLoadingJobs(true);
        try {
            const data = await getJobSchedule(parseInt(selectedCenter), selectedDate);
            setJobsList(data || []);
        } catch (error) {
            console.error('Failed to fetch job schedule:', error);
            // toast.error('Failed to load jobs');
        } finally {
            setIsLoadingJobs(false);
        }
    };

    React.useEffect(() => {
        const fetchServicePoints = async () => {
            if (!selectedCenter) {
                setServicePoints([]);
                return;
            }
            setIsLoadingPoints(true);
            try {
                const data = await getServicePointsByCenterId(selectedCenter);
                setServicePoints(data || []);
            } catch (error) {
                console.error('Failed to fetch service points:', error);
                toast.error('Failed to load service points');
            } finally {
                setIsLoadingPoints(false);
            }
        };
        fetchServicePoints();
    }, [selectedCenter]);

    React.useEffect(() => {
        fetchJobSchedule();
    }, [selectedCenter, selectedDate]);



    const handleJobCreated = (newJob) => {
        setJobsList([newJob, ...jobsList]);
    };

    const handleHighlight = (e, jobId) => {
        e.stopPropagation();
        setHighlightedJobId(highlightedJobId === jobId ? null : jobId);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return { background: '#10b98115', color: '#10b981' };
            case 'In Progress': return { background: '#3b82f615', color: '#3b82f6' };
            case 'Pending': return { background: '#f59e0b15', color: '#f59e0b' };
            case 'Cancelled': return { background: '#ef444415', color: '#ef4444' };
            default: return { background: '#64748b15', color: '#64748b' };
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return <CheckCircle2 size={12} />;
            case 'serving': return <Clock size={12} />;
            case 'pending': return <AlertCircle size={12} />;
            default: return null;
        }
    };

    const filteredJobs = jobsList.filter(job => {
        if (job.freeSlot) return true;

        const matchesSearch = (job.id?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (job.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (job.serviceName || '').toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    const location = useLocation();
    const selectedJobId = location.state?.selectedJobId;

    const getJobsForPoint = (pointName) => {
        const pointJobs = filteredJobs.filter(job => job.pointName === pointName);
        if (pointJobs.length === 0) return [];

        const grouped = [];
        let currentGroup = null;

        pointJobs.forEach(job => {
            if (job.freeSlot) {
                if (currentGroup) {
                    grouped.push(currentGroup);
                    currentGroup = null;
                }
                grouped.push(job);
            } else {
                if (currentGroup && currentGroup.jobId === job.jobId) {
                    // Merge with current group
                    currentGroup.totalTime += job.totalTime;
                    // Combine time ranges (assuming they are sequential)
                    const [currentStart] = currentGroup.fromTo.split(' - ');
                    const [, nextEnd] = job.fromTo.split(' - ');
                    currentGroup.fromTo = `${currentStart} - ${nextEnd}`;
                } else {
                    if (currentGroup) {
                        grouped.push(currentGroup);
                    }
                    currentGroup = { ...job };
                }
            }
        });

        if (currentGroup) {
            grouped.push(currentGroup);
        }

        return grouped;
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h3>Jobs Management</h3>
                    <p className="subtitle">Track and manage all service requests</p>
                </div>
                <div className="header-actions">
                    <button className="primary-btn" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={18} />
                        <span>Create Job</span>
                    </button>
                </div>
            </div>

            <div className="content-card">
                <div className="table-toolbar">
                    <div className="toolbar-filters">
                        <div className="search-bar-wrapper">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by ID, customer, service..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="form-control search-input"
                            />
                        </div>
                        <div className="filter-select-wrapper center-filter">
                            <Building size={18} className="filter-icon" />
                            <select
                                value={selectedCenter}
                                onChange={(e) => setSelectedCenter(e.target.value)}
                                className="form-control filter-select"
                            >
                                {centers.map(center => (
                                    <option key={center.id} value={center.id}>{center.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-select-wrapper date-filter">
                            <Calendar size={18} className="filter-icon" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="form-control filter-date"
                            />
                        </div>
                    </div>
                </div>

                <div className="kanban-board">
                    {isLoadingPoints || isLoadingJobs ? (
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '3rem' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : servicePoints.length > 0 ? (
                        servicePoints.map(point => {
                            const pointJobs = getJobsForPoint(point.name);
                            return (
                                <div key={point.id} className="kanban-column">
                                    <div className="kanban-column-header">
                                        <div className="kanban-column-title">
                                            <Building size={16} className="kanban-column-icon" />
                                            <span>{point.name}</span>
                                        </div>
                                        <span className="kanban-column-count">{pointJobs.filter(job => !job.freeSlot).length}</span>
                                    </div>
                                    <div className="kanban-cards-container">
                                        {pointJobs.length > 0 ? (
                                            pointJobs.map(job => (
                                                job.freeSlot ? (
                                                    <>
                                                        {job.ignoreThis ? (
                                                            <div
                                                                key={`free-${job.fromTo}-${point.id}`}
                                                                className={`kanban-card kanban-card-ignore`}
                                                                style={{ height: job.totalTime <= 7 ? '7%' : `${job.totalTime}%` }}
                                                                aria-disabled="true"
                                                            >
                                                                <span className="kanban-card-service text-disabled">Slot Ignored</span>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                key={`free-${job.fromTo}-${point.id}`}
                                                                className={`kanban-card kanban-card-free`}
                                                                style={{ height: job.totalTime <= 6 ? '6%' : `${job.totalTime}%` }}
                                                            >
                                                                <span className="kanban-card-service">{job.fromTo}</span>
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div
                                                        key={job.id}
                                                        className={`kanban-card kanban-card-${job.status.toLowerCase()} ${selectedJobId === job.id ? 'selected' : ''} ${highlightedJobId === job.jobId ? 'highlighted' : ''}`}
                                                        onClick={() => navigate(`/jobs/${job.id}`)}
                                                        style={{ height: job.totalTime <= 8 ? '8%' : `${job.totalTime}%` }}
                                                    >
                                                        {job.totalTime < 10 ? (
                                                            <div className="kanban-card-inline">
                                                                <span
                                                                    className={`kanban-card-id-${job.status.toLowerCase()}`}
                                                                    onClick={(e) => handleHighlight(e, job.jobId)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    {getStatusIcon(job.status)} JOB - {job.jobId}
                                                                </span>
                                                                <span className="kanban-card-customer">
                                                                    {job.customerName}
                                                                </span>
                                                                <span className="kanban-card-service">
                                                                    {job.fromTo}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <span
                                                                    className={`kanban-card-id-${job.status.toLowerCase()}`}
                                                                    onClick={(e) => handleHighlight(e, job.jobId)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    {getStatusIcon(job.status)} JOB - {job.jobId}
                                                                </span>
                                                                <span className="kanban-card-customer">{job.customerName}</span>
                                                                <span className="kanban-card-service">{job.fromTo}</span>
                                                            </>
                                                        )}


                                                    </div>
                                                )
                                            ))
                                        ) : (
                                            <div className="empty-kanban">
                                                <ClipboardList size={24} opacity={0.5} />
                                                <span>No active jobs</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '5rem', gap: '1rem', color: 'var(--text-secondary)' }}>
                            <Building size={48} opacity={0.3} />
                            <p>No service points available for this center</p>
                        </div>
                    )}
                </div>
            </div>

            <CreateJobModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onJobCreated={handleJobCreated}
            />
        </div>
    );
};

export default Jobs;
