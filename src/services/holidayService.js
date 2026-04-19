import axios from 'axios';
import { getConfig } from '../config';

/**
 * Fetch all holiday dates
 * @returns {Promise<string[]>} List of holiday dates in YYYY-MM-DD format
 */
export const getAllHolidays = async () => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/holiday/get-all`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // The user mentioned response is List<LocalDate> which usually comes wrapped in a data field in this API
        return response.data.data || [];
    } catch (error) {
        console.error('Failed to fetch holidays:', error);
        throw error;
    }
};

/**
 * Add a new holiday
 * @param {Object} holidayData - The holiday data
 * @param {string} holidayData.name - The holiday name
 * @param {string} holidayData.holiday - The holiday date in YYYY-MM-DD format
 * @returns {Promise<Object>} The response from the server
 */
export const addHoliday = async (holidayData) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/holiday/add`,
            holidayData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Failed to add holiday:', error);
        throw error;
    }
};

/**
 * Add or update common holidays (recurring weekdays)
 * @param {Object} commonHolidayData - Object with lowercase boolean flags for each weekday (e.g., { sunday: true, monday: false, ... })
 * @returns {Promise<Object>} The response from the server
 */
export const addCommonHolidays = async (commonHolidayData) => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(`${baseUrl}/holiday/common/add`,
            commonHolidayData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Failed to add common holidays:', error);
        throw error;
    }
};

/**
 * Fetch common holidays (recurring weekdays)
 * @returns {Promise<Object>} The common holiday data
 */
export const getCommonHolidays = async () => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/holiday/common`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch common holidays:', error);
        throw error;
    }
};
