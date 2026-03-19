/**
 * Generates an email body based on workflow status.
 * @param {string} status - Workflow status: success, failure, or cancelled.
 * @param {string} bodyType - Content type: HTML or PlainText.
 * @returns {string} The generated email body.
 */
function generateEmailBody(status, bodyType) {
    const repository = process.env.GITHUB_REPOSITORY || 'Unknown Repository';
    const workflow = process.env.GITHUB_WORKFLOW || 'Unknown Workflow';
    const runId = process.env.GITHUB_RUN_ID || 'Unknown';
    const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';
    const runUrl = `${serverUrl}/${repository}/actions/runs/${runId}`;
    const actor = process.env.GITHUB_ACTOR || 'Unknown User';
    const ref = process.env.GITHUB_REF || 'Unknown Branch';

    const statusColor = {
        success: '#28a745',
        failure: '#d73a49',
        cancelled: '#ffc107'
    };

    const color = statusColor[status.toLowerCase()] || '#6c757d';
    const statusLabel = status.toUpperCase();

    if (bodyType.toLowerCase() === 'html') {
        return getHtmlTemplate({
            statusLabel,
            color,
            repository,
            workflow,
            actor,
            ref,
            runId,
            runUrl
        });
    }

    return getPlainTextTemplate({
        statusLabel,
        repository,
        workflow,
        actor,
        ref,
        runId,
        runUrl
    });
}

/**
 * Returns the HTML email template.
 */
function getHtmlTemplate(data) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.6; color: #24292e; margin: 0; padding: 20px; background-color: #f6f8fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.12);">
    <tr>
      <td style="padding: 30px; background-color: ${data.color}; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Workflow ${data.statusLabel}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px;">
        <h2 style="margin-top: 0; color: #24292e; font-size: 20px;">Workflow Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #586069; font-weight: 600;">Repository:</td>
            <td style="padding: 8px 0; color: #24292e;">${data.repository}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #586069; font-weight: 600;">Workflow:</td>
            <td style="padding: 8px 0; color: #24292e;">${data.workflow}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #586069; font-weight: 600;">Status:</td>
            <td style="padding: 8px 0; color: ${data.color}; font-weight: 600;">${data.statusLabel}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #586069; font-weight: 600;">Triggered by:</td>
            <td style="padding: 8px 0; color: #24292e;">${data.actor}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #586069; font-weight: 600;">Branch/Ref:</td>
            <td style="padding: 8px 0; color: #24292e;">${data.ref}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #586069; font-weight: 600;">Run ID:</td>
            <td style="padding: 8px 0; color: #24292e;">${data.runId}</td>
          </tr>
        </table>
        <div style="margin-top: 30px; text-align: center;">
          <a href="${data.runUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0366d6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">View Workflow Run</a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; background-color: #f6f8fa; text-align: center; color: #586069; font-size: 12px;">
        <p style="margin: 0;">Sent via <strong>Elastic Email</strong> from GitHub Actions</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Returns the PlainText email template.
 */
function getPlainTextTemplate(data) {
    return `Workflow ${data.statusLabel}

Repository: ${data.repository}
Workflow: ${data.workflow}
Status: ${data.statusLabel}
Triggered by: ${data.actor}
Branch/Ref: ${data.ref}
Run ID: ${data.runId}

View the workflow run: ${data.runUrl}

Sent via Elastic Email from GitHub Actions`;
}

module.exports = {
    generateEmailBody
};
