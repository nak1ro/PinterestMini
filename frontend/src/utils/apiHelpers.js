/**
 * Shared API helper functions
 */

import { parseApiError } from './parseApiError';
import { MULTIPART_FORM_DATA_HEADERS } from './apiConstants';

/**
 * Wraps an API call with consistent error handling
 * @param {Function} apiCall - The async API function to execute
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const withErrorHandling = async (apiCall) => {
    try {
        const response = await apiCall();
        const data = response?.data ?? response;
        return { success: true, data };
    } catch (err) {
        return { success: false, error: parseApiError(err) };
    }
};

/**
 * Creates headers for multipart form data requests
 * @returns {Object} Headers object
 */
export const getMultipartHeaders = () => MULTIPART_FORM_DATA_HEADERS;

/**
 * Validates a query string parameter
 * @param {any} query - The query to validate
 * @param {string} paramName - Name of the parameter for error messages
 * @throws {Error} If query is invalid
 */
export const validateQuery = (query, paramName = 'query') => {
    if (!query || typeof query !== 'string') {
        throw new Error(`Invalid ${paramName}: must be a non-empty string`);
    }
};

