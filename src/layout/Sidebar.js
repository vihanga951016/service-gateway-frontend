import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, MapPin, Briefcase, ClipboardList, Layers, Calendar } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Sidebar = () => {
    const { hasPermission, loading } = useUser();

    if (loading) {
        return (
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src="/logo512.png" alt="Service Gateway Logo" className="sidebar-logo" />
                </div>
                <div className="sidebar-nav" style={{ padding: '20px', textAlign: 'center' }}>
                    Loading...
                </div>
            </aside>
        );
    }

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

                <NavLink
                    to="/jobs"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <ClipboardList size={20} />
                    <span>Jobs</span>
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

                {hasPermission('Services Management') && (
                    <NavLink
                        to="/services"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Briefcase size={20} />
                        <span>Services</span>
                    </NavLink>
                )}

                {hasPermission('Cluster Management') && (
                    <NavLink
                        to="/clusters"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Layers size={20} />
                        <span>Clusters</span>
                    </NavLink>
                )}

                {hasPermission('Holiday Management') && (
                    <NavLink
                        to="/calendar"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Calendar size={20} />
                        <span>Calendar</span>
                    </NavLink>
                )}

            </nav>
            {/* Logout moved to Profile Dropdown */}
        </aside>
    );
};

export default Sidebar;
