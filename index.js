const { run } = require('./src/main');

/**
 * Entry point for the GitHub Action.
 * Invokes the core logic and ensures appropriate exit handling.
 */
if (require.main === module) {
  run().catch(() => {
    // Error is already logged and core.setFailed set in main.js
    process.exit(1);
  });
}

// Export for testing compatibility
module.exports = {
  run,
  // Maintaining these exports temporarily for test compatibility if needed
  sendEmail: run,
  generateEmailBody: require('./src/templates').generateEmailBody
};
