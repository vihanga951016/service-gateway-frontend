import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bell, UserCircle, User, Settings, LogOut, Building, Menu } from 'lucide-react';
import SettingsModal from '../components/SettingsModal';
import { getConfig } from '../config';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';

const Header = ({ toggleSidebar }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { userInfo, loading: isLoadingUserData } = useUser();
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

    const handleLogout = async () => {
        const cleanup = () => {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userType');
            localStorage.removeItem('providerId');
            navigate('/login');
        };

        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');
        if (token) {
            await axios.get(`${baseUrl}/user/logout`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(() => {
                cleanup();
            }).catch((error) => {
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
            });
        }
    };

    const openSettings = () => {
        setIsDropdownOpen(false);
        setIsSettingsOpen(true);
    };

    return (
        <>
            <header className="header">
                <div className="header-left">
                    <button className="menu-toggle" onClick={toggleSidebar}>
                        <Menu size={24} />
                    </button>
                    <h2 className="header-title">{userInfo.provider}</h2>
                    <span className="badge-pill">{userInfo.providerId}</span>
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
                            <span className="profile-name">{userInfo.name}</span>
                        </button>

                        {isDropdownOpen && (
                            <div className="profile-dropdown">
                                <div className="profile-info">
                                    <div className="profile-info-name">{userInfo.name}</div>
                                    <div className="profile-info-email">{userInfo.email}</div>
                                    <div className="profile-info-type">{userInfo.userType}</div>
                                </div>
                                <div className="dropdown-divider"></div>
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
