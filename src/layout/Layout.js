import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

import { UserProvider } from '../context/UserContext';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <UserProvider>
            <div className="app-layout">
                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div className="sidebar-overlay" onClick={closeSidebar}></div>
                )}
                
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                
                <div className="main-content">
                    <Header toggleSidebar={toggleSidebar} />
                    <main className="page-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </UserProvider>
    );
};

export default Layout;
