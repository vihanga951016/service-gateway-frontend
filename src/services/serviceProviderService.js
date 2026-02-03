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

export const getNonAssignedServicesToPoint = async (centerId) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/services/not-assign-to-point/${centerId}`, {
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
