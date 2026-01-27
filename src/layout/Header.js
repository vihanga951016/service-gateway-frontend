import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bell, UserCircle, User, Settings, LogOut, Building } from 'lucide-react';
import SettingsModal from '../components/SettingsModal';
import { getConfig } from '../config';
import { toast } from 'react-toastify';
import { getUserHeaderData } from '../services/userService';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: 'Loading...',
        email: '',
        userType: '',
        provider: ''
    });
    const [isLoadingUserData, setIsLoadingUserData] = useState(true);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Fetch user info from API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoadingUserData(true);
                const data = await getUserHeaderData();
                
                setUserInfo({
                    name: data.userName || 'User',
                    email: data.email || '',
                    userType: data.userType || 'User',
                    provider: data.serviceCenter || ''
                });
            } catch (error) {
                console.error('Error fetching user header data:', error);
                // Fallback to localStorage if API fails
                const name = localStorage.getItem('userName') || 'User';
                const email = localStorage.getItem('userEmail') || '';
                const userType = localStorage.getItem('userType') || 'User';
                const provider = localStorage.getItem('serviceCenter') || '';
                setUserInfo({ name, email, userType, provider });
            } finally {
                setIsLoadingUserData(false);
            }
        };

        fetchUserData();
    }, []);

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
            navigate('/login');
        };

        try {
            const baseUrl = getConfig().baseUrl;
            const token = localStorage.getItem('token');
            if (token) {
                await axios.get(`${baseUrl}/user/logout`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            cleanup();
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
                    <h2>{userInfo.provider}</h2>
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
