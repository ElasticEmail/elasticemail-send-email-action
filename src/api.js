const axios = require('axios');
const core = require('@actions/core');

const ELASTIC_EMAIL_API_URL = 'https://api.elasticemail.com/v4/emails/transactional';

/**
 * Sends a transactional email via Elastic Email API v4.
 * @param {string} apiKey - Elastic Email API key.
 * @param {Object} payload - API request payload.
 * @returns {Promise<string>} The transaction ID.
 * @throws {Error} If the API request fails.
 */
async function sendTransactionalEmail(apiKey, payload) {
    try {
        const response = await axios.post(
            ELASTIC_EMAIL_API_URL,
            payload,
            {
                headers: {
                    'X-ElasticEmail-ApiKey': apiKey,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        return response.data.TransactionID || response.data.MessageID || 'unknown';
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Handles API-specific error transformation.
 * @param {Error} error - The axios error object.
 * @throws {Error} A formatted error message.
 */
function handleApiError(error) {
    if (error.response) {
        const statusCode = error.response.status;
        const errorData = error.response.data;

        core.error(`Elastic Email API error (${statusCode}): ${JSON.stringify(errorData, null, 2)}`);

        if (statusCode === 401) {
            throw new Error('Invalid API key. Please check your ELASTIC_EMAIL_API_KEY secret.');
        }

        if (statusCode === 400) {
            throw new Error(`Bad request: ${JSON.stringify(errorData)}`);
        }

        throw new Error(`API error (${statusCode}): ${JSON.stringify(errorData)}`);
    }

    if (error.request) {
        core.error('No response from Elastic Email API');
        throw new Error('Network error: Unable to reach Elastic Email API. Check your internet connection.');
    }

    core.error(`Error: ${error.message}`);
    throw error;
}

module.exports = {
    sendTransactionalEmail
};
