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
            throw new Error(response.data.message || 'Failed to update service center');
        }
    } catch (error) {
        console.error('Failed to update service center:', error);
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
