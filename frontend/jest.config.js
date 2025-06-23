module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  testMatch: ['**/__test__/**/*.test.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testEnvironment: 'jsdom',
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Frontend Test Report',
      outputPath: './src/__test__/test-report.html',
    }],
  ],
};
