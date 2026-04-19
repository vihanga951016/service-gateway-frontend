import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    ChevronLeft,
    Calendar,
    Clock,
    ClockAlert,
    User,
    MapPin,
    CheckCircle2,
    AlertCircle,
    DollarSign,
    Truck,
    Package,
    Settings,
    Clock4,
    BadgeCheck
} from 'lucide-react';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    timelineItemClasses
} from '@mui/lab';
import { Typography, Box, CircularProgress } from '@mui/material';
import '../App.css';
import { getJobDetails } from '../services/jobService';
import Tooltip from '@mui/material/Tooltip';
import { toast } from 'react-toastify';

/**
 * Map SubJobDetails.status (integer) to a human-readable label.
 * Adjust values to match your backend enum.
 */
const subStatusLabel = (status) => {
    switch (status) {
        case 0: return 'Pending';
        case 1: return 'In Progress';
        case 2: return 'Completed';
        case 3: return 'Cancelled';
        default: return `Status ${status}`;
    }
};

/** Format a LocalTime string (HH:mm:ss or HH:mm) to HH:mm display. */
const formatTime = (t) => {
    if (!t) return '-';
    return t.substring(0, 5); // "HH:mm"
};

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getJobDetails(id);
                setJob(data);
            } catch (err) {
                if (err?.response?.data?.data) {
                    if (err?.response?.data?.code === 1) {
                        toast.info("Session expired. Please login again.");
                        navigate('/login');
                    } else {
                        toast.error(err?.response?.data?.data);
                        navigate('/jobs');
                    }
                } else {
                    toast.error('Network error');
                }
                setError(err.message || 'Failed to load job details');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'var(--success-color)';
            case 'In Progress':
            case 'Serving': return 'var(--primary-color)';
            case 'Pending': return 'var(--warning-color)';
            case 'Cancelled': return 'var(--danger-color)';
            default: return 'var(--text-secondary)';
        }
    };

    if (loading) {
        return (
            <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                <CircularProgress size={32} />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="page-container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger-color)', padding: '2rem' }}>
                    <AlertCircle size={20} />
                    <p>{error || 'Job not found.'}</p>
                </div>
            </div>
        );
    }

    const timeline = job.timeline || [];

    return (
        <div className="page-container">
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        className="icon-action-btn"
                        onClick={() => {
                            if (location.state && location.state.fromStatusModal) {
                                navigate('/dashboard', {
                                    state: {
                                        openStatusModal: true,
                                        returnStatus: location.state.returnStatus,
                                        selectedJobId: id
                                    }
                                });
                            } else {
                                navigate('/jobs', {
                                    state: {
                                        selectedJobId: id,
                                        selectedCenter: location.state?.selectedCenter,
                                        selectedDate: location.state?.selectedDate
                                    }
                                });
                            }
                        }}
                        style={{ background: 'var(--hover-bg)' }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                Job Details
                                {job.verifiedJob && (
                                    <Tooltip title="Payment Verified" arrow placement="top">
                                        <BadgeCheck size={25} fill="var(--primary-color)" color="var(--bg-color)" />
                                    </Tooltip>
                                )}
                            </h3>
                            <p className="subtitle" style={{ margin: 0 }}><span style={{ color: 'var(--primary-color)', fontWeight: '600' }}> JOB - {id}</span></p>
                        </div>
                    </div>
                </div>
                <div className="header-actions">
                    {job.verifiedJob ? (
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
                    ) : (
                        <span style={{
                            padding: '0.4rem 1rem',
                            borderRadius: '20px',
                            background: `var(--danger-color)`,
                            color: "var(--bg-color)",
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            border: `1px solid var(--danger-color)`
                        }}>
                            Verifying
                        </span>
                    )}
                </div>
            </div>

            <div className="details-grid" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 350px',
                gap: '1.5rem',
                alignItems: 'start'
            }}>
                <div className="left-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Service Information */}
                    <div className="content-card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Package size={18} className="text-primary" />
                            Service Information
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="info-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase' }}>Service Type</label>
                                <p style={{ fontWeight: '600' }}>{job.serviceName || '-'}</p>
                            </div>
                            <div className="info-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase' }}>Service Point</label>
                                <p style={{ fontWeight: '600' }}>{job.pointName || '-'}</p>
                            </div>
                            <div className="info-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase' }}>Service Center</label>
                                <p style={{ fontWeight: '600' }}>{job.centerName || '-'}</p>
                            </div>
                            <div className="info-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase' }}>Created Date</label>
                                <p style={{ fontWeight: '600' }}>{job.createdAt || '-'}</p>
                            </div>
                            <div className="info-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase' }}>Appointment Method</label>
                                <p className="text-primary" style={{ fontWeight: '600' }}>{job.appointmentMethod || '-'}</p>
                            </div>
                            <div className="info-group">
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase' }}>Service Time</label>
                                <p style={{ fontWeight: '600' }}>{job.serviceTime || '-'}</p>
                            </div>
                        </div>
                        {job.description && (
                            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--hover-bg)', borderRadius: '8px' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase' }}>Observations / Notes</label>
                                <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-main)' }}>{job.description}</p>
                            </div>
                        )}
                    </div>

                    {/* MUI Timeline — SubJobDetails */}
                    <div className="content-card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock4 size={18} className="text-primary" />
                            Service Timeline
                        </h4>

                        {timeline.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No timeline data available.</p>
                        ) : (
                            <Timeline
                                sx={{
                                    [`& .${timelineItemClasses.root}:before`]: {
                                        flex: 0,
                                        padding: 0,
                                    },
                                    padding: 0,
                                    margin: 0
                                }}
                            >
                                {timeline.map((step, index) => {
                                    const isLast = index === timeline.length - 1;

                                    // actualEndTime = real end; endTime = estimated; use whichever is available
                                    const endDisplay = step.actualEndTime
                                        ? formatTime(step.actualEndTime)
                                        : step.endTime
                                            ? `${formatTime(step.endTime)}${step.estimatedEndTime ? ' (est.)' : ''}`
                                            : null;

                                    const timeRange = step.startTime
                                        ? `${formatTime(step.startTime)}${endDisplay ? ` – ${endDisplay}` : ''}`
                                        : '-';

                                    return (
                                        <TimelineItem key={index} sx={{ minHeight: '80px' }}>
                                            <TimelineSeparator>
                                                <TimelineDot
                                                    variant="outlined"
                                                    sx={{
                                                        bgcolor: step.completed ? 'var(--primary-color)' : 'transparent',
                                                        borderColor: step.completed
                                                            ? 'var(--primary-color)'
                                                            : step.status === 1
                                                                ? 'var(--primary-color)'
                                                                : 'var(--border-color)',
                                                        borderWidth: step.status === 1 ? '2px' : '1px',
                                                        margin: '4px 0',
                                                        padding: '4px',
                                                        boxShadow: 'none'
                                                    }}
                                                />
                                                {!isLast && (
                                                    <TimelineConnector
                                                        sx={{
                                                            bgcolor: step.completed ? 'var(--primary-color)' : 'var(--border-color)',
                                                            width: '1px'
                                                        }}
                                                    />
                                                )}
                                            </TimelineSeparator>
                                            <TimelineContent sx={{ py: '0', px: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                                                    <Typography variant="subtitle2" sx={{
                                                        fontWeight: 700,
                                                        color: step.completed ? 'var(--text-main)' : 'var(--text-secondary)',
                                                        fontSize: '0.95rem'
                                                    }}>
                                                        {step.service}
                                                        {step.pointName && (
                                                            <span className="badge-pill" style={{ marginLeft: '8px', verticalAlign: 'middle', fontSize: '0.7rem' }}>
                                                                {step.pointName}
                                                            </span>
                                                        )}
                                                    </Typography>
                                                    <Typography sx={{
                                                        fontSize: '0.75rem',
                                                        color: 'var(--text-secondary)',
                                                        bgcolor: 'var(--hover-bg)',
                                                        px: 1,
                                                        py: 0.2,
                                                        borderRadius: '4px',
                                                        fontWeight: 600
                                                    }}>
                                                        {timeRange}
                                                    </Typography>
                                                </Box>
                                                <Typography sx={{
                                                    fontSize: '0.85rem',
                                                    color: 'var(--text-secondary)',
                                                    lineHeight: 1.4,
                                                    opacity: step.completed ? 1 : 0.7,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    flexWrap: 'wrap'
                                                }}>
                                                    {step.status === 1 ? (
                                                        <span style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            padding: '2px 8px',
                                                            borderRadius: '20px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '700',
                                                            background: 'var(--primary-bg)',
                                                            color: 'var(--primary-color)',
                                                            border: '1px solid var(--primary-color)'
                                                        }}>
                                                            ● In Progress
                                                        </span>
                                                    ) : (
                                                        subStatusLabel(step.status)
                                                    )}
                                                    {step.estimatedEndTime && !step.completed && (
                                                        <span style={{ marginLeft: '2px', fontSize: '0.75rem', fontStyle: 'italic' }}>· end time estimated</span>
                                                    )}
                                                </Typography>
                                            </TimelineContent>
                                        </TimelineItem>
                                    );
                                })}
                            </Timeline>
                        )}
                    </div>
                </div>

                <div className="right-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Customer Card */}
                    <div className="content-card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={18} className="text-primary" />
                            Customer Details - {job.customer || ''}
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <p style={{ fontWeight: '600', marginBottom: '2px' }}>{job.customerName || ''}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{job.customerPhone || ''}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{job.customerEmail || ''}</p>
                            </div>
                            {/* <button className="secondary-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                Contact Customer
                            </button> */}
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="content-card" style={{ padding: '1.5rem', background: 'var(--primary-color)', color: 'white' }}>
                        <h4 style={{ marginBottom: '1.2rem', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* <DollarSign size={18} /> */}
                            Payment Status
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span>Total Amount</span>
                                <span style={{ fontWeight: '600' }}>{(job.totalAmount ?? 0).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span>Paid Amount</span>
                                <span style={{ fontWeight: '600' }}>{(job.paidAmount ?? 0).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span>Service Fee</span>
                                <span className='text-danger' style={{ fontWeight: '600' }}>- {(job.serviceFee ?? 0).toLocaleString()}</span>
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
                                <span>Rs. {((job.totalAmount ?? 0) - (job.paidAmount ?? 0)).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
