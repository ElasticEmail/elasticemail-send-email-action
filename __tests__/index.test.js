const core = require('@actions/core');
const axios = require('axios');
const { run } = require('../src/main');
const { generateEmailBody } = require('../src/templates');

// Mock dependencies
jest.mock('@actions/core');
jest.mock('axios');

describe('Elastic Email GitHub Action - Modular Structure', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        // Set default environment variables
        process.env.GITHUB_REPOSITORY = 'user/repo';
        process.env.GITHUB_WORKFLOW = 'CI';
        process.env.GITHUB_RUN_ID = '123456';
        process.env.GITHUB_SERVER_URL = 'https://github.com';
        process.env.GITHUB_ACTOR = 'testuser';
        process.env.GITHUB_REF = 'refs/heads/main';
    });

    describe('Template Generation', () => {
        it('should generate HTML email body for success status', () => {
            const body = generateEmailBody('success', 'HTML');
            expect(body).toContain('SUCCESS');
            expect(body).toContain('user/repo');
            expect(body).toContain('#28a745');
        });

        it('should generate plain text email body', () => {
            const body = generateEmailBody('success', 'PlainText');
            expect(body).toContain('Workflow SUCCESS');
            expect(body).not.toContain('<html>');
        });
    });

    describe('Core Execution (run)', () => {
        beforeEach(() => {
            core.getInput.mockImplementation((name) => {
                const inputs = {
                    'api_key': 'test-api-key-123',
                    'to': 'recipient@example.com',
                    'subject': 'Test Notification',
                    'status': 'success',
                    'body_type': 'HTML',
                    'from_email': 'sender@example.com'
                };
                return inputs[name] || '';
            });

            axios.post.mockResolvedValue({
                data: { TransactionID: 'test-id-123' }
            });
        });

        it('should execute successfully with valid inputs', async () => {
            await run();

            expect(axios.post).toHaveBeenCalledWith(
                'https://api.elasticemail.com/v4/emails/transactional',
                expect.objectContaining({
                    Recipients: { To: ['recipient@example.com'] }
                }),
                expect.any(Object)
            );

            expect(core.info).toHaveBeenCalledWith('Email sent. Transaction ID: test-id-123');
            expect(core.setOutput).toHaveBeenCalledWith('message_id', 'test-id-123');
        });

        it('should handle multi-recipient list', async () => {
            core.getInput.mockImplementation((name) => {
                if (name === 'to') return 'alice@example.com, bob@example.com';
                const inputs = {
                    'api_key': 'key',
                    'subject': 'Sub',
                    'status': 'success',
                    'from_email': 'sender@example.com'
                };
                return inputs[name] || '';
            });

            await run();

            expect(axios.post).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    Recipients: { To: ['alice@example.com', 'bob@example.com'] }
                }),
                expect.any(Object)
            );
        });

        it('should fail if required inputs are missing', async () => {
            core.getInput.mockImplementation((name) => (name === 'api_key' ? '' : 'test'));

            await expect(run()).rejects.toThrow('Api key cannot be empty');
            expect(core.setFailed).toHaveBeenCalledWith('Api key cannot be empty');
        });

        it('should handle API authentication error (401)', async () => {
            axios.post.mockRejectedValue({
                response: {
                    status: 401,
                    data: { Error: 'Invalid key' }
                }
            });

            await expect(run()).rejects.toThrow('Invalid API key');
            expect(core.error).toHaveBeenCalled();
        });

        it('should handle network errors', async () => {
            axios.post.mockRejectedValue({
                request: {},
                message: 'Network error'
            });

            await expect(run()).rejects.toThrow('Network error: Unable to reach Elastic Email API');
        });
    });
});
