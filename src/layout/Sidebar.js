import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, MapPin } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getConfig } from '../config';


const Sidebar = () => {
    const navigate = useNavigate();
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const baseUrl = getConfig().baseUrl;
                const token = localStorage.getItem('token');
                const response = await axios.get(`${baseUrl}/user/load-permissions`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data && response.data.data) {
                    console.log(response.data.data);

                    setPermissions(response.data.data);
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
        };

        fetchPermissions();
    }, []);

    const hasPermission = (permissionName) => {
        return permissions.includes(permissionName);
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <img src="/logo512.png" alt="Service Gateway Logo" className="sidebar-logo" />
            </div>
            <nav className="sidebar-nav">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                {hasPermission('User Management') && (
                    <NavLink
                        to="/users"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Users size={20} />
                        <span>Users</span>
                    </NavLink>
                )}

                {hasPermission('Role Management') && (
                    <NavLink
                        to="/roles"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Shield size={20} />
                        <span>Roles</span>
                    </NavLink>
                )}

                {hasPermission('Centers Management') && (
                    <NavLink
                        to="/service-centers"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <MapPin size={20} />
                        <span>Centers</span>
                    </NavLink>
                )}
            </nav>
            {/* Logout moved to Profile Dropdown */}
        </aside>
    );
};

export default Sidebar;
