import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Layers, ChevronDown, ChevronUp, Check, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import '../App.css';

const AssignClusterModal = ({ isOpen, onClose, onSave }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedClusters, setSelectedClusters] = useState([]);
    const [assigning, setAssigning] = useState(false);
    const dropdownRef = useRef(null);

    // Dummy Data
    const dummyClusters = [
        { id: 101, name: "Colombo West Cluster", serviceCount: 12 },
        { id: 102, name: "Gampaha North Cluster", serviceCount: 8 },
        { id: 103, name: "Kandy Central Cluster", serviceCount: 15 },
        { id: 104, name: "Galle Southern Cluster", serviceCount: 10 },
        { id: 105, name: "Jaffna Northern Cluster", serviceCount: 6 }
    ];

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setIsDropdownOpen(false);
            setSelectedClusters([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAssign = () => {
        if (selectedClusters.length === 0) {
            toast.error('Please select at least one cluster');
            return;
        }

        setAssigning(true);
        // Simulate API call
        setTimeout(() => {
            const clusterNames = selectedClusters.map(c => c.name).join(', ');
            toast.success(`${selectedClusters.length} clusters added successfully: ${clusterNames} (Simulated)`);
            setAssigning(false);
            onSave();
            onClose();
        }, 1200);
    };

    const filteredClusters = dummyClusters.filter(cluster =>
        cluster.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleCluster = (cluster) => {
        const exists = selectedClusters.find(c => c.id === cluster.id);
        if (exists) {
            setSelectedClusters(selectedClusters.filter(c => c.id !== cluster.id));
        } else {
            setSelectedClusters([...selectedClusters, cluster]);
        }
    };

    const removeClusterTag = (clusterId) => {
        setSelectedClusters(selectedClusters.filter(c => c.id !== clusterId));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="icon-circle" style={{ background: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                            <Layers size={20} />
                        </div>
                        <h3>Add Service Clusters</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <p style={{ marginBottom: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Search and select one or more regional service clusters to add.
                    </p>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label">Select Clusters</label>
                        <div className="custom-dropdown" ref={dropdownRef}>
                            <div
                                className="dropdown-input-wrapper"
                                onClick={() => setIsDropdownOpen(true)}
                                style={{
                                    border: isDropdownOpen ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                                    boxShadow: isDropdownOpen ? '0 0 0 3px var(--primary-light)' : 'none',
                                    padding: '8px 12px'
                                }}
                            >
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder={selectedClusters.length > 0 ? "" : "Search clusters..."}
                                    className="dropdown-search-input"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setIsDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <button
                                    className="dropdown-toggle-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDropdownOpen(!isDropdownOpen);
                                    }}
                                    type="button"
                                >
                                    {isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                            </div>

                            {isDropdownOpen && (
                                <div className="dropdown-options-list" style={{ maxHeight: '250px' }}>
                                    {filteredClusters.length > 0 ? (
                                        filteredClusters.map(cluster => {
                                            const isSelected = selectedClusters.some(c => c.id === cluster.id);
                                            return (
                                                <div
                                                    key={cluster.id}
                                                    className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => toggleCluster(cluster)}
                                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px' }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{
                                                            width: '18px',
                                                            height: '18px',
                                                            border: isSelected ? '2px solid var(--primary-color)' : '2px solid var(--border-color)',
                                                            borderRadius: '4px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            background: isSelected ? 'var(--primary-color)' : 'transparent',
                                                            transition: 'all 0.2s'
                                                        }}>
                                                            {isSelected && <Check size={14} color="white" strokeWidth={3} />}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: '500', fontSize: '0.95rem' }}>{cluster.name}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                                {cluster.serviceCount} services
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="no-options">No clusters found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedClusters.length > 0 && (
                        <div className="selected-tags-container" style={{
                            marginTop: '0.5rem',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            padding: '12px',
                            background: 'var(--hover-bg)',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div style={{ width: '100%', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                    Selected Clusters ({selectedClusters.length})
                                </span>
                                <button
                                    onClick={() => setSelectedClusters([])}
                                    style={{ fontSize: '0.8rem', color: 'var(--danger-color)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                >
                                    Clear all
                                </button>
                            </div>
                            {selectedClusters.map(cluster => (
                                <div key={cluster.id} className="badge-pill" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 10px',
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--primary-color)',
                                    fontWeight: '500',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}>
                                    {cluster.name}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeClusterTag(cluster.id);
                                        }}
                                        style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--danger-color)' }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" className="secondary-btn" onClick={onClose} disabled={assigning}>Cancel</button>
                    <button
                        type="button"
                        className="primary-btn"
                        onClick={handleAssign}
                        disabled={assigning || selectedClusters.length === 0}
                        style={{ minWidth: '130px' }}
                    >
                        {assigning ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                <span>Adding...</span>
                            </>
                        ) : (
                            `Add ${selectedClusters.length > 0 ? selectedClusters.length : ''} Cluster${selectedClusters.length > 1 ? 's' : ''}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignClusterModal;
