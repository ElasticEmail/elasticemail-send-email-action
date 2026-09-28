<div align="center">

<img src=".github/ee-logo.png" alt="Elastic Email" width="96" />

# Elastic Email Send Email Action

The official GitHub Action for sending email notifications from your workflows through the [Elastic Email](https://elasticemail.com) REST API v4.

[![GitHub Action](https://img.shields.io/badge/GitHub%20Action-send--email--action-2088FF?logo=githubactions&logoColor=white)](action.yml)
[![Node.js](https://img.shields.io/badge/runtime-node24-339933?logo=nodedotjs&logoColor=white)](action.yml)
[![API](https://img.shields.io/badge/API-v4-0A7BBB)](https://elasticemail.com/developers/api-documentation/rest-api)
[![Test](https://github.com/ElasticEmail/send-email-action/actions/workflows/test.yml/badge.svg)](https://github.com/ElasticEmail/send-email-action/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/github/license/ElasticEmail/send-email-action?color=yellow)](LICENSE)

[![Latest release](https://img.shields.io/github/v/release/ElasticEmail/send-email-action?logo=github&label=release)](https://github.com/ElasticEmail/send-email-action/releases)
[![Last commit](https://img.shields.io/github/last-commit/ElasticEmail/send-email-action?logo=github)](https://github.com/ElasticEmail/send-email-action/commits/main)
[![Open issues](https://img.shields.io/github/issues/ElasticEmail/send-email-action?logo=github)](https://github.com/ElasticEmail/send-email-action/issues)
[![GitHub stars](https://img.shields.io/github/stars/ElasticEmail/send-email-action?style=flat&logo=github)](https://github.com/ElasticEmail/send-email-action/stargazers)

[Setup](#setup) •
[Quick start](#quick-start) •
[Inputs](#inputs) •
[Examples](#more-examples) •
[Contributing](#contributing)

</div>

---

## Features

- **Workflow notifications.** Email your team when a build, test or deploy succeeds, fails or is cancelled.
- **Ready-made templates.** If you don't pass a body, the action writes one for you, in HTML or plain text, with the repository, workflow, actor, ref and a link to the run.
- **Custom content.** Pass your own `body` in HTML or plain text, with any `${{ }}` expressions you need.
- **Multiple recipients.** Send to a comma-separated list of addresses in one step.
- **Transaction ID output.** The action sets `message_id`, so you can look up delivery in your Elastic Email dashboard or use it in later steps.
- **No extra setup.** It runs on the `node24` runtime from a bundled `dist/`. There's no Docker image and no install step.

## Requirements

| Requirement | Details |
| --- | --- |
| Runner | Any GitHub-hosted or self-hosted runner that supports `node24` actions |
| Elastic Email account | An API key with **Send HTTP** access |
| Sender | A `from_email` on a domain you've [verified in Elastic Email](https://help.elasticemail.com/en/articles/4934400-how-to-verify-your-domain) |

## Setup

### 1. Create an API key

In your Elastic Email account, open [API settings](https://app.elasticemail.com/marketing/settings/new/manage-api) and create a key. For this action it only needs **Send HTTP** access.

### 2. Store it as a GitHub secret

In your repository, go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**, name it `ELASTIC_EMAIL_API_KEY` and paste the key.

> [!TIP]
> Keep the key in secrets only. Never write it into a workflow file, a `body` or a log line.

## Quick start

### Notify on failure

```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run tests
        run: npm test

      - name: Email the team if the build fails
        if: failure()
        uses: ElasticEmail/send-email-action@v1
        with:
          api_key: ${{ secrets.ELASTIC_EMAIL_API_KEY }}
          from_email: ci@yourdomain.com
          to: dev-team@yourdomain.com
          subject: "❌ Build failed: ${{ github.repository }}"
          status: failure
```

### Always notify, with the job's real status

```yaml
      - name: Deployment notification
        if: always()
        uses: ElasticEmail/send-email-action@v1
        with:
          api_key: ${{ secrets.ELASTIC_EMAIL_API_KEY }}
          from_email: deploy@yourdomain.com
          from_name: Deployment Bot
          to: team@yourdomain.com, manager@yourdomain.com
          subject: "Deployment ${{ job.status }}: ${{ github.repository }}"
          status: ${{ job.status }}
```

### Custom body

```yaml
      - name: Custom notification
        uses: ElasticEmail/send-email-action@v1
        with:
          api_key: ${{ secrets.ELASTIC_EMAIL_API_KEY }}
          from_email: ci@yourdomain.com
          to: notifications@yourdomain.com
          subject: Release ${{ github.ref_name }} published
          status: success
          body_type: PlainText
          body: |
            Hello team,

            "${{ github.workflow }}" finished for ${{ github.repository }}.
            Triggered by: ${{ github.actor }}

            Run: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
```

### Use the transaction ID

```yaml
      - name: Send email
        id: email
        uses: ElasticEmail/send-email-action@v1
        with:
          api_key: ${{ secrets.ELASTIC_EMAIL_API_KEY }}
          from_email: ci@yourdomain.com
          to: user@yourdomain.com
          subject: Test
          status: success

      - name: Print transaction ID
        env:
          MESSAGE_ID: ${{ steps.email.outputs.message_id }}
        run: echo "Sent, transaction ID $MESSAGE_ID"
```

## Inputs

| Input | Required | Default | Description |
| --- | --- | --- | --- |
| `api_key` | ✅ | | Elastic Email API key. Pass it from a secret. |
| `from_email` | ✅ | | Sender address. Its domain must be verified in your Elastic Email account. |
| `to` | ✅ | | Recipient address, or a comma-separated list. |
| `subject` | ✅ | | Email subject line. |
| `status` | ✅ | | Workflow status: `success`, `failure` or `cancelled`. Sets the colour and label of the generated template. `${{ job.status }}` works. |
| `body_type` | | `HTML` | `HTML` or `PlainText`. |
| `body` | | generated | Your own email body. If empty, the action generates one from `status` and the run's context. |
| `from_name` | | `GitHub Actions` | Sender display name. |

## Outputs

| Output | Description |
| --- | --- |
| `message_id` | The Elastic Email transaction ID of the sent email. |

## More examples

More complete, runnable samples are in the **[Elastic Email examples repository](https://github.com/ElasticEmail/elasticemail-examples)**. It covers transactional email, SMTP, webhooks, inbound email, contacts and serverless platforms across 20+ languages and frameworks.

- 🟢 [Node.js examples](https://github.com/ElasticEmail/elasticemail-examples/tree/main/nodejs-elasticemail-examples)
- 📨 [Email template examples](https://github.com/ElasticEmail/elasticemail-examples/tree/main/email-templates-elasticemail-examples)
- 📂 [All examples](https://github.com/ElasticEmail/elasticemail-examples)

<details>
<summary><strong>More workflow snippets</strong></summary>

| Scenario | Condition | `status` |
| --- | --- | --- |
| Success only | `if: success()` | `success` |
| Failure only | `if: failure()` | `failure` |
| Cancelled runs | `if: cancelled()` | `cancelled` |
| Every run | `if: always()` | `${{ job.status }}` |

```yaml
      - name: Notify on cancel
        if: cancelled()
        uses: ElasticEmail/send-email-action@v1
        with:
          api_key: ${{ secrets.ELASTIC_EMAIL_API_KEY }}
          from_email: ci@yourdomain.com
          to: alerts@yourdomain.com
          subject: "⚠️ Workflow cancelled: ${{ github.workflow }}"
          status: cancelled
```

</details>

## Authentication

| Header | Sent by | Used for |
| --- | --- | --- |
| `X-ElasticEmail-ApiKey` | The action, on its one API call | Your `api_key` input, sent to `POST /v4/emails/transactional` |

GitHub masks secrets in logs, and the action never prints the key.

## API limits

The action sends one request to the Elastic Email API v4 per step, with a **30 second** timeout. Your account's sending limits and the API's limits apply:

- Up to **20 concurrent connections** per account
- A hard timeout of **600 seconds** per request on the API side

## Troubleshooting

<details>
<summary><strong>"Bad request: APIKey Expired" or "Invalid API key"</strong></summary>

The API didn't accept the key. Check that the `ELASTIC_EMAIL_API_KEY` secret holds the full key, that the key hasn't been revoked or expired, and that it has **Send HTTP** access. Secrets aren't passed to workflows triggered from forks.

</details>

<details>
<summary><strong>"Invalid recipient email format"</strong></summary>

One of the addresses in `to` isn't valid. Check for typos, and separate multiple addresses with commas: `a@example.com, b@example.com`.

</details>

<details>
<summary><strong>The sender is rejected</strong></summary>

`from_email` must use a domain you've verified in Elastic Email. Verify the domain or pick an address on one that is.

</details>

<details>
<summary><strong>The step succeeds but no email arrives</strong></summary>

Check the spam folder, then look up the `message_id` in your Elastic Email dashboard to see its delivery status. Make sure your account has credits left.

</details>

## Development

```bash
npm ci
npm test               # Jest
npm run test:coverage  # coverage report in coverage/
npm run build          # bundles index.js into dist/ with @vercel/ncc
```

GitHub runs `dist/index.js` directly, so commit the rebuilt `dist/` with every source change. CI fails if it's out of date. To try the action against the real API, run the **Send test email** workflow from the Actions tab. It needs the `ELASTIC_EMAIL_API_KEY` secret.

## Versioning

Releases follow [semantic versioning](https://semver.org) and are listed in [GitHub Releases](https://github.com/ElasticEmail/send-email-action/releases). Pin `@v1` to get fixes and features within the major version, or pin an exact tag such as `@v1.0.0`.

<details>
<summary>Build details</summary>

- API version: 4.0.0 (`POST /v4/emails/transactional`)
- Action runtime: `node24`
- Dependencies: `@actions/core`, `axios`
- Bundler: `@vercel/ncc`

</details>

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

- 🐛 [Report a bug](https://github.com/ElasticEmail/send-email-action/issues/new?template=bug_report.md)
- 💡 [Request a feature](https://github.com/ElasticEmail/send-email-action/issues/new?template=feature_request.md)
- 🔒 [Report a security issue](SECURITY.md)

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

## Support

> [!IMPORTANT]
> The fastest way to get help is the **chat widget on [elasticemail.com](https://elasticemail.com)**. Our support team can help with your account, sending, deliverability and API questions.

- 💬 [Chat with support on elasticemail.com](https://elasticemail.com) (preferred)
- 📚 [API documentation](https://elasticemail.com/developers/api-documentation/rest-api)
- 🧪 [Examples repository](https://github.com/ElasticEmail/elasticemail-examples)
- 🐛 [GitHub issues](https://github.com/ElasticEmail/send-email-action/issues), for bugs in this action only

## License

Released under the [MIT License](LICENSE). Copyright © 2025–2026 Elastic Email.
