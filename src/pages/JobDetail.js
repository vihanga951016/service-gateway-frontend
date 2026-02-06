import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Calendar,
    Clock,
    User,
    MapPin,
    CheckCircle2,
    AlertCircle,
    DollarSign,
    Truck,
    Package,
    Settings,
    Clock4
} from 'lucide-react';
import '../App.css';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);

    // Dummy data for job details
    const dummyJobData = {
        "JOB-001": {
            id: "JOB-001",
            customerName: "John Doe",
            customerPhone: "+94 77 123 4567",
            customerEmail: "john.doe@example.com",
            serviceName: "Standard Repair",
            pointName: "Counter 01",
            centerName: "Colombo Main Center",
            status: "In Progress",
            totalAmount: 4500.00,
            paidAmount: 2000.00,
            serviceTime: "45 mins",
            createdAt: "2026-02-05 10:30 AM",
            appointmentMethod: "Mobile",
            description: "Engine diagnostic and minor oil leak repair. Parts requested from central warehouse.",
            timeline: [
                { status: "Pending", time: "2026-02-05 10:30 AM", description: "Job request received", completed: true },
                { status: "Confirmed", time: "2026-02-05 10:35 AM", description: "Service point assigned", completed: true },
                { status: "In Progress", time: "2026-02-05 10:45 AM", description: "Technician started diagnostic", completed: true },
                { status: "Completed", time: "-", description: "Awaiting final quality check", completed: false }
            ]
        },
        "JOB-002": {
            id: "JOB-002",
            customerName: "Alice Smith",
            customerPhone: "+94 77 987 6543",
            customerEmail: "alice.s@example.com",
            serviceName: "Premium Inspection",
            pointName: "Counter 02",
            centerName: "Colombo Main Center",
            status: "Completed",
            totalAmount: 12500.00,
            paidAmount: 12500.00,
            serviceTime: "1h 30m",
            createdAt: "2026-02-05 09:15 AM",
            appointmentMethod: "Walk-in",
            description: "Comprehensive 50-point safety inspection and performance tuning.",
            timeline: [
                { status: "Pending", time: "2026-02-05 09:15 AM", description: "Job booked via mobile app", completed: true },
                { status: "Confirmed", time: "2026-02-05 09:20 AM", description: "Booking confirmed", completed: true },
                { status: "In Progress", time: "2026-02-05 09:30 AM", description: "Inspection underway", completed: true },
                { status: "Completed", time: "2026-02-05 11:00 AM", description: "Inspection report generated and job closed", completed: true }
            ]
        }
    };

    useEffect(() => {
        // Fallback for cases where id doesn't match dummy data
        const currentJob = dummyJobData[id] || {
            ...dummyJobData["JOB-001"],
            id: id,
            customerName: "Unknown Customer",
            timeline: [
                { status: "Pending", time: "2026-02-05 12:00 PM", description: "Initial request", completed: true },
                { status: "In Progress", time: "-", description: "Processing", completed: false },
                { status: "Completed", time: "-", description: "Finish", completed: false }
            ]
        };
        setJob(currentJob);
    }, [id]);

    if (!job) return <div className="p-4">Loading job details...</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'var(--success-color)';
            case 'In Progress': return 'var(--primary-color)';
            case 'Pending': return 'var(--warning-color)';
            case 'Cancelled': return 'var(--danger-color)';
            default: return 'var(--text-secondary)';
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        className="icon-action-btn"
                        onClick={() => navigate('/jobs')}
                        style={{ background: 'var(--hover-bg)' }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h3>Job Details</h3>
                        <p className="subtitle">Reference: <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>{job.id}</span></p>
                    </div>
                </div>
                <div className="header-actions">
                    <span style={{
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        background: `${getStatusColor(job.status)}15`,
                        color: getStatusColor(job.status),
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        border: `1px solid ${getStatusColor(job.status)}30`
                    }}>
                        {job.status}
                    </span>
                </div>
            </div>

            <div className="details-grid" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 350px',
                gap: '1.5rem',
                alignItems: 'start'
            }}>
                <div className="left-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Job Info Card */}
                    <div className="content-card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Package size={18} className="text-primary" />
                            Service Information
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="info-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase' }}>Service Type</label>
                                <p style={{ fontWeight: '600' }}>{job.serviceName}</p>
                            </div>
                            <div className="info-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase' }}>Appointment</label>
                                <p className='text-primary' style={{ fontWeight: '600' }}>{job.createdAt}</p>
                            </div>
                            <div className="info-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase' }}>Service Point</label>
                                <p style={{ fontWeight: '600' }}>{job.pointName}</p>
                            </div>
                            <div className="info-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase' }}>Created Date</label>
                                <p style={{ fontWeight: '600' }}>{job.createdAt}</p>
                            </div>
                            <div className="info-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase' }}>Service Center</label>
                                <p style={{ fontWeight: '600' }}>{job.centerName}</p>
                            </div>
                            <div className="info-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase' }}>Appointment Method</label>
                                <p className='text-primary' style={{ fontWeight: '600' }}>{job.appointmentMethod}</p>
                            </div>
                        </div>
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--hover-bg)', borderRadius: '8px' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase' }}>Observations / Notes</label>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-main)' }}>{job.description}</p>
                        </div>
                    </div>

                    {/* Timeline Card */}
                    <div className="content-card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock4 size={18} className="text-primary" />
                            Status Timeline
                        </h4>
                        <div className="timeline-container" style={{ position: 'relative', paddingLeft: '2rem' }}>
                            <div style={{
                                position: 'absolute',
                                left: '7px',
                                top: '0',
                                bottom: '0',
                                width: '2px',
                                background: 'var(--border-color)',
                                zIndex: '0'
                            }}></div>
                            {job.timeline.map((step, index) => (
                                <div key={index} className="timeline-item" style={{ position: 'relative', marginBottom: '2rem' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: '-2rem',
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        background: step.completed ? 'var(--primary-color)' : 'white',
                                        border: `2px solid ${step.completed ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                        top: '0',
                                        zIndex: '1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {step.completed && <CheckCircle2 size={10} color="white" />}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h5 style={{ margin: '0 0 5px 0', fontSize: '0.95rem', fontWeight: '600', color: step.completed ? 'var(--text-main)' : 'var(--text-secondary)' }}>{step.status}</h5>
                                            <p style={{ margin: '0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{step.description}</p>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                            {step.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="right-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Customer Card */}
                    <div className="content-card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={18} className="text-primary" />
                            Customer Details
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <p style={{ fontWeight: '600', marginBottom: '2px' }}>{job.customerName}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{job.customerPhone}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{job.customerEmail}</p>
                            </div>
                            <button className="secondary-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                Contact Customer
                            </button>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="content-card" style={{ padding: '1.5rem', background: 'var(--primary-color)', color: 'white' }}>
                        <h4 style={{ marginBottom: '1.2rem', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <DollarSign size={18} />
                            Payment Status
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span>Total Amount</span>
                                <span style={{ fontWeight: '600' }}>LKR {job.totalAmount.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span>Paid Amount</span>
                                <span style={{ fontWeight: '600' }}>LKR {job.paidAmount.toLocaleString()}</span>
                            </div>
                            <div style={{
                                marginTop: '0.5rem',
                                paddingTop: '0.8rem',
                                borderTop: '1px solid rgba(255,255,255,0.2)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontWeight: '700',
                                fontSize: '1rem'
                            }}>
                                <span>Balance</span>
                                <span>LKR {(job.totalAmount - job.paidAmount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
