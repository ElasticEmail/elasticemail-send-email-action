/**
 * Validates one or more email addresses.
 * @param {string} to - Comma-separated email addresses.
 * @returns {string[]} An array of validated and trimmed email addresses.
 * @throws {Error} If recipients are empty or any email format is invalid.
 */
function validateRecipients(to) {
    if (!to || !to.trim()) {
        throw new Error('Recipient email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const recipients = to
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);

    if (recipients.length === 0) {
        throw new Error('Recipient email cannot be empty');
    }

    for (const recipient of recipients) {
        if (!emailRegex.test(recipient)) {
            throw new Error(`Invalid recipient email format: ${recipient}`);
        }
    }

    return recipients;
}

/**
 * Validates required string inputs.
 * @param {Object} inputs - Key-value pairs of inputs to validate.
 * @throws {Error} If any required input is empty.
 */
function validateRequiredInputs(inputs) {
    for (const [key, value] of Object.entries(inputs)) {
        if (!value || !value.trim()) {
            const label = key.replace(/_/g, ' ');
            throw new Error(`${label.charAt(0).toUpperCase() + label.slice(1)} cannot be empty`);
        }
    }
}

module.exports = {
    validateRecipients,
    validateRequiredInputs
};
