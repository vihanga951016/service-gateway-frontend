import React, { useState, useEffect } from 'react';
import { X, Save, Clock, DollarSign, CreditCard } from 'lucide-react';

const EditClusterServiceModal = ({ isOpen, onClose, service, onSave }) => {
    const [formData, setFormData] = useState({
        total: '',
        downPay: '',
        serviceTime: ''
    });

    useEffect(() => {
        if (service) {
            setFormData({
                total: service.total || 0,
                downPay: service.downPay || 0,
                serviceTime: service.serviceTime || '00:00:00'
            });
        }
    }, [service]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...service,
            ...formData,
            // Ensure numbers are parsed
            total: Number(formData.total),
            downPay: Number(formData.downPay)
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px', marginTop: '1.5rem', marginLeft: '1.5rem', marginRight: '1.5rem' }}>
                <div className="modal-header">
                    <h3>Edit Service Details</h3>
                    <button className="icon-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', marginLeft: '1.5rem', marginRight: '1.5rem' }}>
                    <div className="form-group">
                        {/* <label>Service Name</label> */}
                        <input
                            type="text"
                            value={service?.service || ''}
                            disabled
                            className="form-control"
                            style={{ background: 'var(--hover-bg)', cursor: 'not-allowed' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Service Time (HH:mm:ss)</label>
                        <div className="input-with-icon">
                            {/* <Clock size={18} /> */}
                            <input
                                type="text" // Using text for simplicity, could be time input but strictly HH:mm:ss might vary
                                value={formData.serviceTime}
                                onChange={(e) => setFormData({ ...formData, serviceTime: e.target.value })}
                                placeholder="HH:mm:ss"
                                pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                                title="Format: HH:mm:ss"
                                required
                                className="form-control"
                                style={{ marginTop: '0.5rem' }}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Total Price (Rs)</label>
                            <div className="input-with-icon">
                                {/* <DollarSign size={18} /> */}
                                <input
                                    type="number"
                                    value={formData.total}
                                    onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                                    min="0"
                                    required
                                    className="form-control"
                                    style={{ marginTop: '0.5rem' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Down Payment (Rs)</label>
                            <div className="input-with-icon">
                                {/* <CreditCard size={18} /> */}
                                <input
                                    type="number"
                                    value={formData.downPay}
                                    onChange={(e) => setFormData({ ...formData, downPay: e.target.value })}
                                    min="0"
                                    required
                                    className="form-control"
                                    style={{ marginTop: '0.5rem' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer" style={{ marginBottom: '1.5rem', marginRight: '1.5rem' }}>
                        <button type="button" className="secondary-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="primary-btn">
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditClusterServiceModal;
