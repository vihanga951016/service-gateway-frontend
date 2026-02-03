import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Layout, Briefcase, ChevronLeft, MapPin, Phone, Clock, Mail, Shield, Loader2, UserPlus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { getServiceCenterById, getEmployeesByCenterId, removeUserFromCenter, getServicePointsByCenterId } from '../services/serviceProviderService';
import AssignUserModal from '../components/AssignUserModal';
import ServicePointModal from '../components/ServicePointModal';
import AssignServiceToPointModal from '../components/AssignServiceToPointModal';
import ConfirmDialog from '../components/ConfirmDialog';
import '../App.css';

const ServiceCenter = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('employees');
    const [loading, setLoading] = useState(true);
    const [centerDetails, setCenterDetails] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [employeesLoading, setEmployeesLoading] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [employeeToRemove, setEmployeeToRemove] = useState(null);
    const [isRemoving, setIsRemoving] = useState(false);
    const [servicePoints, setServicePoints] = useState([]);
    const [pointsLoading, setPointsLoading] = useState(false);
    const [isPointModalOpen, setIsPointModalOpen] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [isAssignPointModalOpen, setIsAssignPointModalOpen] = useState(false);
    const [selectedServiceForAssignment, setSelectedServiceForAssignment] = useState(null);

    const fetchEmployees = async () => {
        setEmployeesLoading(true);
        try {
            const data = await getEmployeesByCenterId(id);
            setEmployees(data || []);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        } finally {
            setEmployeesLoading(false);
        }
    };

    const fetchServicePoints = async () => {
        setPointsLoading(true);
        try {
            const data = await getServicePointsByCenterId(id);
            setServicePoints(data || []);
        } catch (error) {
            console.error("Failed to fetch service points:", error);
        } finally {
            setPointsLoading(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [centerData, employeesData, pointsData] = await Promise.all([
                getServiceCenterById(id),
                getEmployeesByCenterId(id),
                getServicePointsByCenterId(id)
            ]);

            if (centerData) setCenterDetails(centerData);
            if (employeesData) setEmployees(employeesData);
            if (pointsData) setServicePoints(pointsData);
        } catch (error) {
            if (error?.response?.data?.data) {
                if (error?.response?.data?.code === 1) {
                    toast.info("Session expired. Please login again.");
                    navigate('/login');
                } else {
                    toast.error(error?.response?.data?.data);
                }
            } else {
                toast.error('Failed to load service center details');
            }
            navigate('/service-centers');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveEmployee = async () => {
        if (!employeeToRemove) return;
        setIsRemoving(true);
        try {
            await removeUserFromCenter(employeeToRemove.userId);
            toast.success('Employee removed from center successfully');
            fetchEmployees();
        } catch (error) {
            if (error?.response?.data?.data) {
                if (error?.response?.data?.code === 1) {
                    toast.info("Session expired. Please login again.");
                    navigate('/login');
                } else {
                    toast.error(error?.response?.data?.data);
                }
            } else {
                toast.error('Failed to load service center details');
            }
        } finally {
            setIsRemoving(false);
            setEmployeeToRemove(null);
            setIsRemoveDialogOpen(false);
        }
    };

    const lastFetchId = useRef(null);
    useEffect(() => {
        if (id && lastFetchId.current !== id) {
            fetchData();
            lastFetchId.current = id;
        }
    }, [id, navigate]);

    // Dummy Data for rest of the tabs
    const dummyServicePoints = [
        { id: 1, name: "Counter 01", type: "Standard", status: "Open" },
        { id: 2, name: "Counter 02", type: "Express", status: "Closed" },
        { id: 3, name: "Counter 03", type: "Premium", status: "Open" },
        { id: 4, name: "Self-Service Kiosk", type: "Digital", status: "Online" }
    ];

    const dummyServices = [
        { id: 1, name: "Standard Repair", time: "01:30:00", price: "Rs. 2,500" },
        { id: 2, name: "Premium Inspection", time: "00:45:00", price: "Rs. 1,200" },
        { id: 3, name: "Oil Change & Filter", time: "01:00:00", price: "Rs. 4,500" },
        { id: 4, name: "Full Diagnostics", time: "02:00:00", price: "Rs. 3,800" }
    ];

    if (loading) {
        return (
            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!centerDetails) return null;

    return (
        <div className="page-container">
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        className="icon-btn"
                        onClick={() => navigate('/service-centers')}
                        style={{ background: 'var(--hover-bg)', padding: '0.5rem', borderRadius: '50%' }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h3>{centerDetails.name}</h3>
                        <p className="subtitle">Detailed view of service center operations</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 3fr', gap: '2rem', marginTop: '1.5rem' }}>
                {/* Sidebar Details Card */}
                <div className="content-card" style={{ height: 'fit-content', position: 'sticky', top: '2rem' }}>
                    <h4 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>General Info</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <MapPin size={18} className="text-muted" style={{ flexShrink: 0 }} />
                            <div style={{ minWidth: 0 }}>
                                <small style={{ color: 'var(--text-secondary)', display: 'block' }}>Location</small>
                                <span style={{ fontSize: '0.9rem', overflowWrap: 'break-word' }}>{centerDetails.location}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Phone size={18} className="text-muted" style={{ flexShrink: 0 }} />
                            <div style={{ minWidth: 0 }}>
                                <small style={{ color: 'var(--text-secondary)', display: 'block' }}>Contact</small>
                                <span style={{ fontSize: '0.9rem', overflowWrap: 'break-word' }}>{centerDetails.contact}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Mail size={18} className="text-muted" style={{ flexShrink: 0 }} />
                            <div style={{ minWidth: 0 }}>
                                <small style={{ color: 'var(--text-secondary)', display: 'block' }}>Email</small>
                                <span style={{ fontSize: '0.9rem', overflowWrap: 'break-word' }}>{centerDetails.email || 'N/A'}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Clock size={18} className="text-muted" style={{ flexShrink: 0 }} />
                            <div style={{ minWidth: 0 }}>
                                <small style={{ color: 'var(--text-secondary)', display: 'block' }}>Opening Hours</small>
                                <span style={{ fontSize: '0.9rem', color: '#10b981', overflowWrap: 'break-word' }}>
                                    {centerDetails.fopenTime} - {centerDetails.fcloseTime}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <div className="content-card">
                    <div className="tabs" style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                        <button
                            className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`}
                            onClick={() => setActiveTab('employees')}
                            style={{
                                padding: '1rem 0',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === 'employees' ? '2px solid var(--primary-color)' : '2px solid transparent',
                                color: activeTab === 'employees' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                fontWeight: activeTab === 'employees' ? '600' : '400',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Users size={18} />
                            Assigned Employees
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'points' ? 'active' : ''}`}
                            onClick={() => setActiveTab('points')}
                            style={{
                                padding: '1rem 0',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === 'points' ? '2px solid var(--primary-color)' : '2px solid transparent',
                                color: activeTab === 'points' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                fontWeight: activeTab === 'points' ? '600' : '400',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Layout size={18} />
                            Service Points
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
                            onClick={() => setActiveTab('services')}
                            style={{
                                padding: '1rem 0',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === 'services' ? '2px solid var(--primary-color)' : '2px solid transparent',
                                color: activeTab === 'services' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                fontWeight: activeTab === 'services' ? '600' : '400',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Briefcase size={18} />
                            Available Services
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'employees' && (
                            <div className="tab-section-content">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h4 style={{ margin: 0 }}></h4>
                                    <button
                                        className="primary-btn"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        onClick={() => setIsAssignModalOpen(true)}
                                    >
                                        <UserPlus size={18} />
                                        Assign Employee
                                    </button>
                                </div>

                                <div className="table-responsive">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Role</th>
                                                <th>Email</th>
                                                <th>Contact</th>
                                                {/* <th>Status</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employees.length > 0 ? (
                                                employees.map(emp => (
                                                    <tr key={emp.userId}>
                                                        <td className="font-medium">{emp.userName}</td>
                                                        <td>{emp.role?.name || emp.role || 'N/A'}</td>
                                                        <td>{emp.email}</td>
                                                        <td>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                {emp.contact}
                                                                <button
                                                                    className="icon-action-btn text-danger"
                                                                    title="Remove from Center"
                                                                    onClick={() => {
                                                                        setEmployeeToRemove(emp);
                                                                        setIsRemoveDialogOpen(true);
                                                                    }}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center" style={{ padding: '2rem', color: '#94a3b8' }}>
                                                        No employees assigned to this center.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'points' && (
                            <div className="tab-section-content">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h4 style={{ margin: 0 }}>Active Service Points</h4>
                                    <button
                                        className="primary-btn"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        onClick={() => {
                                            setSelectedPoint(null);
                                            setIsPointModalOpen(true);
                                        }}
                                    >
                                        <Layout size={18} />
                                        Add Service Point
                                    </button>
                                </div>

                                {pointsLoading ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                                        <Loader2 className="animate-spin text-primary" size={32} />
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                        {servicePoints.length > 0 ? (
                                            servicePoints.map(point => (
                                                <div key={point.id} className="stat-card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
                                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: !point.temporaryClosed ? '#10b981' : '#ef4444' }}></div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                        <div className="icon-box-primary" style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
                                                            {/* <Layout size={24} className="text-primary" /> */}
                                                            <span className='text-primary'>{point.shortName || <Layout size={24} className="text-primary" />}</span>
                                                        </div>
                                                        <span style={{
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600',
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '20px',
                                                            background: !point.temporaryClosed ? '#10b98115' : '#ef444415',
                                                            color: !point.temporaryClosed ? '#10b981' : '#ef4444',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.05em'
                                                        }}>
                                                            {!point.temporaryClosed ? 'Active' : 'Closed'}
                                                        </span>
                                                    </div>
                                                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{point.name}</h4>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                            <Clock size={16} />
                                                            <span>{point.openTime} - {point.closeTime}</span>
                                                        </div>
                                                        <button
                                                            className="secondary-btn"
                                                            style={{
                                                                marginTop: '1rem',
                                                                width: '100%',
                                                                padding: '0.5rem',
                                                                fontSize: '0.85rem',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '0.5rem'
                                                            }}
                                                            onClick={() => {
                                                                setSelectedPoint(point);
                                                                setIsPointModalOpen(true);
                                                            }}
                                                        >
                                                            Edit Details
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', background: 'var(--hover-bg)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                                                <Layout size={40} style={{ color: 'var(--text-secondary)', marginBottom: '1rem', opacity: 0.5 }} />
                                                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>No service points added yet.</p>
                                                <button
                                                    onClick={() => setIsPointModalOpen(true)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem' }}
                                                >
                                                    Create your first service point
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'services' && (
                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Service Name</th>
                                            <th>Service Time</th>
                                            <th>Price</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dummyServices.map(service => (
                                            <tr key={service.id}>
                                                <td className="font-medium">{service.name}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <Clock size={14} className="text-muted" />
                                                        {service.time}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                                                        {service.price}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <button
                                                        className="secondary-btn"
                                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}
                                                        onClick={() => {
                                                            setSelectedServiceForAssignment(service);
                                                            setIsAssignPointModalOpen(true);
                                                        }}
                                                    >
                                                        <Layout size={14} />
                                                        Assign Point
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AssignUserModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                centerId={id}
                onSave={fetchEmployees}
            />

            <ServicePointModal
                isOpen={isPointModalOpen}
                onClose={() => setIsPointModalOpen(false)}
                centerId={id}
                onSave={fetchServicePoints}
                initialData={selectedPoint}
            />

            <AssignServiceToPointModal
                isOpen={isAssignPointModalOpen}
                onClose={() => setIsAssignPointModalOpen(false)}
                service={selectedServiceForAssignment}
                availablePoints={servicePoints}
                initialSelectedPoints={[]} // This would be fetched if real
            />

            <ConfirmDialog
                isOpen={isRemoveDialogOpen}
                onClose={() => {
                    if (!isRemoving) {
                        setIsRemoveDialogOpen(false);
                        setEmployeeToRemove(null);
                    }
                }}
                onConfirm={handleRemoveEmployee}
                title="Remove Employee"
                message={`Are you sure you want to remove ${employeeToRemove?.userName} from this service center?`}
                confirmText={isRemoving ? "Removing..." : "Remove"}
                type="danger"
            />
        </div>
    );
};

export default ServiceCenter;
