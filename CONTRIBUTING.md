# Contributing to the Elastic Email Send Email Action

Thanks for taking the time to contribute! This document explains how to report problems, suggest changes and submit pull requests.

## How the action is organized

The action is a small Node.js program. It isn't generated, so pull requests to any part of it are welcome.

- `action.yml`: the action's inputs, outputs and runtime (`node24`).
- `index.js`: the entry point that GitHub runs (through the bundle).
- `src/main.js`: reads the inputs, validates them, builds the request and sets the `message_id` output.
- `src/api.js`: the call to `POST /v4/emails/transactional` and its error handling.
- `src/templates.js`: the generated HTML and plain-text bodies.
- `src/utils.js`: input and recipient validation.
- `__tests__/`: Jest tests.
- `dist/`: the bundle built by `@vercel/ncc`. GitHub runs `dist/index.js`, so it's committed.

If you add or rename an input, update `action.yml`, `src/main.js` and the [README](README.md#inputs) inputs table together.

## Reporting bugs

Search [existing issues](https://github.com/ElasticEmail/elasticemail-send-email-action/issues) first. If nothing matches, open a new issue using the **Bug report** template and include:

- The version you're using (e.g. `ElasticEmail/elasticemail-send-email-action@v1.0.0`)
- The runner (e.g. `ubuntu-latest`, self-hosted)
- The step's `with:` block, with the API key removed
- The step's log output

**Never paste your API key** into an issue, log or code sample.

Questions about your Elastic Email account, sending limits, deliverability or billing aren't handled in this repository. The preferred way to get help is the **chat widget on [elasticemail.com](https://elasticemail.com)**.

Looking for sample code? See the [Elastic Email examples repository](https://github.com/ElasticEmail/elasticemail-examples).

## Suggesting features

Open an issue using the **Feature request** template. Describe the use case first and the solution second. It helps us decide whether the change belongs in the action, the API or the documentation.

## Security issues

Please do **not** report security vulnerabilities in public issues. See [SECURITY.md](SECURITY.md).

## Development setup

Requirements: [Node.js](https://nodejs.org/) 24 or later.

```bash
git clone https://github.com/ElasticEmail/elasticemail-send-email-action.git
cd elasticemail-send-email-action
npm ci
npm test
npm run build
```

`npm run build` rewrites `dist/`. Commit it together with your source change. CI rebuilds it and fails if the committed bundle is out of date.

To try a change against the real API, push it to a branch in your fork, add an `ELASTIC_EMAIL_API_KEY` secret and run the **Send test email** workflow from the Actions tab. [act](https://github.com/nektos/act) works too: `act workflow_dispatch -W .github/workflows/run-action.yml -s ELASTIC_EMAIL_API_KEY=...`.

Don't add new runtime dependencies without discussing it in an issue first. Everything in `dependencies` ends up in the bundle.

## Pull requests

1. Fork the repository and create a branch from `main` (`git checkout -b fix/short-description`).
2. Keep each change focused. One logical change per pull request.
3. Make sure `npm test` passes, add tests for new behavior, and commit the rebuilt `dist/`.
4. Update the [README](README.md) if you change inputs, outputs or behavior.
5. Open a pull request against `main` and fill in the template.

A maintainer will review your pull request and may ask for changes.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
