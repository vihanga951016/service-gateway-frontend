import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Briefcase, Clock, DollarSign, Tag, Edit2, Trash2, Eye, Loader2, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ServiceModal from '../components/ServiceModal';
import ConfirmDialog from '../components/ConfirmDialog';
import InfoModal from '../components/InfoModal';
import { getServices, deleteService } from '../services/serviceProviderService';

const Services = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [infoModalContent, setInfoModalContent] = useState('');

    const itemsPerPage = 10;

    const fetchServices = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage - 1,
                size: itemsPerPage,
                searchText: searchQuery,
                sort: {
                    column: 'id',
                    direction: 'DESC'
                }
            };
            const data = await getServices(params);
            if (data) {
                setServices(data.content || []);
                setTotalPages(data.totalPages || 0);
                setTotalItems(data.totalElements || 0);
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
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchQuery, navigate]);

    const lastFetchParams = useRef(null);
    useEffect(() => {
        const currentParams = JSON.stringify({ currentPage, searchQuery });
        if (lastFetchParams.current !== currentParams) {
            fetchServices();
            lastFetchParams.current = currentParams;
        }
    }, [fetchServices, currentPage, searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleAddClick = () => {
        setSelectedService(null);
        setIsViewOnly(false);
        setIsModalOpen(true);
    };

    const handleEditClick = (service) => {
        setSelectedService(service);
        setIsViewOnly(false);
        setIsModalOpen(true);
    };

    const handleViewClick = (service) => {
        setSelectedService(service);
        setIsViewOnly(true);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        setServiceToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleInfoClick = (description) => {
        setInfoModalContent(description || 'No description provided.');
        setIsInfoModalOpen(true);
    };

    const confirmDeleteService = async () => {
        if (!serviceToDelete) return;

        try {
            await deleteService(serviceToDelete);
            toast.success('Service deleted successfully');
            fetchServices();
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
        } finally {
            setIsDeleteDialogOpen(false);
            setServiceToDelete(null);
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="page-container">
            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={fetchServices}
                initialData={selectedService}
                isViewOnly={isViewOnly}
            />

            <InfoModal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
                title="Service Description"
                content={infoModalContent}
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setServiceToDelete(null);
                }}
                onConfirm={confirmDeleteService}
                title="Delete Service"
                message="Are you sure you want to delete this service? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />

            <div className="page-header">
                <div>
                    <h3>Services Management</h3>
                    <p className="subtitle">Manage services offered by the provider</p>
                </div>
                <div className="header-actions">
                    <button className="primary-btn" onClick={handleAddClick}>
                        <Plus size={18} />
                        <span>Add Service</span>
                    </button>
                </div>
            </div>

            <div className="content-card">
                <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                    <div className="search-bar" style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="form-control"
                            style={{ paddingLeft: '35px', width: '100%' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Service Time</th>
                                    <th>Total Price</th>
                                    <th>Down Price</th>
                                    <th>Description</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.length > 0 ? (
                                    services.map(service => (
                                        <tr key={service.id}>
                                            <td className="font-medium">{service.name}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    {service.serviceTimeDepends ? (
                                                        <span className="tag-pill" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                                                            Depends
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <Clock size={14} className="text-muted" />
                                                            {service.serviceTime ? (() => {
                                                                if (typeof service.serviceTime === 'string' && service.serviceTime.includes(':')) {
                                                                    return service.serviceTime;
                                                                }
                                                                const date = new Date(service.serviceTime);
                                                                if (!isNaN(date.getTime())) {
                                                                    const hours = String(date.getHours()).padStart(2, '0');
                                                                    const minutes = String(date.getMinutes()).padStart(2, '0');
                                                                    const seconds = String(date.getSeconds()).padStart(2, '0');
                                                                    return `${hours}:${minutes}:${seconds}`;
                                                                }
                                                                return 'Invalid Time';
                                                            })() : 'N/A'}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    {service.totalPriceDepends ? (
                                                        <span className="tag-pill" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                                                            Depends
                                                        </span>
                                                    ) : (
                                                        <>Rs. {service.totalPrice ? service.totalPrice.toLocaleString() : '0'}</>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    Rs. {service.downPrice ? service.downPrice.toLocaleString() : '0'}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <button
                                                        className="icon-action-btn text-info"
                                                        title="View Description"
                                                        onClick={() => handleInfoClick(service.description)}
                                                        style={{ color: '#0ea5e9' }}
                                                    >
                                                        <Info size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-buttons justify-end">
                                                    {/* <button className="icon-action-btn text-primary" title="View" onClick={() => handleViewClick(service)}>
                                                        <Eye size={16} />
                                                    </button> */}
                                                    <button className="icon-action-btn" title="Edit" onClick={() => handleEditClick(service)}>
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="icon-action-btn text-danger" title="Delete" onClick={() => handleDeleteClick(service.id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center" style={{ padding: '2rem', color: '#94a3b8' }}>
                                            No services found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && totalItems > 0 && (
                    <div className="pagination-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                        <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                        </div>
                        <div className="pagination-controls" style={{ display: 'flex', gap: '5px' }}>
                            <button
                                className="icon-btn"
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                style={{ padding: '0.5rem', borderRadius: '4px', background: currentPage === 1 ? '#f5f5f5' : 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', border: 'none' }}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => paginate(i + 1)}
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px',
                                        background: currentPage === i + 1 ? 'var(--primary-color, #007bff)' : 'white',
                                        color: currentPage === i + 1 ? 'white' : 'inherit',
                                        cursor: 'pointer',
                                        border: 'none',
                                        fontWeight: currentPage === i + 1 ? '600' : '400'
                                    }}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className="icon-btn"
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                style={{ padding: '0.5rem', borderRadius: '4px', background: currentPage === totalPages ? '#f5f5f5' : 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', border: 'none' }}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;
