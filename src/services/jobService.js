import axios from 'axios';
import { getConfig } from '../config';

/**
 * Prepare a job to preview the timeline/schedule
 * @param {Object} jobData - The job details
 * @returns {Promise<Object>} Timeline data
 */
export const prepareJob = async (jobData) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/jobs/prepare`, jobData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to prepare job');
        }
    } catch (error) {
        console.error('Failed to prepare job:', error);
        throw error;
    }
};

/**
 * Create a new job
 * @param {Object} jobData - The job details
 * @returns {Promise<Object>} Created job data
 */
export const createJob = async (jobData) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/jobs/add`, jobData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to create job');
        }
    } catch (error) {
        console.error('Failed to create job:', error);
        throw error;
    }
};
/**
 * Remove a dummy job and customer entity
 * @param {string|number} jobId - The job ID
 * @param {string|number} customerId - The customer ID
 * @returns {Promise<Object>} Response data
 */
export const removeJobAndCustomer = async (jobId, customerId) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.delete(`${baseUrl}/jobs/${jobId}/remove/customer/${customerId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Failed to clean up dummy entities');
        }
    } catch (error) {
        console.error('Failed to clean up dummy entities:', error);
        throw error;
    }
};

/**
 * Get job schedule for a specific service center and date
 * @param {number} serviceCenter - Service center ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} List of scheduled jobs
 */
export const getJobSchedule = async (serviceCenter, date) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/jobs/schedule`, {
            serviceCenter,
            date
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch job schedule');
        }
    } catch (error) {
        console.error('Failed to fetch job schedule:', error);
        throw error;
    }
};
