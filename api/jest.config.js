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
    '@/(.*)': '<rootDir>/src/$1',
    '@models/(.*)': '<rootDir>/src/models/$1',
    '@controllers/(.*)': '<rootDir>/src/controllers/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
    '@services/(.*)': '<rootDir>/src/services/$1',
    '@middleware/(.*)': '<rootDir>/src/middleware/$1',
    '@routes/(.*)': '<rootDir>/src/routes/$1'
  }
}
