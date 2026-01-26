import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, MapPin, Building } from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h3>Service Gateway</h3>
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
                    to="/users"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Users size={20} />
                    <span>Users</span>
                </NavLink>
                <NavLink
                    to="/roles"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Shield size={20} />
                    <span>Roles</span>
                </NavLink>
                <NavLink
                    to="/service-centers"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <MapPin size={20} />
                    <span>Service Centers</span>
                </NavLink>
            </nav>
            {/* Logout moved to Profile Dropdown */}
        </aside>
    );
};

export default Sidebar;
