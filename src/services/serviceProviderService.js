import axios from 'axios';
import { getConfig } from '../config';

/**
 * Fetch service provider profile details
 * @returns {Promise<Object>} Provider profile data
 */
export const getServiceProviderProfile = async () => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/service-provider/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch provider profile');
        }
    } catch (error) {
        console.error('Failed to fetch provider profile:', error);
        throw error;
    }
};

/**
 * Update service provider profile details
 * @param {Object} providerData - The data to update
 * @returns {Promise<Object>} Response data
 */
export const updateServiceProviderProfile = async (providerData) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/service-provider/edit`, providerData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to update provider profile:', error);
        throw error;
    }
};

/**
 * Fetch all service centers
 * @returns {Promise<Array>} List of service centers
 */
export const getAllServiceCenters = async () => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/service-provider/service-centers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch service centers');
        }
    } catch (error) {
        console.error('Failed to fetch service centers:', error);
        throw error;
    }
};

/**
 * Fetch services for dropdown
 * @returns {Promise<Array>} List of services
 */
export const getServicesDropdown = async () => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/services/dropdown`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            // Fallback for mock/dummy if data is directly in response.data
            return Array.isArray(response.data) ? response.data : (response.data.data || []);
        }
    } catch (error) {
        console.error('Failed to fetch services dropdown:', error);
        throw error;
    }
};

/**
 * Add a new service center
 * @param {Object} centerData - The center data to add
 * @returns {Promise<Object>} Response data
 */
export const addServiceCenter = async (centerData) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/service-center/add`, centerData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to add service center');
        }
    } catch (error) {
        console.error('Failed to add service center:', error);
        throw error;
    }
};

/**
 * Fetch service centers with pagination and search
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Page size
 * @param {string} searchText - Search query
 * @returns {Promise<Object>} Paginated service centers
 */
export const getServiceCenters = async (page, size, searchText) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/service-center/get-all`, {
            page,
            size,
            searchText
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch service centers');
        }
    } catch (error) {
        console.error('Failed to fetch service centers:', error);
        throw error;
    }
};

/**
 * Update an existing service center
 * @param {Object} centerData - The center data to update
 * @returns {Promise<Object>} Response data
 */
export const updateServiceCenter = async (centerData) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/service-center/update`, centerData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to update service center');
        }
    } catch (error) {
        console.error('Failed to update service center:', error);
        throw error;
    }
};

export const deleteServiceCenter = async (id) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.delete(`${baseUrl}/service-center/${id}/delete`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to delete service center');
        }
    } catch (error) {
        console.error('Failed to delete service center:', error);
        throw error;
    }
};

/**
 * Fetch a single service center by ID
 * @param {number|string} id - Service center ID
 * @returns {Promise<Object>} Service center data
 */
export const getServiceCenterById = async (id) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/service-center/${id}/get`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch service center details');
        }
    } catch (error) {
        console.error('Failed to fetch service center details:', error);
        throw error;
    }
};

/**
 * Fetch employees assigned to a service center
 * @param {number|string} centerId - Service center ID
 * @returns {Promise<Array>} List of employees
 */
export const getEmployeesByCenterId = async (centerId) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/user/center/${centerId}/get`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch assigned employees');
        }
    } catch (error) {
        console.error('Failed to fetch assigned employees:', error);
        throw error;
    }
};

/**
 * Fetch summarized service centers for the profile page
 * @returns {Promise<Array>} List of summarized service centers
 */
export const getSummarizedServiceCenters = async () => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/service-center/summarized`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch summarized service centers');
        }
    } catch (error) {
        console.error('Failed to fetch summarized service centers:', error);
        throw error;
    }
};

/**
 * Fetch services with pagination, search, and sorting
 * @param {Object} params - Request parameters { page, size, searchText, sort }
 * @returns {Promise<Object>} Paginated services
 */
export const getServices = async (params) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        const response = await axios.post(`${baseUrl}/services/get-all`, params, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch services');
        }
    } catch (error) {
        console.error('Failed to fetch services:', error);
        throw error;
    }
};

/**
 * Add a new service
 * @param {Object} serviceData - The service data to add
 * @returns {Promise<Object>} Response data
 */
export const addService = async (serviceData) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        const response = await axios.post(`${baseUrl}/services/add`, serviceData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to add service:', error);
        throw error;
    }
};

/**
 * Update an existing service
 * @param {Object} serviceData - The service data to update
 * @returns {Promise<Object>} Response data
 */
export const updateService = async (serviceData) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        const response = await axios.post(`${baseUrl}/services/update`, serviceData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to update service:', error);
        throw error;
    }
};

/**
 * Delete a service
 * @param {number} id - Service ID
 * @returns {Promise<Object>} Response data
 */
export const deleteService = async (id) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        const response = await axios.delete(`${baseUrl}/services/${id}/delete`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to delete service:', error);
        throw error;
    }
};
/**
 * Fetch users not assigned to a specific service center
 * @param {number|string} centerId - Service center ID
 * @returns {Promise<Array>} List of non-assigned users
 */
export const getNonAssignedUsers = async (centerId) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/user/center/${centerId}/get-non-assign`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch non-assigned users');
        }
    } catch (error) {
        console.error('Failed to fetch non-assigned users:', error);
        throw error;
    }
};

/**
 * Assign a user to a service center
 * @param {number|string} centerId - Service center ID
 * @param {number|string} userId - User ID
 * @returns {Promise<Object>} Response data
 */
export const assignUserToCenter = async (centerId, userId) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/user/assign-to-center`, {
            centerId: parseInt(centerId),
            employeeId: parseInt(userId)
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to assign user');
        }
    } catch (error) {
        console.error('Failed to assign user:', error);
        throw error;
    }
};
export const removeUserFromCenter = async (userId) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.put(`${baseUrl}/user/${userId}/remove-from-center`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Failed to remove user from center');
        }
    } catch (error) {
        console.error('Failed to remove user from center:', error);
        throw error;
    }
};

export const getServicePointsByCenterId = async (centerId) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/service-points/service-center/${centerId}/get-all`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch service points');
        }
    } catch (error) {
        console.error('Failed to fetch service points:', error);
        throw error;
    }
};

export const addServicePoint = async (pointData) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/service-points/add`, pointData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Failed to add service point');
        }
    } catch (error) {
        console.error('Failed to add service point:', error);
        throw error;
    }
};

export const updateServicePoint = async (pointData) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/service-points/update`, pointData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Failed to update service point');
        }
    } catch (error) {
        console.error('Failed to update service point:', error);
        throw error;
    }
};

export const deleteServicePoint = async (pointId) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.delete(`${baseUrl}/service-points/${pointId}/delete`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Failed to delete service point');
        }
    } catch (error) {
        console.error('Failed to delete service point:', error);
        throw error;
    }
};

/**
 * Fetch available points for a service in a center
 * @param {Object} data - { centerId, serviceId }
 * @returns {Promise<Array>} List of available points
 */
export const getAvailablePoints = async (data) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/services/available-points`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch available points');
        }
    } catch (error) {
        console.error('Failed to fetch available points:', error);
        throw error;
    }
};

/**
 * Fetch available services for a specific service point
 * @param {number} pointId - The service point ID
 * @returns {Promise<Array>} List of available services
 */
export const getAvailableServicesForPoint = async (pointId) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/services/available/point/${pointId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch available services');
        }
    } catch (error) {
        console.error('Failed to fetch available services for point:', error);
        throw error;
    }
};

/**
 * Fetch assigned services for a specific service point
 * @param {number} pointId - The service point ID
 * @returns {Promise<Array>} List of assigned services
 */
export const getAssignedServicesForPoint = async (pointId) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/services/assigned/point/${pointId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch assigned services');
        }
    } catch (error) {
        console.error('Failed to fetch assigned services for point:', error);
        throw error;
    }
};

/**
 * Assign a service to a service point
 * @param {number} serviceId - The service ID
 * @param {number} pointId - The service point ID
 * @returns {Promise<Object>} Response data
 */
export const assignServiceToPoint = async (serviceId, pointId) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/services/assign-to-point`, {
            serviceId: parseInt(serviceId),
            pointId: parseInt(pointId)
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Failed to assign service to point');
        }
    } catch (error) {
        console.error('Failed to assign service to point:', error);
        throw error;
    }
};

/**
 * Unassign a service from a service point
 * @param {number} serviceId - The service ID
 * @param {number} pointId - The service point ID
 * @returns {Promise<Object>} Response data
 */
export const unassignServiceFromPoint = async (serviceId, pointId) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/services/remove-from-point`, {
            serviceId: parseInt(serviceId),
            pointId: parseInt(pointId)
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Failed to unassign service from point');
        }
    } catch (error) {
        console.error('Failed to unassign service from point:', error);
        throw error;
    }
};
/**
 * Get assigned points for a service
 * @param {number} serviceId - The service ID
 * @returns {Promise<Array>} List of assigned points
 */
export const getAssignedPointsForService = async (serviceId) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/services/${serviceId}/assigned-points`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch assigned points');
        }
    } catch (error) {
        console.error('Failed to fetch assigned points:', error);
        throw error;
    }
};

/**
 * Add a new cluster
 * @param {Object} clusterData - { id, name, serviceIds }
 * @returns {Promise<Object>} Response data
 */
export const addCluster = async (clusterData) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/clusters/add`, clusterData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to add cluster');
        }
    } catch (error) {
        console.error('Failed to add cluster:', error);
        throw error;
    }
};

/**
 * Fetch all clusters
 * @returns {Promise<Array>} List of clusters with services
 */
export const getClusters = async () => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/clusters/get-all`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            // Handle if data is returned directly as array
            return Array.isArray(response.data) ? response.data : (response.data.data || []);
        }
    } catch (error) {
        console.error('Failed to fetch clusters:', error);
        throw error;
    }
};

/**
 * Update an existing cluster
 * @param {Object} clusterData - { id, name, serviceIds }
 * @returns {Promise<Object>} Response data
 */
export const updateCluster = async (clusterData) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/clusters/update`, clusterData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to update cluster');
        }
    } catch (error) {
        console.error('Failed to update cluster:', error);
        throw error;
    }
};
/**
 * Delete a cluster
 * @param {number|string} id - Cluster ID
 * @returns {Promise<Object>} Response data
 */
export const deleteCluster = async (id) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.delete(`${baseUrl}/clusters/${id}/delete`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Failed to delete cluster');
        }
    } catch (error) {
        console.error('Failed to delete cluster:', error);
        throw error;
    }
};

/**
 * Assign a cluster to a service center
 * @param {number|string} clusterId - Cluster ID
 * @param {number|string} centerId - Service center ID
 * @returns {Promise<Object>} Response data
 */
export const assignClusterToCenter = async (clusterId, centerId) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/clusters/assign-to-center`, {
            clusterId: parseInt(clusterId),
            centerId: parseInt(centerId)
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to assign cluster:', error);
        throw error;
    }
};

/**
 * Remove a cluster from a service center
 * @param {number|string} clusterId - Cluster ID
 * @param {number|string} centerId - Service center ID
 * @returns {Promise<Object>} Response data
 */
export const removeClusterFromCenter = async (clusterId, centerId) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.delete(`${baseUrl}/clusters/${clusterId}/remove-from-center/${centerId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to remove cluster:', error);
        throw error;
    }
};
