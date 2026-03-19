const core = require('@actions/core');
const { validateRecipients, validateRequiredInputs } = require('./utils');
const { generateEmailBody } = require('./templates');
const { sendTransactionalEmail } = require('./api');

/**
 * Core orchestration logic for the action.
 * Gathers inputs, validates them, and triggers the email sending process.
 */
async function run() {
    try {
        // 1. Gather Inputs
        const apiKey = core.getInput('api_key', { required: true });
        const to = core.getInput('to', { required: true });
        const subject = core.getInput('subject', { required: true });
        const status = core.getInput('status', { required: true });
        const bodyType = core.getInput('body_type') || 'HTML';
        const customBody = core.getInput('body');
        const fromEmail = core.getInput('from_email', { required: true });
        const fromName = core.getInput('from_name') || 'GitHub Actions';

        // 2. Validation
        validateRequiredInputs({ api_key: apiKey, to, subject, status, from_email: fromEmail });
        const recipients = validateRecipients(to);

        core.info(`Sending email to: ${recipients.join(', ')} (${recipients.length} recipient(s))`);
        core.info(`Workflow status: ${status}`);

        // 3. Prepare Content
        const emailBody = customBody.trim() ? customBody : generateEmailBody(status, bodyType);

        const payload = {
            Recipients: {
                To: recipients
            },
            Content: {
                Body: [
                    {
                        ContentType: bodyType,
                        Content: emailBody,
                        Charset: 'utf-8'
                    }
                ],
                Subject: subject,
                From: fromEmail
            }
        };

        if (fromName) {
            payload.Content.FromName = fromName;
        }

        // 4. Send Email
        core.info('Sending email via Elastic Email API v4...');
        const messageId = await sendTransactionalEmail(apiKey, payload);

        core.info(`Email sent. Transaction ID: ${messageId}`);
        core.setOutput('message_id', messageId);

        return messageId;

    } catch (error) {
        core.setFailed(error.message);
        throw error;
    }
}

module.exports = { run };
