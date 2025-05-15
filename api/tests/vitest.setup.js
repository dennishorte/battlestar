// This file is necessary for Vitest tests to run
// It can be used for global test setup like setting environment variables

// Set test environment
process.env.NODE_ENV = 'test'

// Set any other necessary environment variables
process.env.SECRET_KEY = 'test-secret-key'
