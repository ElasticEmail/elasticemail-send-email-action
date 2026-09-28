# Security Policy

## Supported versions

Security fixes are released for the latest [release](https://github.com/ElasticEmail/send-email-action/releases) of this action and published under the `v1` tag. Please update to the latest version before reporting an issue.

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Report them privately by one of these methods:

- [GitHub private vulnerability reporting](https://github.com/ElasticEmail/send-email-action/security/advisories/new)
- Email **integrations@elasticemail.com** with the subject `Security: send-email-action`

Please include:

- A description of the issue and its impact
- Steps to reproduce, or a proof of concept
- The affected version or commit

We will acknowledge your report, investigate, and keep you updated on the fix. Please give us reasonable time to release a fix before disclosing the issue publicly.

## Using the action safely

- Pass the API key from a [GitHub secret](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions), never as plain text in a workflow.
- Give the key only the access it needs. **Send HTTP** is enough for this action.
- Be careful with untrusted text (issue titles, PR bodies, commit messages) in `subject` or `body`. It goes into an email that people will read, so it can carry phishing links.
- For the strongest supply-chain guarantee, pin the action to a full commit SHA instead of `@v1`.

## API key safety

If you think an API key has been exposed (in a commit, log, issue or screenshot), revoke it right away in your [Elastic Email API settings](https://app.elasticemail.com/marketing/settings/new/manage-api) and create a new one.
