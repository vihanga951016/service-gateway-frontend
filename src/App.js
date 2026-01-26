import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import ServiceProviderProfile from './pages/ServiceProviderProfile';
import UserProfile from './pages/UserProfile';
import Users from './pages/Users';
import Roles from './pages/Roles';
import ServiceCenters from './pages/ServiceCenters';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

// Simple protected route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="user-profile" element={<UserProfile />} />
            <Route path="service-provider-profile" element={<ServiceProviderProfile />} />
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<Roles />} />
            <Route path="service-centers" element={<ServiceCenters />} />
            {/* Settings route removed as it uses Modal now */}
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
