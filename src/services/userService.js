import axios from 'axios';
import { getConfig } from '../config';

/**
 * Fetch user header data (name, email, userType) for display in the header dropdown
 * @returns {Promise<Object>} User header data
 */
export const getUserHeaderData = async () => {
    try {
        const baseUrl = getConfig().baseUrl;
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(`${baseUrl}/user/header-data`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch user header data:', error);
        throw error;
    }
};
