import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, UserCircle, User, Settings, LogOut, Building } from 'lucide-react';
import SettingsModal from '../components/SettingsModal';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    const openSettings = () => {
        setIsDropdownOpen(false);
        setIsSettingsOpen(true);
    };

    return (
        <>
            <header className="header">
                <div className="header-left">
                    <h2>Overview</h2>
                </div>
                <div className="header-right">
                    <button className="icon-btn">
                        <Bell size={20} />
                        <span className="badge">3</span>
                    </button>
                    <div className="profile-section" ref={dropdownRef}>
                        <button
                            className="profile-trigger"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <UserCircle size={32} className="profile-icon" />
                            <span className="profile-name">Admin User</span>
                        </button>

                        {isDropdownOpen && (
                            <div className="profile-dropdown">
                                <button onClick={() => { setIsDropdownOpen(false); navigate('/user-profile'); }} className="dropdown-item">
                                    <User size={16} />
                                    <span>User Profile</span>
                                </button>
                                <button onClick={() => { setIsDropdownOpen(false); navigate('/service-provider-profile'); }} className="dropdown-item">
                                    <Building size={16} />
                                    <span>Service Provider Profile</span>
                                </button>
                                <button onClick={openSettings} className="dropdown-item">
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </button>
                                <div className="dropdown-divider"></div>
                                <button onClick={handleLogout} className="dropdown-item text-danger">
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </>
    );
};

export default Header;
