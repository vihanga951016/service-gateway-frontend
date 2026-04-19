import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Activity,
    Briefcase,
    Clock,
    Play,
    CheckCircle,
    Users,
    Layers,
    UserCheck,
    AlertCircle,
    Building2,
    TrendingUp,
    ChevronLeft,
    PieChart,
    Timer,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import StatusJobsModal from '../components/StatusJobsModal';
import '../App.css';
import Tooltip from '@mui/material/Tooltip';

const BranchDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { centerId, centerName } = location.state || { centerId: '1', centerName: 'Downtown Center' };
    const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);

    // Dummy statistics for the branch
    const branchStats = {
        totalJobs: 145,
        pendingJobs: 32,
        activeJobs: 12,
        completedJobs: 101,
        efficiency: 92,
        earningToday: 45200,
        staffOnline: 14,
        shortageAreas: 2
    };

    // Dummy recent jobs for this branch
    const recentJobs = [
        { id: 'JOB-4521', bay: 'Bay 1', service: 'Full Service', status: 'In Progress', time: '10 mins ago', client: 'John Wick', employee: 'Alex Johnson' },
        { id: 'JOB-4521', bay: 'Bay 2', service: 'Normal Service', status: 'In Progress', time: '10 mins ago', client: 'John Wick', employee: 'Sarah Lee' },
        { id: 'JOB-4521', bay: 'Bay 3', service: 'Premium Service', status: 'In Progress', time: '10 mins ago', client: 'John Wick', employee: 'Mike Smith' },
        { id: 'JOB-4521', bay: 'Bay 4', service: 'Full Service', status: 'In Progress', time: '10 mins ago', client: 'John Wick', employee: 'Chris W' }
    ];

    // Dummy distribution data
    const servicePointDistribution = [
        { name: 'Counter 01', services: ['Normal', 'Full'], pending: 5, serving: 2 },
        { name: 'Counter 02', services: ['Premium'], pending: 3, serving: 1 },
        { name: 'Counter 03', services: ['Normal'], pending: 2, serving: 0 },
        { name: 'Bay 01', services: ['Full', 'Wash'], pending: 4, serving: 1 },
    ];

    const clusterDistribution = [
        { name: 'Standard Care', services: ['Normal', 'Oil'], pending: 10, serving: 3 },
        { name: 'Premium Bundle', services: ['Premium', 'Detail'], pending: 6, serving: 2 },
        { name: 'Quick Wash', services: ['Wash', 'Interior'], pending: 8, serving: 4 },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return { bg: 'var(--success-bg)', color: 'var(--success-color)' };
            case 'In Progress': return { bg: 'var(--info-bg)', color: 'var(--info-color)' };
            case 'In Queue': return { bg: 'var(--warning-bg)', color: 'var(--warning-color)' };
            default: return { bg: 'var(--hover-bg)', color: 'var(--text-secondary)' };
        }
    };

    return (
        <div className="page-container" style={{ padding: '2rem' }}>
            <style>
                {`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                `}
            </style>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)',
                            padding: '8px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        {/* <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            <Building2 size={16} />
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Branch Dashboard</span>
                        </div> */}
                        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700' }}>{centerName}</h2>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px' }}>
                            <UserCheck size={18} />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Staff Status</p>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700' }}>{branchStats.staffOnline} Online</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.5rem'
            }}>

                {/* Stats Row */}
                <div className="stat-card"
                    style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '1.5rem', cursor: 'pointer' }}
                    onClick={() => setIsJobsModalOpen(true)}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Jobs</p>
                            <h3 style={{ margin: '4px 0', fontSize: '2.5rem', fontWeight: '800' }}>{branchStats.totalJobs}</h3>
                        </div>
                        {/* <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '12px' }}>
                            <Briefcase size={28} />
                        </div> */}
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                        padding: '1.25rem 0.5rem 0.5rem',
                        borderTop: '1px solid var(--border-color)',
                        marginTop: '0.5rem'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>
                                <Clock size={16} style={{ color: 'var(--warning-color)' }} />
                                <span>Pending</span>
                            </div>
                            <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--warning-color)', lineHeight: 1 }}>{branchStats.pendingJobs}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>
                                <Play size={16} style={{ color: 'var(--info-color)' }} />
                                <span>Serving</span>
                            </div>
                            <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--info-color)', lineHeight: 1 }}>{branchStats.activeJobs}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>
                                <CheckCircle size={16} style={{ color: 'var(--success-color)' }} />
                                <span>Completed</span>
                            </div>
                            <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--success-color)', lineHeight: 1 }}>{branchStats.completedJobs}</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card" style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px' }}>
                                <Tooltip title="Average Earning per day" arrow placement="top">
                                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', fontWeight: '600' }}>
                                        Avg. Rs. 1k
                                    </div>
                                </Tooltip>
                            </div>
                            <Tooltip title="Extra earnings today" arrow placement="top">
                                <div style={{ display: 'flex', alignItems: 'center', color: '#10b981', fontSize: '0.8rem', fontWeight: '600' }}>
                                    +2k today
                                </div>
                            </Tooltip>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>Earnings</p>
                        <h3 style={{ margin: '4px 0', fontSize: '1.6rem', fontWeight: '700' }}>Rs. {branchStats.earningToday.toLocaleString()}</h3>
                    </div>
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>EFFICIENCY</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--success-color)' }}>{branchStats.efficiency}%</span>
                        </div>
                        <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${branchStats.efficiency}%`, background: 'var(--success-color)', borderRadius: '10px' }} />
                        </div>
                    </div>
                </div>

                {/* Second Row: Queue Status (2) | Recent Activities (2) */}
                <div className="stat-card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1rem', height: '500px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Services Distribution</h3>
                        <div style={{ display: 'flex', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--info-color)' }} /> Serving
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning-color)' }} /> Pending
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flex: 1, overflow: 'hidden' }}>
                        {/* Service Points Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: '1px solid var(--border-color)', paddingRight: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                <Building2 size={16} />
                                <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Service Points</span>
                            </div>
                            <div className="hide-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
                                {servicePointDistribution.map((sp, idx) => (
                                    <div key={idx} style={{ background: 'var(--hover-bg)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{sp.name}</span>
                                            {/* <div style={{ display: 'flex', gap: '8px' }}>
                                                <span style={{ color: 'var(--info-color)', fontWeight: '700', fontSize: '0.8rem' }}>{sp.serving}</span>
                                                <span style={{ color: 'var(--warning-color)', fontWeight: '700', fontSize: '0.8rem' }}>{sp.pending}</span>
                                            </div> */}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                                            {sp.services.map((service, sIdx) => (
                                                <span key={sIdx} style={{
                                                    fontSize: '0.65rem',
                                                    padding: '2px 8px',
                                                    background: 'var(--info-bg)',
                                                    color: 'var(--info-color)',
                                                    borderRadius: '20px',
                                                    fontWeight: '600',
                                                    border: '1px solid var(--info-bg)'
                                                }}>
                                                    {service}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Clusters Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                <Layers size={16} />
                                <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned Clusters</span>
                            </div>
                            <div className="hide-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
                                {clusterDistribution.map((cluster, idx) => (
                                    <div key={idx} style={{ background: 'var(--hover-bg)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{cluster.name}</span>
                                            {/* <div style={{ display: 'flex', gap: '8px' }}>
                                                <span style={{ color: 'var(--info-color)', fontWeight: '700', fontSize: '0.8rem' }}>{cluster.serving}</span>
                                                <span style={{ color: 'var(--warning-color)', fontWeight: '700', fontSize: '0.8rem' }}>{cluster.pending}</span>
                                            </div> */}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                                            {cluster.services.map((service, sIdx) => (
                                                <span key={sIdx} style={{
                                                    fontSize: '0.65rem',
                                                    padding: '2px 8px',
                                                    background: 'var(--purple-bg)',
                                                    color: 'var(--purple-color)',
                                                    borderRadius: '20px',
                                                    fontWeight: '600',
                                                    border: '1px solid var(--purple-bg)'
                                                }}>
                                                    {service}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stat-card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '500px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Live Job Track</h3>
                        {/* <Activity size={18} style={{ color: '#ef4444' }} /> */}
                    </div>
                    <div className="hide-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', flex: 1 }}>
                        {recentJobs.map((job, idx) => {
                            const style = getStatusStyle(job.status);
                            return (
                                <div key={idx} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px',
                                    background: 'var(--hover-bg)',
                                    borderRadius: '35px',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ padding: '8px', background: 'var(--info-bg)', color: 'var(--info-color)', borderRadius: '30px' }}>
                                            <Timer size={16} />
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>{job.bay}</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{job.id} • {job.service}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>{job.employee}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <StatusJobsModal
                isOpen={isJobsModalOpen}
                onClose={() => setIsJobsModalOpen(false)}
                status="Total"
            />
        </div>
    );
};

export default BranchDashboard;
