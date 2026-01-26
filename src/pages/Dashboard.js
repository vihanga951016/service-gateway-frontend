import React from 'react';

const Dashboard = () => {
    return (
        <div className="page-container">
            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-value">1,234</p>
                </div>
                <div className="stat-card">
                    <h3>Active Roles</h3>
                    <p className="stat-value">12</p>
                </div>
                <div className="stat-card">
                    <h3>Service Centers</h3>
                    <p className="stat-value">45</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
