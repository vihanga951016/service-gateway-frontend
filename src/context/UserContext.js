import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserHeaderData, getUserPermissions } from '../services/userService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({
        name: 'Loading...',
        email: '',
        userType: '',
        provider: '',
        providerId: ''
    });
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchRef = React.useRef(false);

    useEffect(() => {
        if (fetchRef.current) return;
        fetchRef.current = true;

        const fetchUserData = async () => {
            try {
                setLoading(true);
                // Fetch both in parallel
                const [userData, userPermissions] = await Promise.all([
                    getUserHeaderData(),
                    getUserPermissions()
                ]);

                setUserInfo({
                    name: userData.userName || 'User',
                    email: userData.email || '',
                    userType: userData.userType || 'User',
                    provider: userData.serviceCenter || '',
                    providerId: userData.providerId || ''
                });

                if (userPermissions) {
                    setPermissions(userPermissions);
                }
            } catch (error) {
                console.error('Failed to fetch user context data:', error);
                if (error?.response?.data?.code === 1) {
                    toast.info("Session expired. Please login again.");
                    navigate('/login');
                } else if (error?.message === 'No authentication token found') {
                    navigate('/login');
                } else {
                    toast.error(error?.response?.data?.data || 'Failed to initialize user session');
                }
            } finally {
                setLoading(false);
            }
        };

        const token = localStorage.getItem('token');
        if (token) {
            fetchUserData();
        } else {
            setLoading(false);
            navigate('/login');
        }
    }, [navigate]);

    const hasPermission = (permissionName) => {
        return permissions.includes(permissionName);
    };

    const value = {
        userInfo,
        permissions,
        loading,
        hasPermission,
        refreshUser: async () => {
            // Can be used to manually refresh data if needed
            setLoading(true);
            try {
                const [userData, userPermissions] = await Promise.all([
                    getUserHeaderData(),
                    getUserPermissions()
                ]);
                setUserInfo({
                    name: userData.userName || 'User',
                    email: userData.email || '',
                    userType: userData.userType || 'User',
                    provider: userData.serviceCenter || '',
                    providerId: userData.providerId || ''
                });
                setPermissions(userPermissions);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
