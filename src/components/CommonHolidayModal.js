import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { addCommonHolidays, getCommonHolidays } from '../services/holidayService';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const CommonHolidayModal = ({ isOpen, onClose, onSave }) => {
    const days = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    const navigate = useNavigate();

    const [selectedDays, setSelectedDays] = useState({
        Sunday: false,
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCurrentCommonHolidays();
        }
    }, [isOpen]);

    const fetchCurrentCommonHolidays = async () => {
        setIsLoading(true);
        try {
            const response = await getCommonHolidays();
            const data = response?.data || response || {};

            setSelectedDays({
                Sunday: !!data.sunday,
                Monday: !!data.monday,
                Tuesday: !!data.tuesday,
                Wednesday: !!data.wednesday,
                Thursday: !!data.thursday,
                Friday: !!data.friday,
                Saturday: !!data.saturday
            });
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
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const handleCheckboxChange = (day) => {
        setSelectedDays(prev => ({
            ...prev,
            [day]: !prev[day]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selected = Object.keys(selectedDays).filter(day => selectedDays[day]);
        if (selected.length === 0) {
            return toast.error('Please select at least one day');
        }

        setIsSaving(true);
        try {
            // Send the selectedDays object with lowercase keys to match the backend requirement
            const commonHolidayData = {
                sunday: selectedDays.Sunday,
                monday: selectedDays.Monday,
                tuesday: selectedDays.Tuesday,
                wednesday: selectedDays.Wednesday,
                thursday: selectedDays.Thursday,
                friday: selectedDays.Friday,
                saturday: selectedDays.Saturday
            };

            await addCommonHolidays(commonHolidayData);

            toast.success('Common holidays updated successfully');
            onSave(selected);
            onClose();
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
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h3>Common Holidays</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                            <Loader2 className="animate-spin" size={32} color="var(--primary-color)" />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="weekdays-grid" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {days.map(day => (
                                    <div
                                        key={day}
                                        className={`weekday-item ${selectedDays[day] ? 'selected' : ''}`}
                                        onClick={() => handleCheckboxChange(day)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px 16px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-color)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            background: selectedDays[day] ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                                            borderColor: selectedDays[day] ? 'var(--primary-color)' : 'var(--border-color)'
                                        }}
                                    >
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '4px',
                                            border: '2px solid',
                                            borderColor: selectedDays[day] ? 'var(--primary-color)' : '#94a3b8',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: selectedDays[day] ? 'var(--primary-color)' : 'transparent'
                                        }}>
                                            {selectedDays[day] && <Check size={14} color="white" strokeWidth={3} />}
                                        </div>
                                        <span style={{
                                            fontWeight: selectedDays[day] ? '600' : '400',
                                            color: selectedDays[day] ? 'var(--primary-color)' : 'inherit'
                                        }}>{day}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="modal-footer" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" className="secondary-btn" onClick={onClose} disabled={isSaving}>Cancel</button>
                                <button type="submit" className="primary-btn" disabled={isSaving}>
                                    {isSaving ? 'Updating...' : 'Save Selection'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommonHolidayModal;
