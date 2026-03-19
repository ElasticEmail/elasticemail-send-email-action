# 📧 Elastic Email GitHub Action

[![Test](https://github.com/elasticemail/elastic-email-action/actions/workflows/test.yml/badge.svg)](https://github.com/elasticemail/elastic-email-action/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official GitHub Action for sending email notifications via **Elastic Email API v4** based on workflow outcomes.

## ✨ Features

- **Easy Integration** - Add email notifications to any workflow in minutes
- **Status-Based Emails** - Automatically format emails based on success/failure/cancelled status
- **Multiple Recipients** - Send notifications to multiple people at once using a comma-separated list
- **Beautiful HTML Templates** - Professional, responsive email templates out of the box
- **Fully Customizable** - Use custom email bodies or let the action generate them
- **Fast & Reliable** - Built on Node.js 20 with Elastic Email API v4
- **Tested** - Comprehensive test suite with 100% coverage

## 📋 Table of Contents

- [Setup](#-setup)
- [Usage](#-usage)
- [Inputs](#-inputs)
- [Outputs](#-outputs)
- [Examples](#-examples)
- [Local Testing](#-local-testing)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Setup

### 1. Get Your Elastic Email API Key

1. Sign up for a free account at [Elastic Email](https://elasticemail.com/)
2. Navigate to **Settings** → **API Keys**
3. Create a new API key with email sending permissions
4. Copy your API key

### 2. Add API Key to GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `ELASTIC_EMAIL_API_KEY`
5. Value: Paste your Elastic Email API key
6. Click **Add secret**

## 💻 Usage

### Basic Example - Notify on Failure

```yaml
name: CI with Email Notifications

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Run tests
        run: npm test
      
      - name: Send failure notification
        if: failure()
        uses: elasticemail/elastic-email-action@v1
        with:
          api_key: ${{ secrets.ELASTIC_EMAIL_API_KEY }}
          to: dev-team@example.com
          subject: '❌ Build Failed - ${{ github.repository }}'
          status: failure
```

### Advanced Example - Always Notify

```yaml
name: Deploy with Notifications

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy application
        id: deploy
        run: ./deploy.sh
      
      - name: Send deployment notification
        if: always()
        uses: elasticemail/elastic-email-action@v1
        with:
          api_key: ${{ secrets.ELASTIC_EMAIL_API_KEY }}
          to: team@example.com
          from_email: noreply@example.com
          from_name: Deployment Bot
          subject: 'Deployment ${{ job.status }} - ${{ github.repository }}'
          status: ${{ job.status }}
          body_type: HTML
```

### Custom Email Body Example

```yaml
- name: Send custom notification
  uses: elasticemail/elastic-email-action@v1
  with:
    api_key: ${{ secrets.ELASTIC_EMAIL_API_KEY }}
    to: notifications@example.com
    subject: Custom Alert
    status: success
    body_type: PlainText
    body: |
      Hello Team,
      
      The workflow "${{ github.workflow }}" has completed successfully!
      
      Repository: ${{ github.repository }}
      Triggered by: ${{ github.actor }}
      
      View details: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
```

## 📥 Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `api_key` | ✅ Yes | - | Your Elastic Email API key (use GitHub Secrets) |
| `to` | Yes | - | Recipient email address(es). For multiple recipients, use a comma-separated list |
| `subject` | Yes | - | Email subject line |
| `status` | ✅ Yes | - | Workflow status: `success`, `failure`, or `cancelled` |
| `body_type` | ❌ No | `HTML` | Email format: `HTML` or `PlainText` |
| `body` | ❌ No | Auto-generated | Custom email body content |
| `from_email` | ❌ No | Same as `to` | Sender email (must be verified in Elastic Email) |
| `from_name` | ❌ No | `GitHub Actions` | Sender display name |

## 📤 Outputs

| Output | Description |
|--------|-------------|
| `message_id` | Elastic Email transaction ID for the sent email |

### Using Outputs

```yaml
- name: Send email
  id: send_email
  uses: elasticemail/elastic-email-action@v1
  with:
    api_key: ${{ secrets.ELASTIC_EMAIL_API_KEY }}
    to: user@example.com
    subject: Test
    status: success

- name: Display message ID
  run: echo "Email sent with ID: ${{ steps.send_email.outputs.message_id }}"
```

## 🎯 Examples

### Notify on Success Only

```yaml
- name: Success notification
  if: success()
  uses: elasticemail/elastic-email-action@v1
  with:
    api_key: ${{ secrets.ELASTIC_EMAIL_API_KEY }}
    to: success@example.com
    subject: '✅ Workflow Succeeded'
    status: success
```

### Notify on Failure Only

```yaml
- name: Failure notification
  if: failure()
  uses: elasticemail/elastic-email-action@v1
  with:
    api_key: ${{ secrets.ELASTIC_EMAIL_API_KEY }}
    to: alerts@example.com
    subject: '❌ Workflow Failed - Immediate Action Required'
    status: failure
```

### Notify Multiple Recipients

```yaml
- name: Multi-recipient notification
  if: always()
  uses: elasticemail/elastic-email-action@v1
  with:
    api_key: ${{ secrets.ELASTIC_EMAIL_API_KEY }}
    to: team@example.com, manager@example.com
    subject: 'Build Status: ${{ job.status }}'
    status: ${{ job.status }}
```

## 🧪 Local Testing

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [act CLI](https://github.com/nektos/act) (for local workflow testing)

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Build the Action

```bash
npm run build
```

This creates a bundled `dist/index.js` file using `@vercel/ncc`.

### Test Locally with act

1. Create a test workflow file `.act/test-workflow.yml`:

```yaml
name: Test Email Action

on: push

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Test email action
        uses: ./
        with:
          api_key: ${{ secrets.ELASTIC_EMAIL_API_KEY }}
          to: test@example.com
          subject: Test Email
          status: success
```

2. Run with act:

```bash
# Run without secrets (dry run)
act -W .act/test-workflow.yml

# Run with real API key
act -W .act/test-workflow.yml -s ELASTIC_EMAIL_API_KEY=your-api-key-here
```

## 🔧 Troubleshooting

### "Invalid API key" Error

**Problem:** The action returns a 401 error.

**Solution:**
- Verify your API key is correct in GitHub Secrets
- Ensure the API key has email sending permissions
- Check if the API key hasn't expired

### "Invalid recipient email format" Error

**Problem:** Email address validation fails.

**Solution:**
- Ensure the `to` field contains a valid email address
- Check for typos or extra spaces
- For multiple recipients, use comma separation: `email1@example.com, email2@example.com`

### "From email not verified" Error

**Problem:** Elastic Email rejects the sender address.

**Solution:**
- Verify your sender email in Elastic Email dashboard
- Don't specify `from_email` to use the recipient address as sender
- Use a verified domain for sending

### Email Not Received

**Problem:** The action succeeds but email isn't received.

**Solution:**
- Check your spam/junk folder
- Verify the recipient email address is correct
- Check Elastic Email dashboard for delivery status using the `message_id` output
- Ensure your Elastic Email account has sufficient credits

### Build Fails in CI

**Problem:** GitHub Actions workflow fails during build verification.

**Solution:**
- Run `npm run build` locally
- Commit the updated `dist/index.js` file
- Push changes to your repository

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Build: `npm run build`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Resources

- [Elastic Email Documentation](https://elasticemail.com/developers)
- [Elastic Email API v4 Reference](https://elasticemail.com/developers/api-documentation)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Creating GitHub Actions](https://docs.github.com/en/actions/creating-actions)

## 💬 Support

- Email: support@elasticemail.com
- [Elastic Email Help Center](https://help.elasticemail.com/)
- 🐛 [Report Issues](https://github.com/elasticemail/elastic-email-action/issues)

---

Made with ❤️ by [Elastic Email](https://elasticemail.com/)
