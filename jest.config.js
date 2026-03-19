module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'index.js',
        '!dist/**',
        '!node_modules/**'
    ],
    testMatch: [
        '**/__tests__/**/*.test.js'
    ],
    verbose: true
};
