import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ClipboardList, Clock, CheckCircle2, AlertCircle, Eye, MoreVertical, Plus, Building } from 'lucide-react';
import { getServiceCenterDropdown } from '../services/serviceProviderService';
import CreateJobModal from '../components/CreateJobModal';
import '../App.css';
import { toast } from 'react-toastify';

const Jobs = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCenter, setSelectedCenter] = useState('');
    const [centers, setCenters] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [jobsList, setJobsList] = useState([]);

    React.useEffect(() => {
        const fetchCenters = async () => {
            try {
                const data = await getServiceCenterDropdown();
                setCenters(data || []);
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

    const dummyJobs = [
        {
            id: "JOB-001",
            customerName: "John Doe",
            serviceName: "Standard Repair",
            pointName: "Counter 01",
            centerName: "Colombo Main Center",
            status: "In Progress",
            totalAmount: 4500.00,
            paidAmount: 2000.00,
            serviceTime: "45 mins",
            createdAt: "2026-02-05 10:30 AM"
        },
        {
            id: "JOB-002",
            customerName: "Alice Smith",
            serviceName: "Premium Inspection",
            pointName: "Counter 02",
            centerName: "Colombo Main Center",
            status: "Completed",
            totalAmount: 12500.00,
            paidAmount: 12500.00,
            serviceTime: "1h 30m",
            createdAt: "2026-02-05 09:15 AM"
        },
        {
            id: "JOB-003",
            customerName: "Bob Wilson",
            serviceName: "Oil Change",
            pointName: "Counter 03",
            centerName: "Kandy Branch",
            status: "Pending",
            totalAmount: 8500.00,
            paidAmount: 0.00,
            serviceTime: "30 mins",
            createdAt: "2026-02-05 11:00 AM"
        },
        {
            id: "JOB-004",
            customerName: "Emma Davis",
            serviceName: "Full Diagnostics",
            pointName: "Self-Service Kiosk",
            centerName: "Galle Center",
            status: "In Progress",
            totalAmount: 15000.00,
            paidAmount: 5000.00,
            serviceTime: "2h 15m",
            createdAt: "2026-02-05 10:45 AM"
        },
        {
            id: "JOB-005",
            customerName: "Michael Brown",
            serviceName: "Wheel Alignment",
            pointName: "Counter 01",
            centerName: "Colombo Main Center",
            status: "Cancelled",
            totalAmount: 4500.00,
            paidAmount: 0.00,
            serviceTime: "40 mins",
            createdAt: "2026-02-04 04:30 PM"
        },
        {
            id: "JOB-006",
            customerName: "Michael Brown",
            serviceName: "Wheel Alignment",
            pointName: "Counter 01",
            centerName: "Colombo Main Center",
            status: "Cancelled",
            totalAmount: 4500.00,
            paidAmount: 0.00,
            serviceTime: "40 mins",
            createdAt: "2026-02-04 04:30 PM"
        }
    ];

    React.useEffect(() => {
        setJobsList(dummyJobs);
    }, []);

    const servicePoints = [
        { id: 'sp1', name: 'Counter 01', type: 'Physical Counter' },
        { id: 'sp2', name: 'Counter 02', type: 'Physical Counter' },
        { id: 'sp3', name: 'Counter 03', type: 'Physical Counter' },
        { id: 'sp4', name: 'Self-Service Kiosk', type: 'Digital Kiosk' },
    ];

    const handleJobCreated = (newJob) => {
        setJobsList([newJob, ...jobsList]);
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
        switch (status) {
            case 'Completed': return <CheckCircle2 size={12} />;
            case 'In Progress': return <Clock size={12} />;
            case 'Pending': return <AlertCircle size={12} />;
            case 'Cancelled': return <AlertCircle size={12} />;
            default: return null;
        }
    };

    const filteredJobs = jobsList.filter(job => {
        const matchesSearch = job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCenter = selectedCenter === '' || job.centerName === selectedCenter;

        return matchesSearch && matchesCenter;
    });

    const location = useLocation();
    const selectedJobId = location.state?.selectedJobId;

    const getJobsForPoint = (pointName) => {
        return filteredJobs.filter(job => job.pointName === pointName);
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
                <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="search-bar" style={{ position: 'relative', width: '350px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                placeholder="Search by ID, customer, service..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="form-control"
                                style={{ paddingLeft: '40px', width: '100%' }}
                            />
                        </div>
                        <div className="center-filter" style={{ position: 'relative', width: '250px' }}>
                            <Building size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <select
                                value={selectedCenter}
                                onChange={(e) => setSelectedCenter(e.target.value)}
                                className="form-control"
                                style={{ paddingLeft: '40px', width: '100%', appearance: 'none', background: 'transparent' }}
                            >
                                <option value="">All Service Centers</option>
                                {centers.map(center => (
                                    <option key={center.id} value={center.name}>{center.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="kanban-board">
                    {servicePoints.map(point => {
                        const pointJobs = getJobsForPoint(point.name);
                        return (
                            <div key={point.id} className="kanban-column">
                                <div className="kanban-column-header">
                                    <div className="kanban-column-title">
                                        <Building size={16} className="kanban-column-icon" />
                                        <span>{point.name}</span>
                                    </div>
                                    <span className="kanban-column-count">{pointJobs.length}</span>
                                </div>
                                <div className="kanban-cards-container">
                                    {pointJobs.length > 0 ? (
                                        pointJobs.map(job => (
                                            <div
                                                key={job.id}
                                                className={`kanban-card ${selectedJobId === job.id ? 'selected' : ''}`}
                                                onClick={() => navigate(`/jobs/${job.id}`)}
                                            >
                                                <span className="kanban-card-id">{job.id}</span>
                                                <span className="kanban-card-customer">{job.customerName}</span>
                                                <span className="kanban-card-service">{job.serviceName}</span>
                                                <div className="kanban-card-footer">
                                                    <div className="kanban-card-time">
                                                        <Clock size={14} />
                                                        <span>{job.serviceTime}</span>
                                                    </div>
                                                    <div className="kanban-card-status" style={getStatusStyle(job.status)}>
                                                        {getStatusIcon(job.status)}
                                                        <span>{job.status}</span>
                                                    </div>
                                                </div>
                                            </div>
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
                    })}
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
