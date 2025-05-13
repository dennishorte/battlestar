module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'],
  collectCoverageFrom: [
    'src/**/*.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/config/test.js'
  ],
  moduleNameMapper: {
    '#/(.*)': '<rootDir>/src/$1'
  }
}
