module.exports = {
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.js"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "controllers/**/*.js",
        "models/**/*.js",
        "routes/**/*.js",
        "middleware/**/*.js",
        "utils/**/*.js",
        "config/**/*.js",
        "!**/node_modules/**",
        "!**/tests/**",
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    setupFilesAfterEnv: ["./tests/setup.js"],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    restoreMocks: true,
};
